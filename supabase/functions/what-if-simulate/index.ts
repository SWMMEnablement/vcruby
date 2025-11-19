import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentNetwork, proposedFixes } = await req.json();
    
    console.log("Starting what-if simulation...");
    console.log("Current network pipes:", currentNetwork.pipes?.length);
    console.log("Proposed fixes:", proposedFixes?.length);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate current state metrics
    const currentMetrics = calculateNetworkMetrics(currentNetwork.pipes);
    
    // Apply fixes and calculate projected state
    const projectedPipes = applyFixesToNetwork(currentNetwork.pipes, proposedFixes);
    const projectedMetrics = calculateNetworkMetrics(projectedPipes);

    // Calculate improvements
    const improvements = {
      healthScore: projectedMetrics.healthScore - currentMetrics.healthScore,
      avgVelocity: projectedMetrics.avgVelocity - currentMetrics.avgVelocity,
      criticalIssues: currentMetrics.criticalIssues - projectedMetrics.criticalIssues,
      warnings: currentMetrics.warnings - projectedMetrics.warnings,
      lowVelocityCount: currentMetrics.lowVelocityCount - projectedMetrics.lowVelocityCount,
      avgCFactor: projectedMetrics.avgCFactor - currentMetrics.avgCFactor
    };

    // Generate recommendation
    const recommendation = generateRecommendation(improvements, proposedFixes.length);

    // Store snapshot
    const { error: snapshotError } = await supabase
      .from('network_snapshots')
      .insert({
        snapshot_name: `What-If: ${new Date().toISOString()}`,
        pipes_data: projectedPipes,
        overall_stats: projectedMetrics
      });

    if (snapshotError) {
      console.error('Error storing snapshot:', snapshotError);
    }

    console.log("Simulation complete");

    return new Response(
      JSON.stringify({
        current: currentMetrics,
        projected: projectedMetrics,
        improvements,
        recommendation,
        fixesApplied: proposedFixes.length,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in what-if-simulate function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function calculateNetworkMetrics(pipes: any[]) {
  const velocities = pipes.map(p => {
    const qCms = p.flow / 1000.0;
    const dM = p.diameter / 1000.0;
    const area = Math.PI * Math.pow(dM / 2, 2);
    return qCms / area;
  });

  const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  const minVelocity = Math.min(...velocities);
  const maxVelocity = Math.max(...velocities);
  
  const lowVelocityCount = velocities.filter(v => v < 0.6).length;
  const highVelocityCount = velocities.filter(v => v > 6.0).length;
  
  const avgCFactor = pipes.reduce((sum, p) => sum + p.cFactor, 0) / pipes.length;
  
  // Calculate critical issues and warnings
  let criticalIssues = 0;
  let warnings = 0;
  
  pipes.forEach((pipe, idx) => {
    const velocity = velocities[idx];
    if (velocity < 0.6) criticalIssues++;
    if (velocity > 6.0) warnings++;
    if (pipe.cFactor > 130) warnings++;
    if (pipe.cFactor < 100) warnings++;
  });

  // Calculate health score
  let healthScore = 100;
  healthScore -= criticalIssues * 15;
  healthScore -= warnings * 5;
  healthScore -= lowVelocityCount * 8;
  healthScore -= highVelocityCount * 5;
  healthScore = Math.max(0, Math.min(100, healthScore));

  return {
    totalPipes: pipes.length,
    avgVelocity: parseFloat(avgVelocity.toFixed(2)),
    minVelocity: parseFloat(minVelocity.toFixed(2)),
    maxVelocity: parseFloat(maxVelocity.toFixed(2)),
    avgCFactor: parseFloat(avgCFactor.toFixed(1)),
    lowVelocityCount,
    highVelocityCount,
    criticalIssues,
    warnings,
    healthScore: Math.round(healthScore)
  };
}

function applyFixesToNetwork(pipes: any[], fixes: any[]) {
  const pipesCopy = JSON.parse(JSON.stringify(pipes));
  
  fixes.forEach(fix => {
    const pipe = pipesCopy.find((p: any) => p.id === fix.pipeId);
    if (pipe) {
      if (fix.before.parameter === 'diameter') {
        pipe.diameter = fix.after.value;
      } else if (fix.before.parameter === 'cfactor') {
        pipe.cFactor = fix.after.value;
      }
    }
  });
  
  return pipesCopy;
}

function generateRecommendation(improvements: any, fixCount: number) {
  const messages = [];
  
  if (improvements.healthScore > 20) {
    messages.push("✅ Excellent improvement! Strongly recommended.");
  } else if (improvements.healthScore > 10) {
    messages.push("✅ Good improvement. Recommended.");
  } else if (improvements.healthScore > 0) {
    messages.push("⚠️ Minor improvement. Consider if cost-effective.");
  } else {
    messages.push("❌ No significant improvement. Review fixes.");
  }

  if (improvements.criticalIssues > 0) {
    messages.push(`Resolves ${improvements.criticalIssues} critical issue(s).`);
  }
  
  if (improvements.lowVelocityCount > 0) {
    messages.push(`Fixes ${improvements.lowVelocityCount} low velocity pipe(s).`);
  }

  return {
    summary: messages[0],
    details: messages.slice(1),
    score: improvements.healthScore > 10 ? "recommended" : 
           improvements.healthScore > 0 ? "neutral" : "not_recommended"
  };
}
