import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Code, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useToast } from "@/hooks/use-toast";

interface RubyScriptViewerProps {
  sawtoothScript: string;
  calculatorScript: string;
  exporterScript: string;
}

export const RubyScriptViewer = ({ 
  sawtoothScript, 
  calculatorScript, 
  exporterScript 
}: RubyScriptViewerProps) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, scriptName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedScript(scriptName);
      toast({
        title: "Copied to clipboard",
        description: `${scriptName} script copied successfully.`,
      });
      setTimeout(() => setCopiedScript(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadScript = (script: string, filename: string) => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <CardTitle>Ruby Script Previews</CardTitle>
        </div>
        <CardDescription>
          View and download InfoWorks ICM Ruby scripts with syntax highlighting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sawtooth" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sawtooth">Sawtooth Generator</TabsTrigger>
            <TabsTrigger value="calculator">Vacuum Calculator</TabsTrigger>
            <TabsTrigger value="exporter">JSON Exporter</TabsTrigger>
          </TabsList>

          <TabsContent value="sawtooth" className="space-y-4">
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(sawtoothScript, "Sawtooth Generator")}
              >
                {copiedScript === "Sawtooth Generator" ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadScript(sawtoothScript, 'sawtooth_generator.rb')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <SyntaxHighlighter
                language="ruby"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  maxHeight: '600px',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {sawtoothScript}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(calculatorScript, "Vacuum Calculator")}
              >
                {copiedScript === "Vacuum Calculator" ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadScript(calculatorScript, 'calculate_vacuum_epa.rb')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <SyntaxHighlighter
                language="ruby"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  maxHeight: '600px',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {calculatorScript}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="exporter" className="space-y-4">
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(exporterScript, "JSON Exporter")}
              >
                {copiedScript === "JSON Exporter" ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadScript(exporterScript, 'export_model_json.rb')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <SyntaxHighlighter
                language="ruby"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  maxHeight: '600px',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {exporterScript}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
