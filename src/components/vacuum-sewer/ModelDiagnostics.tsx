import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Network,
  Gauge,
  BarChart3
} from "lucide-react";

interface PipeData {
  id: string;
  length: number;
  diameter: number;
  flow: number;
  cFactor: number;
  velocity?: number;
  headloss?: number;
  issues?: string[];
}

interface NetworkStats {
  totalPipes: number;
  totalLength: number;
  avgCFactor: number;
  avgVelocity: number;
  minVelocity: number;
  maxVelocity: number;
  lowVelocityCount: number;
  highVelocityCount: number;
  criticalIssues: number;
  warnings: number;
  healthScore: number;
}

export const ModelDiagnostics = () => {
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Simulated network data for demonstration
  const generateSampleNetwork = () => {
    const samplePipes: PipeData[] = [
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

  const analyzeNetwork = () => {
    setAnalyzing(true);
    
    // Simulate loading
    setTimeout(() => {
      const networkPipes = generateSampleNetwork();
      
      // Calculate velocities and headloss for each pipe
      const analyzedPipes = networkPipes.map(pipe => {
        const qCms = pipe.flow / 1000.0;
        const dM = pipe.diameter / 1000.0;
        const area = Math.PI * Math.pow(dM / 2, 2);
        const velocity = qCms / area;
        
        // Hazen-Williams headloss
        const headloss = 10.67 * pipe.length * Math.pow(qCms, 1.852) / 
                        (Math.pow(pipe.cFactor, 1.852) * Math.pow(dM, 4.87));
        
        // Identify issues
        const issues: string[] = [];
        if (velocity < 0.6) issues.push("Low velocity - Risk of hydraulic lock");
        if (velocity > 6.0) issues.push("High velocity - Excessive wear/noise");
        if (pipe.cFactor > 130) issues.push("C-factor too high for vacuum (air not accounted)");
        if (pipe.cFactor < 100) issues.push("C-factor too low - Check roughness");
        if (headloss / pipe.length > 0.05) issues.push("High headloss gradient");
        
        return {
          ...pipe,
          velocity: parseFloat(velocity.toFixed(2)),
          headloss: parseFloat(headloss.toFixed(3)),
          issues: issues.length > 0 ? issues : undefined
        };
      });
      
      setPipes(analyzedPipes);
      
      // Calculate statistics
      const totalLength = analyzedPipes.reduce((sum, p) => sum + p.length, 0);
      const avgCFactor = analyzedPipes.reduce((sum, p) => sum + p.cFactor, 0) / analyzedPipes.length;
      const velocities = analyzedPipes.map(p => p.velocity!).filter(v => v !== undefined);
      const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      const minVelocity = Math.min(...velocities);
      const maxVelocity = Math.max(...velocities);
      
      const lowVelocityCount = analyzedPipes.filter(p => p.velocity! < 0.6).length;
      const highVelocityCount = analyzedPipes.filter(p => p.velocity! > 6.0).length;
      
      const pipesWithIssues = analyzedPipes.filter(p => p.issues && p.issues.length > 0);
      const criticalIssues = pipesWithIssues.filter(p => 
        p.issues?.some(i => i.includes("hydraulic lock") || i.includes("High headloss"))
      ).length;
      const warnings = pipesWithIssues.length - criticalIssues;
      
      // Calculate health score (0-100)
      let healthScore = 100;
      healthScore -= criticalIssues * 15;
      healthScore -= warnings * 5;
      healthScore -= (lowVelocityCount * 8);
      healthScore -= (highVelocityCount * 5);
      healthScore = Math.max(0, Math.min(100, healthScore));
      
      setStats({
        totalPipes: analyzedPipes.length,
        totalLength,
        avgCFactor: parseFloat(avgCFactor.toFixed(1)),
        avgVelocity: parseFloat(avgVelocity.toFixed(2)),
        minVelocity: parseFloat(minVelocity.toFixed(2)),
        maxVelocity: parseFloat(maxVelocity.toFixed(2)),
        lowVelocityCount,
        highVelocityCount,
        criticalIssues,
        warnings,
        healthScore: Math.round(healthScore)
      });
      
      setAnalyzing(false);
    }, 1500);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-engineering-blue" />
            ICM Model Diagnostics
          </CardTitle>
          <CardDescription>
            Analyze your vacuum sewer network configuration and identify potential issues before simulation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Network className="h-4 w-4" />
            <AlertDescription>
              This tool analyzes pipe configurations, velocities, C-factors, and identifies common modeling issues.
              In a real ICM implementation, this would read data directly from the network via Ruby API.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              onClick={analyzeNetwork} 
              disabled={analyzing}
              className="flex-1"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing Network...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>

          {stats && (
            <>
              {/* Health Score */}
              <Card className="bg-secondary">
                <CardHeader>
                  <CardTitle className="text-lg">Network Health Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-5xl font-bold ${getHealthColor(stats.healthScore)}`}>
                        {stats.healthScore}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Status: {getHealthStatus(stats.healthScore)}
                      </p>
                    </div>
                    <div className="text-right">
                      {stats.criticalIssues > 0 && (
                        <Badge variant="destructive" className="mb-2">
                          {stats.criticalIssues} Critical
                        </Badge>
                      )}
                      {stats.warnings > 0 && (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500">
                          {stats.warnings} Warnings
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={stats.healthScore} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    Score based on velocity range compliance, C-factor appropriateness, and identified issues
                  </p>
                </CardContent>
              </Card>

              {/* Network Statistics */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Vacuum Pipes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-engineering-blue">{stats.totalPipes}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.totalLength.toFixed(0)}m total length
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg C-Factor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-engineering-blue">{stats.avgCFactor}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hazen-Williams roughness
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg Velocity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-engineering-blue">{stats.avgVelocity} m/s</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Range: {stats.minVelocity} - {stats.maxVelocity} m/s
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Velocity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Velocity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Low (&lt; 0.6 m/s)</span>
                        <span className="font-semibold text-red-500">{stats.lowVelocityCount} pipes</span>
                      </div>
                      <Progress 
                        value={(stats.lowVelocityCount / stats.totalPipes) * 100} 
                        className="h-2 bg-red-100" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Optimal (0.6 - 6.0 m/s)</span>
                        <span className="font-semibold text-green-500">
                          {stats.totalPipes - stats.lowVelocityCount - stats.highVelocityCount} pipes
                        </span>
                      </div>
                      <Progress 
                        value={((stats.totalPipes - stats.lowVelocityCount - stats.highVelocityCount) / stats.totalPipes) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">High (&gt; 6.0 m/s)</span>
                        <span className="font-semibold text-yellow-500">{stats.highVelocityCount} pipes</span>
                      </div>
                      <Progress 
                        value={(stats.highVelocityCount / stats.totalPipes) * 100} 
                        className="h-2 bg-yellow-100" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues Summary */}
              {(stats.criticalIssues > 0 || stats.warnings > 0) && (
                <Card className="border-yellow-500 bg-yellow-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Issues Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.criticalIssues > 0 && (
                        <Alert className="bg-red-500/10 border-red-500">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <AlertDescription>
                            <strong>{stats.criticalIssues} Critical Issues:</strong> Pipes with hydraulic lock risk or excessive headloss
                          </AlertDescription>
                        </Alert>
                      )}
                      {stats.warnings > 0 && (
                        <Alert className="bg-yellow-500/10 border-yellow-500">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <AlertDescription>
                            <strong>{stats.warnings} Warnings:</strong> C-factor or velocity concerns requiring review
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Pipe Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pipe-by-Pipe Analysis</CardTitle>
                  <CardDescription>
                    Detailed breakdown of each pipe with calculated velocities and identified issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pipes.map((pipe) => (
                      <div 
                        key={pipe.id}
                        className={`p-4 rounded-lg border ${
                          pipe.issues ? 'border-yellow-500 bg-yellow-500/5' : 'border-border bg-secondary'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{pipe.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pipe.length}m × Ø{pipe.diameter}mm
                            </p>
                          </div>
                          {pipe.issues ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-muted-foreground">Flow</p>
                            <p className="font-semibold">{pipe.flow} L/s</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Velocity</p>
                            <p className={`font-semibold ${
                              pipe.velocity! < 0.6 ? 'text-red-500' : 
                              pipe.velocity! > 6.0 ? 'text-yellow-500' : 
                              'text-green-500'
                            }`}>
                              {pipe.velocity} m/s
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">C-Factor</p>
                            <p className="font-semibold">{pipe.cFactor}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Headloss</p>
                            <p className="font-semibold">{pipe.headloss} m</p>
                          </div>
                        </div>

                        {pipe.issues && pipe.issues.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {pipe.issues.map((issue, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <span className="text-yellow-500 mt-0.5">⚠</span>
                                <span className="text-muted-foreground">{issue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-primary/5 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {stats.lowVelocityCount > 0 && (
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                        <span>
                          Review {stats.lowVelocityCount} pipe(s) with low velocity - consider reducing diameter or increasing slope
                        </span>
                      </li>
                    )}
                    {stats.highVelocityCount > 0 && (
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                        <span>
                          {stats.highVelocityCount} pipe(s) have high velocity - check for noise/wear issues
                        </span>
                      </li>
                    )}
                    {stats.avgCFactor > 125 && (
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                        <span>
                          Average C-factor is high - reduce to 100-120 range to account for air friction in vacuum systems
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                      <span>
                        Ensure all pipes use "Force Main" conduit type with "Pressurised" solution model
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                      <span>
                        Verify sawtooth profile geometry is preserved (use Visualizer tab)
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {!stats && !analyzing && (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click "Run Diagnostics" to analyze your network configuration</p>
              <p className="text-sm mt-2">
                In production, this would connect to ICM via Ruby API to read actual network data
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
