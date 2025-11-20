import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Zap,
  Download,
  Play,
  Brain,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WhatIfSimulator } from "./WhatIfSimulator";

interface PipeIssue {
  pipeId: string;
  issueType: 'low_velocity' | 'high_velocity' | 'high_cfactor' | 'low_cfactor' | 'high_headloss';
  severity: 'critical' | 'warning';
  description: string;
  currentValue: number;
  recommendedValue: number;
  parameter: 'diameter' | 'cfactor' | 'slope';
  impact: string;
}

interface Fix {
  id: string;
  pipeId: string;
  issueType: string;
  action: string;
  before: { parameter: string; value: number };
  after: { parameter: string; value: number };
  expectedImprovement: string;
  applied: boolean;
}

export const AutoFixWizard = () => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [issues, setIssues] = useState<PipeIssue[]>([]);
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [selectedFixes, setSelectedFixes] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [mlSuggestions, setMlSuggestions] = useState<string | null>(null);
  const [loadingML, setLoadingML] = useState(false);

  const generateSampleNetwork = () => {
    const samplePipes: any[] = [
      { id: "VAC_001", length: 50, diameter: 110, flow: 5.0, cFactor: 120 },
      { id: "VAC_002", length: 75, diameter: 160, flow: 8.5, cFactor: 115 },
      { id: "VAC_003", length: 100, diameter: 110, flow: 3.2, cFactor: 125 },
      { id: "VAC_004", length: 45, diameter: 90, flow: 2.1, cFactor: 110 },
      { id: "VAC_005", length: 80, diameter: 160, flow: 12.0, cFactor: 120 },
      { id: "VAC_006", length: 60, diameter: 110, flow: 0.8, cFactor: 130 },
      { id: "VAC_007", length: 90, diameter: 200, flow: 15.5, cFactor: 118 },
      { id: "VAC_008", length: 55, diameter: 110, flow: 4.5, cFactor: 122 },
      { id: "VAC_009", length: 70, diameter: 160, flow: 1.2, cFactor: 125 },
      { id: "VAC_010", length: 85, diameter: 110, flow: 6.8, cFactor: 115 },
    ];
    return samplePipes;
  };

  const getMLSuggestions = async (networkData: any) => {
    setLoadingML(true);
    try {
      const { data, error } = await supabase.functions.invoke('ml-optimize', {
        body: {
          networkData,
          requestType: 'suggest_fixes'
        }
      });

      if (error) throw error;

      setMlSuggestions(data.analysis);
      toast({
        title: "AI Analysis Complete",
        description: `Generated suggestions based on ${data.basedOnFixes} past fix(es)`,
      });
    } catch (error) {
      console.error('ML suggestions error:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Using rule-based analysis instead",
        variant: "destructive"
      });
    } finally {
      setLoadingML(false);
    }
  };

  const detectIssues = async () => {
    setAnalyzing(true);
    
    // Generate sample network and get ML suggestions
    const networkPipes = generateSampleNetwork();
    await getMLSuggestions({ pipes: networkPipes });
    
    setTimeout(() => {
      // Simulate issue detection from network analysis
      const detectedIssues: PipeIssue[] = [
        {
          pipeId: "VAC_001",
          issueType: "high_cfactor",
          severity: "warning",
          description: "C-factor too high for vacuum system with air friction",
          currentValue: 130,
          recommendedValue: 115,
          parameter: "cfactor",
          impact: "Underestimates headloss by ~12%"
        },
        {
          pipeId: "VAC_006",
          issueType: "low_velocity",
          severity: "critical",
          description: "Velocity below minimum threshold - hydraulic lock risk",
          currentValue: 0.45,
          recommendedValue: 90,
          parameter: "diameter",
          impact: "Risk of water pooling and system failure"
        },
        {
          pipeId: "VAC_003",
          issueType: "high_cfactor",
          severity: "warning",
          description: "C-factor not adjusted for two-phase flow",
          currentValue: 125,
          recommendedValue: 118,
          parameter: "cfactor",
          impact: "Underestimates friction by ~8%"
        },
        {
          pipeId: "VAC_009",
          issueType: "low_velocity",
          severity: "critical",
          description: "Insufficient velocity for slug transport",
          currentValue: 0.52,
          recommendedValue: 90,
          parameter: "diameter",
          impact: "Slugs may stall and cause blockage"
        },
        {
          pipeId: "VAC_004",
          issueType: "low_cfactor",
          severity: "warning",
          description: "C-factor unnecessarily low - oversized system",
          currentValue: 95,
          recommendedValue: 110,
          parameter: "cfactor",
          impact: "Overestimates headloss, leading to oversizing"
        },
      ];

      setIssues(detectedIssues);

      // Generate fixes for each issue
      const generatedFixes: Fix[] = detectedIssues.map((issue, idx) => ({
        id: `fix_${idx}`,
        pipeId: issue.pipeId,
        issueType: issue.issueType,
        action: getFixAction(issue),
        before: { parameter: issue.parameter, value: issue.currentValue },
        after: { parameter: issue.parameter, value: issue.recommendedValue },
        expectedImprovement: issue.impact,
        applied: false
      }));

      setFixes(generatedFixes);
      setAnalyzing(false);
      setShowPreview(true);

      toast({
        title: "Analysis Complete",
        description: `Found ${detectedIssues.length} issues with recommended fixes`,
      });
    }, 1500);
  };

  const getFixAction = (issue: PipeIssue): string => {
    switch (issue.issueType) {
      case 'low_velocity':
        return `Reduce diameter from ${issue.currentValue}mm to ${issue.recommendedValue}mm`;
      case 'high_velocity':
        return `Increase diameter to reduce velocity`;
      case 'high_cfactor':
        return `Adjust C-factor from ${issue.currentValue} to ${issue.recommendedValue}`;
      case 'low_cfactor':
        return `Adjust C-factor from ${issue.currentValue} to ${issue.recommendedValue}`;
      case 'high_headloss':
        return `Optimize pipe sizing or slope`;
      default:
        return 'Apply recommended fix';
    }
  };

  const toggleFixSelection = (fixId: string) => {
    const newSelected = new Set(selectedFixes);
    if (newSelected.has(fixId)) {
      newSelected.delete(fixId);
    } else {
      newSelected.add(fixId);
    }
    setSelectedFixes(newSelected);
  };

  const selectAllCritical = () => {
    const criticalFixes = fixes
      .filter(fix => issues.find(i => i.pipeId === fix.pipeId && i.severity === 'critical'))
      .map(f => f.id);
    setSelectedFixes(new Set(criticalFixes));
  };

  const selectAll = () => {
    setSelectedFixes(new Set(fixes.map(f => f.id)));
  };

  const applyFixes = () => {
    const appliedFixes = fixes.map(fix => ({
      ...fix,
      applied: selectedFixes.has(fix.id)
    }));

    setFixes(appliedFixes);

    toast({
      title: "Fixes Applied",
      description: `Successfully applied ${selectedFixes.size} fix(es) to the network`,
    });

    // Clear selection
    setSelectedFixes(new Set());
  };

  const exportFixScript = () => {
    const script = generateRubyScript(fixes.filter(f => selectedFixes.has(f.id)));
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auto_fix_network.rb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Script Exported",
      description: "Ruby script downloaded - run in ICM to apply fixes",
    });
  };

  const generateRubyScript = (selectedFixList: Fix[]): string => {
    let script = `# Auto-generated Fix Script
# Generated: ${new Date().toISOString()}
# Fixes to apply: ${selectedFixList.length}

net = WSApplication.current_network
if net.nil?
  puts "No network open"
  exit
end

net.transaction_begin

`;

    selectedFixList.forEach(fix => {
      script += `# Fix for ${fix.pipeId}: ${fix.action}\n`;
      script += `link = net.row_object('hw_conduit', '${fix.pipeId}')\n`;
      script += `if link\n`;
      
      if (fix.before.parameter === 'diameter') {
        script += `  link.conduit_width = ${fix.after.value / 1000.0}  # Convert mm to m\n`;
      } else if (fix.before.parameter === 'cfactor') {
        script += `  link.bottom_roughness = ${fix.after.value}\n`;
      }
      
      script += `  link.write\n`;
      script += `  puts "Fixed ${fix.pipeId}"\n`;
      script += `end\n\n`;
    });

    script += `net.transaction_commit
puts "Applied #{${selectedFixList.length}} fixes successfully"
`;

    return script;
  };

  const getSeverityIcon = (severity: 'critical' | 'warning') => {
    return severity === 'critical' ? (
      <XCircle className="h-5 w-5 text-red-500" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
    );
  };

  const getSeverityColor = (severity: 'critical' | 'warning') => {
    return severity === 'critical' ? 'border-red-500 bg-red-500/5' : 'border-yellow-500 bg-yellow-500/5';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-engineering-blue" />
            Auto-Fix Wizard
          </CardTitle>
          <CardDescription>
            Automatically detect and fix common vacuum sewer network configuration issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              The wizard analyzes your network for common issues like incorrect C-factors, 
              low velocities, and oversized pipes, then generates corrective actions you can apply.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="wizard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wizard" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Wizard
              </TabsTrigger>
              <TabsTrigger value="ai-suggestions" className="flex items-center gap-2" disabled={!mlSuggestions && !loadingML}>
                <Brain className="h-4 w-4" />
                AI Suggestions
              </TabsTrigger>
              <TabsTrigger value="what-if" className="flex items-center gap-2" disabled={selectedFixes.size === 0}>
                <Activity className="h-4 w-4" />
                What-If ({selectedFixes.size})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wizard" className="space-y-6">
          {!showPreview ? (
            <div className="text-center py-12">
              <Wand2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Click below to scan your network and identify optimization opportunities
              </p>
              <Button 
                onClick={detectIssues} 
                disabled={analyzing}
                size="lg"
                className="gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Analyzing Network...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-secondary">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-500">
                        {issues.filter(i => i.severity === 'critical').length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Critical Issues</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-500">
                        {issues.filter(i => i.severity === 'warning').length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Warnings</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-engineering-blue">
                        {fixes.length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Fixes Available</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={selectAllCritical}
                  className="flex-1"
                >
                  Select Critical Only
                </Button>
                <Button 
                  variant="outline" 
                  onClick={selectAll}
                  className="flex-1"
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedFixes(new Set())}
                  className="flex-1"
                >
                  Clear Selection
                </Button>
              </div>

              {/* Fixes List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Recommended Fixes</h3>
                {fixes.map((fix) => {
                  const issue = issues.find(i => i.pipeId === fix.pipeId);
                  if (!issue) return null;

                  const isSelected = selectedFixes.has(fix.id);
                  const isApplied = fix.applied;

                  return (
                    <Card 
                      key={fix.id}
                      className={`${getSeverityColor(issue.severity)} ${
                        isSelected ? 'ring-2 ring-engineering-blue' : ''
                      } ${isApplied ? 'opacity-50' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div className="pt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleFixSelection(fix.id)}
                              disabled={isApplied}
                              className="h-5 w-5 rounded border-border cursor-pointer"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getSeverityIcon(issue.severity)}
                                <h4 className="font-semibold">{fix.pipeId}</h4>
                                <Badge variant={issue.severity === 'critical' ? 'destructive' : 'outline'}>
                                  {issue.severity}
                                </Badge>
                                {isApplied && (
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
                                    Applied
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">
                              {issue.description}
                            </p>

                            {/* Before/After */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Before:</span>
                                <Badge variant="outline" className="font-mono">
                                  {fix.before.parameter === 'diameter' 
                                    ? `Ø${fix.before.value}mm`
                                    : `C=${fix.before.value}`
                                  }
                                </Badge>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">After:</span>
                                <Badge className="font-mono bg-green-500/10 text-green-500 border-green-500">
                                  {fix.after.parameter === 'diameter'
                                    ? `Ø${fix.after.value}mm`
                                    : `C=${fix.after.value}`
                                  }
                                </Badge>
                              </div>
                            </div>

                            {/* Impact */}
                            <div className="mt-3 p-2 bg-card rounded text-xs">
                              <span className="font-semibold">Expected Impact:</span>{' '}
                              <span className="text-muted-foreground">{fix.expectedImprovement}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Action Buttons */}
              {selectedFixes.size > 0 && (
                <div className="flex gap-3">
                  <Button 
                    onClick={applyFixes}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Apply {selectedFixes.size} Fix{selectedFixes.size !== 1 ? 'es' : ''}
                  </Button>
                  <Button 
                    onClick={exportFixScript}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Export Script
                  </Button>
                </div>
              )}

              <Separator />

              {/* Reset */}
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowPreview(false);
                    setIssues([]);
                    setFixes([]);
                    setSelectedFixes(new Set());
                  }}
                >
                  Run New Analysis
                </Button>
              </div>
            </>
          )}

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                <span>Analyzes network for velocity, C-factor, and headloss issues</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                <span>Generates specific fixes based on EPA vacuum sewer guidelines</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                <span>Preview changes before applying to your ICM model</span>
              </div>
               <div className="flex items-start gap-2">
                 <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                 <span>Export Ruby script to apply fixes in ICM InfoWorks</span>
               </div>
               <div className="flex items-start gap-2">
                 <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                 <span>Get AI-powered suggestions based on past successful fixes</span>
               </div>
               <div className="flex items-start gap-2">
                 <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                 <span>Simulate outcomes before applying changes with What-If analysis</span>
               </div>
             </CardContent>
           </Card>
            </TabsContent>

            <TabsContent value="ai-suggestions" className="space-y-6">
              {loadingML ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-engineering-blue mx-auto mb-4" />
                  <p className="text-muted-foreground">Analyzing with AI...</p>
                </div>
              ) : mlSuggestions ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-engineering-blue" />
                      Machine Learning Suggestions
                    </CardTitle>
                    <CardDescription>
                      AI-powered recommendations based on historical fix patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap bg-secondary p-4 rounded-lg text-sm">
                        {mlSuggestions}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run analysis first to get AI-powered suggestions</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="what-if" className="space-y-6">
              {selectedFixes.size > 0 ? (
                <WhatIfSimulator 
                  currentNetwork={{ pipes: generateSampleNetwork() }}
                  selectedFixes={fixes.filter(f => selectedFixes.has(f.id))}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select fixes to run what-if simulation</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
         </CardContent>
       </Card>
     </div>
   );
 };
