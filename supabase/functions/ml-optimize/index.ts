import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://esm.sh/zod@3.22.4";

// Validation schemas
const PipeSchema = z.object({
  id: z.string().min(1).max(50),
  length: z.number().positive().max(10000),
  diameter: z.number().int().positive().max(1000),
  flow: z.number().nonnegative().max(100),
  cFactor: z.number().int().min(50).max(150),
});

const NetworkSchema = z.object({
  pipes: z.array(PipeSchema).min(1).max(1000),
});

const MLOptimizeRequestSchema = z.object({
  networkData: NetworkSchema,
  requestType: z.enum(['suggest_fixes', 'learn_from_history']),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-auth-token',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authToken = req.headers.get('x-auth-token');
    const validToken = Deno.env.get('APP_AUTH_TOKEN');
    
    if (!authToken || authToken !== validToken) {
      console.log('Authentication failed');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    
    let validated;
    try {
      validated = MLOptimizeRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid input data',
            details: error.errors 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    const { networkData, requestType } = validated;

    // Initialize Supabase client with service role for database writes
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Fetch historical fix data (all data, no user filtering)
    const { data: fixHistory, error: historyError } = await supabase
      .from('fix_history')
      .select('*')
      .order('applied_at', { ascending: false })
      .limit(50);

    if (historyError) {
      console.error('Error fetching fix history:', historyError);
    }

    // Sanitize historical data before sending to AI (remove sensitive identifiers)
    const sanitizedHistory = fixHistory ? fixHistory.slice(0, 10).map(fix => ({
      issue_type: fix.issue_type,
      severity: fix.severity,
      parameter_changed: fix.parameter_changed,
      value_before: fix.value_before,
      value_after: fix.value_after,
      success_rating: fix.success_rating
    })) : [];

    const historyContext = sanitizedHistory.length > 0
      ? `Historical fix data (${fixHistory?.length || 0} past fixes):\n${JSON.stringify(sanitizedHistory, null, 2)}`
      : "No historical data available yet.";

    let systemPrompt = "";
    let userPrompt = "";

    if (requestType === "suggest_fixes") {
      systemPrompt = `You are an expert vacuum sewer network optimization AI trained on EPA standards and engineering best practices. 
You analyze network configurations and suggest fixes based on:
- Velocity requirements (0.6-6.0 m/s optimal)
- C-factor adjustments for two-phase flow (100-120 for vacuum systems)
- Headloss optimization
- Historical fix patterns and success rates

${historyContext}

Provide specific, actionable recommendations with confidence scores.`;

      // Sanitize network data (only include validated pipe data)
      const sanitizedData = {
        pipes: networkData.pipes.map(p => ({
          id: p.id,
          length: p.length,
          diameter: p.diameter,
          flow: p.flow,
          cFactor: p.cFactor
        }))
      };

      userPrompt = `Analyze this vacuum sewer network and suggest optimizations:
${JSON.stringify(sanitizedData, null, 2)}

For each issue found, provide:
1. Pipe ID
2. Issue type
3. Specific fix recommendation
4. Expected improvement
5. Confidence score (0-1)

Return your analysis as structured suggestions.`;

    } else if (requestType === "learn_from_history") {
      systemPrompt = `You are a machine learning model analyzing vacuum sewer network optimization patterns.
Study the historical fix data to identify:
1. Which types of fixes are most successful
2. Common patterns in network issues
3. Optimal parameter values for different scenarios
4. Correlations between pipe characteristics and required fixes

${historyContext}

Provide insights that can improve future recommendations.`;

      userPrompt = `Analyze the historical fix data and provide insights on:
1. Most effective optimization strategies
2. Common failure patterns
3. Parameter correlations
4. Recommendations for future fixes

Focus on actionable learnings that improve accuracy.`;
    }

    // Call Lovable AI
    console.log("Calling Lovable AI for ML analysis...");
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    console.log("AI analysis complete");

    // Store ML suggestions in database (no user_id needed)
    if (requestType === "suggest_fixes" && analysis) {
      const { error: insertError } = await supabase
        .from('ml_suggestions')
        .insert({
          user_id: null,
          suggestion_text: analysis,
          confidence_score: 0.85,
          based_on_fixes: fixHistory?.length || 0,
          suggestion_type: 'ml_optimization',
          target_pipes: networkData.pipes?.map((p: any) => p.id) || []
        });

      if (insertError) {
        console.error('Error storing ML suggestion:', insertError);
      }
    }

    return new Response(
      JSON.stringify({ 
        analysis,
        basedOnFixes: fixHistory?.length || 0,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in ml-optimize function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
