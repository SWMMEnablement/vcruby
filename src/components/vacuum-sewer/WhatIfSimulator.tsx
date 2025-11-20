import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getAuthToken } from "@/lib/authToken";

interface Fix {
  pipeId: string;
  before: { parameter: string; value: number };
  after: { parameter: string; value: number };
}

interface WhatIfSimulatorProps {
  currentNetwork: any;
  selectedFixes: Fix[];
}

export const WhatIfSimulator = ({ currentNetwork, selectedFixes }: WhatIfSimulatorProps) => {
  const { toast } = useToast();
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = async () => {
    if (selectedFixes.length === 0) {
      toast({
        title: "No Fixes Selected",
        description: "Please select at least one fix to simulate",
        variant: "destructive"
      });
      return;
    }

    setSimulating(true);

    try {
      const { data, error } = await supabase.functions.invoke('what-if-simulate', {
        body: {
          currentNetwork,
          proposedFixes: selectedFixes
        },
        headers: {
          'x-auth-token': getAuthToken()
        }
      });

      if (error) throw error;

      setResults(data);
      
      toast({
        title: "Simulation Complete",
        description: `Analyzed ${selectedFixes.length} proposed fix(es)`,
      });
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setSimulating(false);
    }
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeColor = (value: number, inverse = false) => {
    const positive = inverse ? value < 0 : value > 0;
    if (positive) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-engineering-blue" />
            What-If Simulator
          </CardTitle>
          <CardDescription>
            Preview the impact of selected fixes before applying them to your network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              This simulator calculates predicted network performance after applying your selected fixes.
              Results show expected improvements in health score, velocity distribution, and issue resolution.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <p className="text-sm font-semibold">Fixes to Simulate</p>
              <p className="text-2xl font-bold text-engineering-blue">{selectedFixes.length}</p>
            </div>
            <Button 
              onClick={runSimulation} 
              disabled={simulating || selectedFixes.length === 0}
              className="gap-2"
            >
              {simulating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Simulating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>

          {results && (
            <>
              {/* Recommendation */}
              <Card className={`border-2 ${
                results.recommendation.score === 'recommended' ? 'border-green-500 bg-green-500/5' :
                results.recommendation.score === 'neutral' ? 'border-yellow-500 bg-yellow-500/5' :
                'border-red-500 bg-red-500/5'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {results.recommendation.score === 'recommended' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {results.recommendation.score === 'neutral' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {results.recommendation.score === 'not_recommended' && <XCircle className="h-5 w-5 text-red-500" />}
                    Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">{results.recommendation.summary}</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {results.recommendation.details.map((detail: string, idx: number) => (
                      <li key={idx}>• {detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Health Score Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Score Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Current</p>
                      <Progress value={results.current.healthScore} className="h-3" />
                      <p className="text-2xl font-bold mt-2">{results.current.healthScore}</p>
                    </div>
                    <ArrowRight className="h-8 w-8 mx-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Projected</p>
                      <Progress value={results.projected.healthScore} className="h-3" />
                      <p className="text-2xl font-bold mt-2 text-green-500">{results.projected.healthScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-lg">
                    {getChangeIcon(results.improvements.healthScore)}
                    <span className={`font-semibold ${getChangeColor(results.improvements.healthScore)}`}>
                      {results.improvements.healthScore > 0 ? '+' : ''}{results.improvements.healthScore} points
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">{results.current.criticalIssues}</p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{results.projected.criticalIssues}</p>
                        <p className="text-xs text-muted-foreground">Projected</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-secondary rounded">
                      {getChangeIcon(-results.improvements.criticalIssues)}
                      <span className={`text-sm font-semibold ${getChangeColor(results.improvements.criticalIssues, true)}`}>
                        {results.improvements.criticalIssues} resolved
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-500">{results.current.warnings}</p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{results.projected.warnings}</p>
                        <p className="text-xs text-muted-foreground">Projected</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-secondary rounded">
                      {getChangeIcon(-results.improvements.warnings)}
                      <span className={`text-sm font-semibold ${getChangeColor(results.improvements.warnings, true)}`}>
                        {results.improvements.warnings} resolved
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Low Velocity Pipes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">{results.current.lowVelocityCount}</p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{results.projected.lowVelocityCount}</p>
                        <p className="text-xs text-muted-foreground">Projected</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-secondary rounded">
                      {getChangeIcon(-results.improvements.lowVelocityCount)}
                      <span className={`text-sm font-semibold ${getChangeColor(results.improvements.lowVelocityCount, true)}`}>
                        {results.improvements.lowVelocityCount} fixed
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Average Velocity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-engineering-blue">{results.current.avgVelocity}</p>
                        <p className="text-xs text-muted-foreground">m/s Current</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{results.projected.avgVelocity}</p>
                        <p className="text-xs text-muted-foreground">m/s Projected</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-secondary rounded">
                      {getChangeIcon(results.improvements.avgVelocity)}
                      <span className={`text-sm font-semibold ${getChangeColor(results.improvements.avgVelocity)}`}>
                        {results.improvements.avgVelocity > 0 ? '+' : ''}{results.improvements.avgVelocity} m/s
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {!results && !simulating && (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select fixes and run simulation to see predicted results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
