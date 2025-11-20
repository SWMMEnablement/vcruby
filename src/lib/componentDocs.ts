/**
 * Component Documentation Registry
 * Auto-generated metadata for all vacuum sewer components
 */

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface MethodDoc {
  name: string;
  signature: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  returns: {
    type: string;
    description: string;
  };
}

export interface ComponentDoc {
  name: string;
  category: string;
  description: string;
  filePath: string;
  props?: PropDoc[];
  methods?: MethodDoc[];
  interfaces?: Array<{
    name: string;
    properties: PropDoc[];
  }>;
  usageExample?: string;
  dependencies: string[];
  exports: string[];
  linesOfCode: number;
}

export const componentDocs: ComponentDoc[] = [
  {
    name: "SystemOverview",
    category: "Documentation",
    description: "Comprehensive overview of vacuum sewer systems based on EPA guidelines. Includes introduction, EPA Section 1.3, Chapter 3 & 5 content with interactive tabs and detailed technical information.",
    filePath: "src/components/vacuum-sewer/SystemOverview.tsx",
    props: [],
    dependencies: ["Card", "Alert", "Tabs", "Icons"],
    exports: ["SystemOverview"],
    linesOfCode: 971,
    usageExample: `import SystemOverview from "@/components/vacuum-sewer/SystemOverview";

<SystemOverview />`,
  },
  {
    name: "DesignCalculator",
    category: "Tools",
    description: "Interactive calculator for vacuum sewer pipe and pump sizing based on EPA design parameters. Includes friction loss calculations using Hazen-Williams method.",
    filePath: "src/components/vacuum-sewer/DesignCalculator.tsx",
    props: [],
    methods: [
      {
        name: "calculatePipeSize",
        signature: "() => void",
        description: "Calculates recommended pipe diameter based on number of homes, flow rates, and peaking factors",
        parameters: [],
        returns: {
          type: "void",
          description: "Updates results state with calculated pipe size and friction loss"
        }
      },
      {
        name: "calculatePumpSize",
        signature: "() => void",
        description: "Calculates vacuum pump and discharge pump sizing using EPA 'A' factor method",
        parameters: [],
        returns: {
          type: "void",
          description: "Updates results state with pump specifications"
        }
      }
    ],
    dependencies: ["Card", "Input", "Button", "Tabs"],
    exports: ["DesignCalculator"],
    linesOfCode: 371,
    usageExample: `import DesignCalculator from "@/components/vacuum-sewer/DesignCalculator";

<DesignCalculator />`,
  },
  {
    name: "ICMIntegration",
    category: "Integration",
    description: "Main hub for InfoWorks ICM Ruby script integration. Contains Ruby scripts, tutorials, validators, and diagnostic tools for vacuum sewer modeling.",
    filePath: "src/components/vacuum-sewer/ICMIntegration.tsx",
    props: [
      {
        name: "activeSubTab",
        type: "string",
        required: false,
        description: "Currently active sub-tab identifier",
        defaultValue: "'usage'"
      },
      {
        name: "onSubTabChange",
        type: "(tab: string) => void",
        required: false,
        description: "Callback fired when sub-tab changes"
      }
    ],
    interfaces: [
      {
        name: "ICMIntegrationProps",
        properties: [
          {
            name: "activeSubTab",
            type: "string",
            required: false,
            description: "Currently active sub-tab"
          },
          {
            name: "onSubTabChange",
            type: "(tab: string) => void",
            required: false,
            description: "Sub-tab change handler"
          }
        ]
      }
    ],
    dependencies: ["Card", "Tabs", "Collapsible", "DropdownMenu", "Ruby Scripts", "Validators"],
    exports: ["ICMIntegration"],
    linesOfCode: 2969,
    usageExample: `import ICMIntegration from "@/components/vacuum-sewer/ICMIntegration";

const [subTab, setSubTab] = useState("usage");

<ICMIntegration 
  activeSubTab={subTab}
  onSubTabChange={setSubTab}
/>`,
  },
  {
    name: "RTCCodeGenerator",
    category: "Code Generation",
    description: "Generates ready-to-use InfoWorks ICM Ruby RTC code for pneumatic valve controllers. Supports basic, advanced, variable speed, and system monitoring configurations.",
    filePath: "src/components/vacuum-sewer/RTCCodeGenerator.tsx",
    props: [],
    interfaces: [
      {
        name: "RTCParameters",
        properties: [
          {
            name: "valveName",
            type: "string",
            required: true,
            description: "Name/ID of the vacuum valve"
          },
          {
            name: "sumpNode",
            type: "string",
            required: true,
            description: "Node ID of the sump/collection chamber"
          },
          {
            name: "pumpLink",
            type: "string",
            required: true,
            description: "Link ID of the vacuum pipe from valve to station"
          },
          {
            name: "onLevel",
            type: "number",
            required: true,
            description: "Water level to open valve (meters)"
          },
          {
            name: "offLevel",
            type: "number",
            required: true,
            description: "Water level to close valve (meters)"
          },
          {
            name: "airAdmissionTime",
            type: "number",
            required: true,
            description: "Duration valve stays open (seconds)"
          }
        ]
      }
    ],
    methods: [
      {
        name: "generateBasicController",
        signature: "() => string",
        description: "Generates basic ON/OFF pneumatic controller code with hysteresis",
        parameters: [],
        returns: {
          type: "string",
          description: "Ruby RTC code for basic controller"
        }
      },
      {
        name: "generateAdvancedController",
        signature: "() => string",
        description: "Generates controller with system saturation protection",
        parameters: [],
        returns: {
          type: "string",
          description: "Ruby RTC code for advanced controller"
        }
      },
      {
        name: "generateVSPController",
        signature: "() => string",
        description: "Generates variable speed pump controller based on head differential",
        parameters: [],
        returns: {
          type: "string",
          description: "Ruby RTC code for VSP controller"
        }
      }
    ],
    dependencies: ["Card", "Input", "Button", "Tabs", "Textarea"],
    exports: ["RTCCodeGenerator"],
    linesOfCode: 527,
    usageExample: `import { RTCCodeGenerator } from "@/components/vacuum-sewer/RTCCodeGenerator";

<RTCCodeGenerator />`,
  },
  {
    name: "RTCLogicSimulator",
    category: "Testing",
    description: "Testing simulator that validates RTC controller logic with visual timeline showing valve open/close cycles, sump levels, and system behavior over time.",
    filePath: "src/components/vacuum-sewer/RTCLogicSimulator.tsx",
    props: [],
    methods: [
      {
        name: "runSimulation",
        signature: "() => void",
        description: "Executes valve behavior simulation over configured time period",
        parameters: [],
        returns: {
          type: "void",
          description: "Updates simulation state with timeline data"
        }
      }
    ],
    dependencies: ["Card", "Input", "Button", "Alert", "Recharts"],
    exports: ["RTCLogicSimulator"],
    linesOfCode: 400,
    usageExample: `import { RTCLogicSimulator } from "@/components/vacuum-sewer/RTCLogicSimulator";

<RTCLogicSimulator />`,
  },
  {
    name: "ModelDiagnostics",
    category: "Analysis",
    description: "Analyzes vacuum sewer network configuration to identify potential modeling issues. Calculates velocities, checks C-factors, and provides health scoring.",
    filePath: "src/components/vacuum-sewer/ModelDiagnostics.tsx",
    props: [],
    interfaces: [
      {
        name: "PipeData",
        properties: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "Pipe identifier"
          },
          {
            name: "length",
            type: "number",
            required: true,
            description: "Pipe length in meters"
          },
          {
            name: "diameter",
            type: "number",
            required: true,
            description: "Pipe diameter in millimeters"
          },
          {
            name: "flow",
            type: "number",
            required: true,
            description: "Flow rate in L/s"
          },
          {
            name: "velocity",
            type: "number",
            required: false,
            description: "Calculated velocity in m/s"
          }
        ]
      },
      {
        name: "NetworkStats",
        properties: [
          {
            name: "totalPipes",
            type: "number",
            required: true,
            description: "Total number of pipes in network"
          },
          {
            name: "healthScore",
            type: "number",
            required: true,
            description: "Network health score (0-100)"
          },
          {
            name: "criticalIssues",
            type: "number",
            required: true,
            description: "Count of critical issues detected"
          }
        ]
      }
    ],
    dependencies: ["Card", "Button", "Alert", "Progress", "Badge"],
    exports: ["ModelDiagnostics"],
    linesOfCode: 499,
    usageExample: `import { ModelDiagnostics } from "@/components/vacuum-sewer/ModelDiagnostics";

<ModelDiagnostics />`,
  },
  {
    name: "NetworkValidator",
    category: "Validation",
    description: "Validates vacuum sewer network topology and configuration. Checks for orphaned nodes, reverse slopes, excessive lifts, and other design issues.",
    filePath: "src/components/vacuum-sewer/NetworkValidator.tsx",
    props: [],
    dependencies: ["Card", "Button", "Alert", "Badge"],
    exports: ["NetworkValidator"],
    linesOfCode: 350,
    usageExample: `import { NetworkValidator } from "@/components/vacuum-sewer/NetworkValidator";

<NetworkValidator />`,
  },
  {
    name: "SawtoothVisualizer",
    category: "Visualization",
    description: "Interactive visualizer for vacuum sewer sawtooth profiles. Allows parameter adjustment and displays geometric profile with elevation changes.",
    filePath: "src/components/vacuum-sewer/SawtoothVisualizer.tsx",
    props: [],
    methods: [
      {
        name: "generateSawtoothPath",
        signature: "() => Array<{x: number, y: number}>",
        description: "Generates geometric points for sawtooth profile based on current parameters",
        parameters: [],
        returns: {
          type: "Array<{x: number, y: number}>",
          description: "Array of coordinate points defining the profile"
        }
      }
    ],
    dependencies: ["Card", "Input", "Button", "Slider"],
    exports: ["SawtoothVisualizer"],
    linesOfCode: 294,
    usageExample: `import { SawtoothVisualizer } from "@/components/vacuum-sewer/SawtoothVisualizer";

<SawtoothVisualizer />`,
  },
  {
    name: "TechnicalDiagrams",
    category: "Documentation",
    description: "SVG-based technical diagrams showing sawtooth profiles, valve pit configurations, and air-liquid slug flow patterns with detailed annotations.",
    filePath: "src/components/vacuum-sewer/TechnicalDiagrams.tsx",
    props: [],
    dependencies: ["Card", "Tabs"],
    exports: ["TechnicalDiagrams"],
    linesOfCode: 450,
    usageExample: `import { TechnicalDiagrams } from "@/components/vacuum-sewer/TechnicalDiagrams";

<TechnicalDiagrams />`,
  },
  {
    name: "CostEstimator",
    category: "Tools",
    description: "Estimates construction and lifecycle costs for vacuum sewer systems. Calculates pipe, valve pit, station costs and compares to alternatives.",
    filePath: "src/components/vacuum-sewer/CostEstimator.tsx",
    props: [],
    dependencies: ["Card", "Input", "Button", "Alert"],
    exports: ["CostEstimator"],
    linesOfCode: 400,
    usageExample: `import CostEstimator from "@/components/vacuum-sewer/CostEstimator";

<CostEstimator />`,
  },
  {
    name: "SystemComparison",
    category: "Analysis",
    description: "Compares vacuum, gravity, and pressure sewer systems across cost, features, and use cases. Includes terrain and water table adjustments.",
    filePath: "src/components/vacuum-sewer/SystemComparison.tsx",
    props: [],
    methods: [
      {
        name: "calculateComparison",
        signature: "() => void",
        description: "Calculates comparative costs and features for different sewer system types",
        parameters: [],
        returns: {
          type: "void",
          description: "Updates comparison state with calculated results"
        }
      }
    ],
    dependencies: ["Card", "Input", "Button", "Tabs", "Badge"],
    exports: ["SystemComparison"],
    linesOfCode: 409,
    usageExample: `import SystemComparison from "@/components/vacuum-sewer/SystemComparison";

<SystemComparison />`,
  },
  {
    name: "ComponentsGuide",
    category: "Documentation",
    description: "Comprehensive guide to vacuum sewer system components including valve pits, mains, stations, and service lines with specifications.",
    filePath: "src/components/vacuum-sewer/ComponentsGuide.tsx",
    props: [],
    dependencies: ["Card", "Tabs", "Alert"],
    exports: ["ComponentsGuide"],
    linesOfCode: 350,
    usageExample: `import ComponentsGuide from "@/components/vacuum-sewer/ComponentsGuide";

<ComponentsGuide />`,
  }
];

// Helper functions for documentation navigation
export const getComponentsByCategory = () => {
  const categories: Record<string, ComponentDoc[]> = {};
  componentDocs.forEach(doc => {
    if (!categories[doc.category]) {
      categories[doc.category] = [];
    }
    categories[doc.category].push(doc);
  });
  return categories;
};

export const searchComponents = (query: string): ComponentDoc[] => {
  const lowercaseQuery = query.toLowerCase();
  return componentDocs.filter(doc => 
    doc.name.toLowerCase().includes(lowercaseQuery) ||
    doc.description.toLowerCase().includes(lowercaseQuery) ||
    doc.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getTotalLinesOfCode = (): number => {
  return componentDocs.reduce((total, doc) => total + doc.linesOfCode, 0);
};

export const getComponentStats = () => {
  return {
    totalComponents: componentDocs.length,
    totalLinesOfCode: getTotalLinesOfCode(),
    categories: Object.keys(getComponentsByCategory()).length,
    avgLinesPerComponent: Math.round(getTotalLinesOfCode() / componentDocs.length)
  };
};