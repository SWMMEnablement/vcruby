import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileDown, 
  FileText, 
  Book, 
  GitBranch, 
  Check,
  Copy,
  Download
} from "lucide-react";
import { 
  generateFullDocumentation, 
  generateQuickReference, 
  generateDependencyDocs,
  generateComponentMarkdown,
  downloadMarkdown 
} from "@/lib/markdownExporter";
import { componentDocs } from "@/lib/componentDocs";
import { toast } from "sonner";

const MarkdownExporter = () => {
  const [previewType, setPreviewType] = useState<"full" | "quick" | "deps">("full");
  const [copied, setCopied] = useState(false);

  const getPreviewContent = () => {
    switch (previewType) {
      case "full":
        return generateFullDocumentation();
      case "quick":
        return generateQuickReference();
      case "deps":
        return generateDependencyDocs();
      default:
        return "";
    }
  };

  const handleDownload = (type: "full" | "quick" | "deps" | "component", componentName?: string) => {
    let content: string;
    let filename: string;

    switch (type) {
      case "full":
        content = generateFullDocumentation();
        filename = "API_DOCUMENTATION.md";
        break;
      case "quick":
        content = generateQuickReference();
        filename = "QUICK_REFERENCE.md";
        break;
      case "deps":
        content = generateDependencyDocs();
        filename = "DEPENDENCIES.md";
        break;
      case "component":
        const doc = componentDocs.find(d => d.name === componentName);
        if (!doc) return;
        content = generateComponentMarkdown(doc);
        filename = `${componentName}.md`;
        break;
      default:
        return;
    }

    downloadMarkdown(content, filename);
    toast.success(`Downloaded ${filename}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPreviewContent());
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Download all documentation files
    handleDownload("full");
    setTimeout(() => handleDownload("quick"), 100);
    setTimeout(() => handleDownload("deps"), 200);
    toast.success("Downloaded all documentation files");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileDown className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Markdown Documentation Export</CardTitle>
                <CardDescription>
                  Generate and download .md files for GitHub documentation
                </CardDescription>
              </div>
            </div>
            <Button onClick={handleDownloadAll} className="gap-2">
              <Download className="h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Export documentation in Markdown format compatible with GitHub, GitLab, and other 
              documentation platforms. Files can be added directly to your repository.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleDownload("full")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Full API Documentation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Complete documentation with all components, props, methods, and usage examples.
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">API_DOCUMENTATION.md</Badge>
              <Button size="sm" variant="outline" className="gap-1">
                <FileDown className="h-3 w-3" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleDownload("quick")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base">Quick Reference</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Concise table of all components with brief descriptions and LOC counts.
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">QUICK_REFERENCE.md</Badge>
              <Button size="sm" variant="outline" className="gap-1">
                <FileDown className="h-3 w-3" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleDownload("deps")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">Dependency Graph</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Component dependency tree and relationship documentation.
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">DEPENDENCIES.md</Badge>
              <Button size="sm" variant="outline" className="gap-1">
                <FileDown className="h-3 w-3" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Component Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Export Individual Components</CardTitle>
          <CardDescription>Download documentation for specific components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {componentDocs.map(doc => (
              <Button
                key={doc.name}
                variant="outline"
                size="sm"
                onClick={() => handleDownload("component", doc.name)}
                className="gap-1"
              >
                <FileDown className="h-3 w-3" />
                {doc.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Preview</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as typeof previewType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="full">Full Docs</TabsTrigger>
              <TabsTrigger value="quick">Quick Ref</TabsTrigger>
              <TabsTrigger value="deps">Dependencies</TabsTrigger>
            </TabsList>

            <TabsContent value={previewType} className="mt-4">
              <ScrollArea className="h-[400px] border rounded-lg p-4 bg-secondary/20">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {getPreviewContent()}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* GitHub Integration Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">GitHub Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <p>Download the documentation files using the buttons above</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <p>Create a <code className="bg-secondary px-1 rounded">/docs</code> folder in your repository</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <p>Add the markdown files to your docs folder and commit</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <p>Enable GitHub Pages in repository settings to host your documentation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkdownExporter;
