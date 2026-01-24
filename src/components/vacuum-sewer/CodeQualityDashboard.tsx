import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  AlertTriangle, 
  Award, 
  Bug, 
  CheckCircle, 
  Code, 
  FileWarning,
  Gauge,
  Shield,
  TrendingDown,
  TrendingUp,
  Wrench,
  XCircle,
  Info,
  BarChart3
} from "lucide-react";
import { componentDocs } from "@/lib/componentDocs";
import { 
  getComponentQualityMetrics, 
  getProjectQualitySummary,
  type QualityMetrics,
  type CodeSmell
} from "@/lib/codeQualityMetrics";

const CodeQualityDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const projectSummary = useMemo(() => getProjectQualitySummary(), []);
  
  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-yellow-500',
      'D': 'bg-orange-500',
      'F': 'bg-red-500'
    };
    return colors[grade] || 'bg-gray-500';
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return 'text-green-500';
    if (score <= 6) return 'text-yellow-500';
    if (score <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  const getMaintainabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getSmellIcon = (severity: CodeSmell['severity']) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const selectedMetrics = selectedComponent 
    ? projectSummary.componentMetrics.find(m => m.name === selectedComponent)?.metrics
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Code Quality Dashboard</CardTitle>
              <CardDescription>
                Complexity scores, maintainability index, and estimated test coverage analysis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Project Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Avg Maintainability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getMaintainabilityColor(projectSummary.avgMaintainability)}`}>
                {projectSummary.avgMaintainability}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={projectSummary.avgMaintainability} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Code className="h-4 w-4" />
              Avg Complexity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getComplexityColor(projectSummary.avgComplexity)}`}>
                {projectSummary.avgComplexity}
              </span>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
            <Progress value={(10 - projectSummary.avgComplexity) * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Est. Test Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${projectSummary.avgTestCoverage >= 70 ? 'text-green-500' : projectSummary.avgTestCoverage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {projectSummary.avgTestCoverage}%
              </span>
            </div>
            <Progress value={projectSummary.avgTestCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Code Smells
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{projectSummary.totalSmells}</span>
              {projectSummary.criticalSmells > 0 && (
                <Badge variant="destructive">{projectSummary.criticalSmells} critical</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Quality Grade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {['A', 'B', 'C', 'D', 'F'].map(grade => (
              <div key={grade} className="flex items-center gap-2">
                <Badge className={`${getGradeColor(grade)} text-white w-8 h-8 flex items-center justify-center text-lg`}>
                  {grade}
                </Badge>
                <span className="text-2xl font-bold">
                  {projectSummary.gradeDistribution[grade] || 0}
                </span>
                <span className="text-sm text-muted-foreground">components</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">Component Analysis</TabsTrigger>
          <TabsTrigger value="smells">Code Smells</TabsTrigger>
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Component List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {projectSummary.componentMetrics.map(({ name, metrics }) => (
                    <button
                      key={name}
                      onClick={() => setSelectedComponent(name)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedComponent === name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{name}</span>
                        <Badge className={`${getGradeColor(metrics.qualityGrade)} text-white`}>
                          {metrics.qualityGrade}
                        </Badge>
                      </div>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span>MI: {metrics.maintainabilityIndex}</span>
                        <span>CC: {metrics.complexityScore}</span>
                        <span>TC: {metrics.testCoverage}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Component Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedComponent || "Select a Component"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMetrics ? (
                  <div className="space-y-6">
                    {/* Main Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-secondary rounded-lg text-center">
                        <div className={`text-2xl font-bold ${getGradeColor(selectedMetrics.qualityGrade)} bg-clip-text text-transparent bg-gradient-to-r from-current to-current`}>
                          <Badge className={`${getGradeColor(selectedMetrics.qualityGrade)} text-white text-xl px-3 py-1`}>
                            {selectedMetrics.qualityGrade}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Quality Grade</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-lg text-center">
                        <p className={`text-2xl font-bold ${getMaintainabilityColor(selectedMetrics.maintainabilityIndex)}`}>
                          {selectedMetrics.maintainabilityIndex}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Maintainability</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-lg text-center">
                        <p className={`text-2xl font-bold ${getComplexityColor(selectedMetrics.complexityScore)}`}>
                          {selectedMetrics.complexityScore}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Complexity</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedMetrics.testCoverage}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Test Coverage</p>
                      </div>
                    </div>

                    {/* Halstead Metrics */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Halstead Metrics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="p-3 border rounded-lg">
                          <p className="text-lg font-bold">{selectedMetrics.halsteadMetrics.vocabulary}</p>
                          <p className="text-xs text-muted-foreground">Vocabulary</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-lg font-bold">{selectedMetrics.halsteadMetrics.length}</p>
                          <p className="text-xs text-muted-foreground">Length</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-lg font-bold">{selectedMetrics.halsteadMetrics.difficulty}</p>
                          <p className="text-xs text-muted-foreground">Difficulty</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-lg font-bold">{selectedMetrics.halsteadMetrics.effort}</p>
                          <p className="text-xs text-muted-foreground">Effort</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-lg font-bold">{selectedMetrics.halsteadMetrics.estimatedBugs}</p>
                          <p className="text-xs text-muted-foreground">Est. Bugs</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Documentation Coverage</h4>
                        <Progress value={selectedMetrics.documentationCoverage} className="mb-2" />
                        <p className="text-sm text-muted-foreground">{selectedMetrics.documentationCoverage}% documented</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Duplicate Code Risk</h4>
                        <Badge variant={
                          selectedMetrics.duplicateCodeRisk === 'low' ? 'secondary' :
                          selectedMetrics.duplicateCodeRisk === 'medium' ? 'outline' : 'destructive'
                        }>
                          {selectedMetrics.duplicateCodeRisk.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Code Smells */}
                    {selectedMetrics.codeSmells.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileWarning className="h-4 w-4" />
                          Code Smells ({selectedMetrics.codeSmells.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedMetrics.codeSmells.map((smell, idx) => (
                            <Alert key={idx} variant={smell.severity === 'error' ? 'destructive' : 'default'}>
                              <div className="flex items-start gap-2">
                                {getSmellIcon(smell.severity)}
                                <div>
                                  <p className="font-semibold text-sm">{smell.type}</p>
                                  <AlertDescription className="text-xs">
                                    {smell.description}
                                  </AlertDescription>
                                </div>
                              </div>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-muted-foreground">
                    <div className="text-center">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a component to view quality metrics</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="smells" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bug className="h-5 w-5" />
                All Code Smells
              </CardTitle>
              <CardDescription>
                Issues detected across all components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectSummary.componentMetrics
                  .filter(m => m.metrics.codeSmells.length > 0)
                  .flatMap(m => m.metrics.codeSmells.map(smell => ({
                    ...smell,
                    component: m.name
                  })))
                  .sort((a, b) => {
                    const order = { error: 0, warning: 1, info: 2 };
                    return order[a.severity] - order[b.severity];
                  })
                  .map((smell, idx) => (
                    <Alert key={idx} variant={smell.severity === 'error' ? 'destructive' : 'default'}>
                      <div className="flex items-start gap-2">
                        {getSmellIcon(smell.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{smell.type}</p>
                            <Badge variant="outline" className="text-xs">{smell.component}</Badge>
                          </div>
                          <AlertDescription className="text-xs">
                            {smell.description}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Highest Quality Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projectSummary.componentMetrics
                    .sort((a, b) => b.metrics.maintainabilityIndex - a.metrics.maintainabilityIndex)
                    .slice(0, 5)
                    .map((m, idx) => (
                      <div key={m.name} className="flex items-center justify-between p-2 bg-secondary rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-500">{idx + 1}</span>
                          <span className="text-sm font-medium">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getGradeColor(m.metrics.qualityGrade)} text-white`}>
                            {m.metrics.qualityGrade}
                          </Badge>
                          <span className="text-sm text-muted-foreground">MI: {m.metrics.maintainabilityIndex}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Needs Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projectSummary.componentMetrics
                    .sort((a, b) => a.metrics.maintainabilityIndex - b.metrics.maintainabilityIndex)
                    .slice(0, 5)
                    .map((m, idx) => (
                      <div key={m.name} className="flex items-center justify-between p-2 bg-secondary rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-500">{idx + 1}</span>
                          <span className="text-sm font-medium">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getGradeColor(m.metrics.qualityGrade)} text-white`}>
                            {m.metrics.qualityGrade}
                          </Badge>
                          <span className="text-sm text-muted-foreground">MI: {m.metrics.maintainabilityIndex}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectSummary.criticalSmells > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{projectSummary.criticalSmells} critical issues</strong> require immediate attention. 
                      Review the Code Smells tab for details.
                    </AlertDescription>
                  </Alert>
                )}
                
                {projectSummary.avgMaintainability < 60 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Average maintainability index is below 60. Consider refactoring larger components.
                    </AlertDescription>
                  </Alert>
                )}
                
                {projectSummary.avgTestCoverage < 60 && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Estimated test coverage is below 60%. Prioritize adding tests for critical components.
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{projectSummary.gradeDistribution['A'] || 0} components</strong> have 'A' grade quality. 
                    Use these as reference for best practices.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeQualityDashboard;
