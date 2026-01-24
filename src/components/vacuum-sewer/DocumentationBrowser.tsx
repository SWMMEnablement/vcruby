import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Book, 
  Search, 
  Code, 
  FileCode, 
  Layers, 
  BarChart3,
  Package,
  ChevronRight,
  Info,
  Network,
  FileDown
} from "lucide-react";
import { 
  componentDocs, 
  getComponentsByCategory, 
  searchComponents,
  getComponentStats,
  type ComponentDoc 
} from "@/lib/componentDocs";
import ComponentDependencyGraph from "./ComponentDependencyGraph";
import MarkdownExporter from "./MarkdownExporter";

const DocumentationBrowser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<ComponentDoc | null>(null);
  
  const stats = getComponentStats();
  const componentsByCategory = getComponentsByCategory();
  const filteredComponents = searchQuery 
    ? searchComponents(searchQuery) 
    : componentDocs;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Documentation": "bg-blue-500",
      "Tools": "bg-green-500",
      "Integration": "bg-purple-500",
      "Code Generation": "bg-orange-500",
      "Testing": "bg-yellow-500",
      "Analysis": "bg-pink-500",
      "Validation": "bg-teal-500",
      "Visualization": "bg-indigo-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const [activeTab, setActiveTab] = useState("browser");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Component API Documentation</CardTitle>
                <CardDescription>
                  Auto-generated documentation for all vacuum sewer components
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browser" className="gap-2">
                <Book className="h-4 w-4" />
                API Browser
              </TabsTrigger>
              <TabsTrigger value="graph" className="gap-2">
                <Network className="h-4 w-4" />
                Dependency Graph
              </TabsTrigger>
              <TabsTrigger value="export" className="gap-2">
                <FileDown className="h-4 w-4" />
                Export Markdown
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {activeTab === "graph" && <ComponentDependencyGraph />}
      {activeTab === "export" && <MarkdownExporter />}
      
      {activeTab === "browser" && (
      <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This documentation is automatically extracted from component source files including props, 
          interfaces, methods, and usage examples.
        </AlertDescription>
      </Alert>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-engineering-blue">{stats.totalComponents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Code className="h-4 w-4" />
              Total LOC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-engineering-blue">{stats.totalLinesOfCode.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-engineering-blue">{stats.categories}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Avg LOC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-engineering-blue">{stats.avgLinesPerComponent}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Component List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Components</CardTitle>
            <CardDescription>
              {filteredComponents.length} of {componentDocs.length} components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredComponents.map((doc) => (
                <button
                  key={doc.name}
                  onClick={() => setSelectedComponent(doc)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedComponent?.name === doc.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{doc.name}</div>
                      <Badge 
                        variant="secondary" 
                        className={`${getCategoryColor(doc.category)} text-white text-xs`}
                      >
                        {doc.category}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {doc.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Component Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              {selectedComponent ? selectedComponent.name : "Select a Component"}
            </CardTitle>
            {selectedComponent && (
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${getCategoryColor(selectedComponent.category)} text-white`}>
                  {selectedComponent.category}
                </Badge>
                <Badge variant="outline">{selectedComponent.linesOfCode} LOC</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedComponent ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="deps">Dependencies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedComponent.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">File Path</h3>
                    <code className="text-sm bg-secondary px-2 py-1 rounded">
                      {selectedComponent.filePath}
                    </code>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm">Lines of Code</h3>
                      <p className="text-2xl font-bold text-primary">
                        {selectedComponent.linesOfCode.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-sm">Exports</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedComponent.exports.map(exp => (
                          <Badge key={exp} variant="secondary">{exp}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                  {selectedComponent.props && selectedComponent.props.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Props</h3>
                      <div className="space-y-3">
                        {selectedComponent.props.map((prop) => (
                          <div key={prop.name} className="p-3 bg-secondary rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <code className="font-semibold text-sm">{prop.name}</code>
                                {prop.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <code className="text-xs text-muted-foreground">{prop.type}</code>
                            </div>
                            <p className="text-sm text-muted-foreground">{prop.description}</p>
                            {prop.defaultValue && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Default: <code>{prop.defaultValue}</code>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.interfaces && selectedComponent.interfaces.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Interfaces</h3>
                      {selectedComponent.interfaces.map((iface) => (
                        <div key={iface.name} className="mb-4">
                          <h4 className="font-mono text-sm mb-2 text-primary">{iface.name}</h4>
                          <div className="space-y-2">
                            {iface.properties.map((prop) => (
                              <div key={prop.name} className="p-2 bg-secondary rounded text-sm">
                                <div className="flex items-center justify-between">
                                  <code className="font-semibold">{prop.name}</code>
                                  <code className="text-muted-foreground text-xs">{prop.type}</code>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{prop.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedComponent.methods && selectedComponent.methods.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Methods</h3>
                      <div className="space-y-4">
                        {selectedComponent.methods.map((method) => (
                          <div key={method.name} className="p-3 bg-secondary rounded-lg">
                            <code className="font-semibold text-sm block mb-2">
                              {method.name}{method.signature.replace(method.name, "")}
                            </code>
                            <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                            {method.parameters.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold mb-1">Parameters:</p>
                                {method.parameters.map((param) => (
                                  <div key={param.name} className="text-xs ml-3">
                                    <code>{param.name}</code>: {param.type} - {param.description}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mt-2 text-xs">
                              <span className="font-semibold">Returns:</span> {method.returns.type} - {method.returns.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!selectedComponent.props || selectedComponent.props.length === 0) && 
                   (!selectedComponent.methods || selectedComponent.methods.length === 0) &&
                   (!selectedComponent.interfaces || selectedComponent.interfaces.length === 0) && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        This component has no exported props, methods, or interfaces. It's a standalone component.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="usage" className="space-y-4">
                  {selectedComponent.usageExample ? (
                    <div>
                      <h3 className="font-semibold mb-3">Usage Example</h3>
                      <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">{selectedComponent.usageExample}</code>
                      </pre>
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        No usage example available for this component.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="deps" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Dependencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline">{dep}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a component to view its documentation</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Components by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(componentsByCategory).map(([category, docs]) => (
              <div key={category} className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                  <h4 className="font-semibold text-sm">{category}</h4>
                </div>
                <p className="text-2xl font-bold text-primary mb-2">{docs.length}</p>
                <div className="space-y-1">
                  {docs.map((doc) => (
                    <button
                      key={doc.name}
                      onClick={() => setSelectedComponent(doc)}
                      className="text-xs text-muted-foreground hover:text-primary block"
                    >
                      • {doc.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
};

export default DocumentationBrowser;