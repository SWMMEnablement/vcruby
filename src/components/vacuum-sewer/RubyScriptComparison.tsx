import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const RubyScriptComparison = () => {
  const scripts = [
    {
      name: "Export Model JSON",
      purpose: "Export complete ICM model data (inputs & results) to JSON format for external analysis",
      inputs: [
        "Open ICM network",
        "Optional: Loaded simulation results"
      ],
      outputs: [
        "JSON file with metadata",
        "All table inputs",
        "Time-series results (if loaded)",
        "Timestep definitions"
      ],
      useCases: [
        "Data backup and archival",
        "External analysis in Python/R",
        "Machine learning training data",
        "Integration with web tools"
      ],
      badge: "Data Export",
      color: "bg-blue-500"
    },
    {
      name: "Vacuum Calculator",
      purpose: "Calculate Total Dynamic Head (TDH) at each node using EPA Sawtooth method with Hazen-Williams friction",
      inputs: [
        "Link User Number 1: Flow Rate (L/s)",
        "Link Roughness: Hazen-Williams C",
        "Link geometry (length, diameter)",
        "Node elevations (invertс)",
        "Vacuum Station node (selected or Outfall)"
      ],
      outputs: [
        "Node User Number 9: Cumulative Vacuum Head (m)",
        "Link User Number 2: Friction Loss (m)",
        "Link User Number 3: Static Lift (m)",
        "Zone analysis report (Green/Yellow/Red)"
      ],
      useCases: [
        "Validate vacuum system design",
        "Identify vacuum-starved nodes",
        "Check if nodes exceed 3.5m head limit",
        "Optimize pump station location"
      ],
      badge: "Analysis",
      color: "bg-green-500"
    },
    {
      name: "Sawtooth Generator",
      purpose: "Split selected conduits into 4-segment vacuum sewer profile (DOWN-UP-DOWN-UP pattern)",
      inputs: [
        "Selected conduit(s)",
        "Existing link properties",
        "US/DS node elevations"
      ],
      outputs: [
        "3 new break nodes (Low-High-Low pattern)",
        "4 new conduit segments",
        "Node elevations following sawtooth logic",
        "Detailed profile report"
      ],
      useCases: [
        "Convert gravity sewers to vacuum design",
        "Create proper vacuum profiles",
        "Ensure high points above end elevation",
        "Prepare model for simulation"
      ],
      badge: "Design Tool",
      color: "bg-purple-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ruby Scripts Comparison</CardTitle>
        <CardDescription>
          Understand the purpose and differences between the three ICM Ruby scripts for vacuum sewer systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Script</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Key Inputs</TableHead>
                <TableHead>Key Outputs</TableHead>
                <TableHead>Primary Use Cases</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scripts.map((script, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="space-y-2">
                      <div>{script.name}</div>
                      <Badge variant="secondary" className="text-xs">
                        {script.badge}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm">{script.purpose}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {script.inputs.map((input, idx) => (
                        <li key={idx} className="text-muted-foreground">{input}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {script.outputs.map((output, idx) => (
                        <li key={idx} className="text-muted-foreground">{output}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {script.useCases.map((useCase, idx) => (
                        <li key={idx} className="text-muted-foreground">{useCase}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge className="bg-blue-500">Data Export</Badge>
                Export Model JSON
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">When to use:</p>
              <p>After completing simulations, when you need to analyze data outside ICM or integrate with external tools.</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge className="bg-green-500">Analysis</Badge>
                Vacuum Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">When to use:</p>
              <p>After setting up your vacuum sewer network, to validate that all nodes are within acceptable vacuum head limits (0-3.5m).</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge className="bg-purple-500">Design Tool</Badge>
                Sawtooth Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">When to use:</p>
              <p>During initial design phase, when converting gravity sewer layouts to proper vacuum sewer profiles with sawtooth patterns.</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Typical Workflow Order</h4>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-purple-500">1. Sawtooth Generator</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-green-500">2. Vacuum Calculator</Badge>
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Simulate & Adjust</span>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-blue-500">3. Export Model JSON</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            First create proper vacuum profiles, then validate the design meets head requirements, simulate the system, and finally export results for documentation or further analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
