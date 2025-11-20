import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RTCParameters {
  valveName: string;
  sumpNode: string;
  pumpLink: string;
  onLevel: number;
  offLevel: number;
  airTime: number;
  maxActiveValves: number;
  efficiencyReduction: number;
}

export const RTCCodeGenerator: React.FC = () => {
  const { toast } = useToast();
  const [params, setParams] = useState<RTCParameters>({
    valveName: 'VALVE_001',
    sumpNode: 'SUMP_001',
    pumpLink: 'PUMP_001',
    onLevel: 0.3,
    offLevel: 0.1,
    airTime: 6,
    maxActiveValves: 50,
    efficiencyReduction: 50
  });

  const generateBasicController = () => {
    return `-- Basic Pneumatic Controller with Air Admission Timer
-- Valve: ${params.valveName}
-- Sump Node: ${params.sumpNode}
-- Pump Link: ${params.pumpLink}

-- Define Timer Variable
VARIABLE T_Air_${params.valveName} = 0

-- Regulator for ${params.pumpLink}
REGULATOR ${params.pumpLink}
  
  -- Range 1: High Level Trigger (Valve Opens)
  RANGE 1
    IF NODE ${params.sumpNode} LEVEL > ${params.onLevel} m
    THEN STATUS = ON
  END RANGE
  
  -- Range 2: Low Level Reset (Sewage Cleared)
  RANGE 2
    IF NODE ${params.sumpNode} LEVEL < ${params.offLevel} m
    THEN 
      -- Start air admission timer
      T_Air_${params.valveName} = SIMULATION TIME
    END IF
  END RANGE
  
  -- Air Admission Logic
  IF (SIMULATION TIME - T_Air_${params.valveName}) < ${params.airTime} s
  THEN STATUS = ON
  ELSE 
    IF NODE ${params.sumpNode} LEVEL < ${params.offLevel} m
    THEN STATUS = OFF
    END IF
  END IF

END REGULATOR`;
  };

  const generateAdvancedController = () => {
    return `-- Advanced Controller with System Saturation Protection
-- Valve: ${params.valveName}
-- Sump Node: ${params.sumpNode}
-- Pump Link: ${params.pumpLink}

-- Global Variables
GLOBAL VARIABLE Active_Valves = 0
VARIABLE T_Air_${params.valveName} = 0
VARIABLE Valve_Status_${params.valveName} = 0

-- Main Regulator
REGULATOR ${params.pumpLink}
  
  -- High Level Trigger
  IF NODE ${params.sumpNode} LEVEL > ${params.onLevel} m
  THEN 
    Valve_Status_${params.valveName} = 1
    STATUS = ON
  END IF
  
  -- Low Level with Timer
  IF NODE ${params.sumpNode} LEVEL < ${params.offLevel} m
  THEN 
    IF Valve_Status_${params.valveName} = 1
    THEN
      T_Air_${params.valveName} = SIMULATION TIME
      Valve_Status_${params.valveName} = 2
    END IF
  END IF
  
  -- Air Admission Phase
  IF Valve_Status_${params.valveName} = 2
  THEN
    IF (SIMULATION TIME - T_Air_${params.valveName}) < ${params.airTime} s
    THEN STATUS = ON
    ELSE 
      STATUS = OFF
      Valve_Status_${params.valveName} = 0
    END IF
  END IF
  
  -- System Saturation Protection
  IF Active_Valves > ${params.maxActiveValves}
  THEN 
    -- Reduce pump efficiency during high demand
    PUMP EFFICIENCY = ${100 - params.efficiencyReduction} %
  ELSE
    PUMP EFFICIENCY = 100 %
  END IF

END REGULATOR

-- Update Global Counter
IF Valve_Status_${params.valveName} > 0
THEN Active_Valves = Active_Valves + 1
END IF`;
  };

  const generateVSPController = () => {
    return `-- Variable Speed Pump Controller (Head-Dependent Flow)
-- Valve: ${params.valveName}
-- Sump Node: ${params.sumpNode}
-- Pump Link: ${params.pumpLink}

VARIABLE T_Air_${params.valveName} = 0
VARIABLE Valve_Active_${params.valveName} = 0
VARIABLE Head_Differential = 0

REGULATOR ${params.pumpLink}
  
  -- Calculate Pressure Differential
  -- Atmospheric pressure at sump vs vacuum pressure in main
  Head_Differential = 10.33 m - LINK ${params.pumpLink} US HEAD
  
  -- High Level Trigger
  IF NODE ${params.sumpNode} LEVEL > ${params.onLevel} m
  THEN 
    Valve_Active_${params.valveName} = 1
  END IF
  
  -- Low Level Detection
  IF NODE ${params.sumpNode} LEVEL < ${params.offLevel} m AND Valve_Active_${params.valveName} = 1
  THEN 
    T_Air_${params.valveName} = SIMULATION TIME
    Valve_Active_${params.valveName} = 2
  END IF
  
  -- Control Logic
  IF Valve_Active_${params.valveName} > 0
  THEN 
    STATUS = ON
    
    -- Variable speed based on head differential
    IF Head_Differential > 8 m
    THEN PUMP SPEED = 100 %
    ELSE IF Head_Differential > 6 m
    THEN PUMP SPEED = 80 %
    ELSE IF Head_Differential > 4 m
    THEN PUMP SPEED = 60 %
    ELSE 
    THEN PUMP SPEED = 40 %
    END IF
    
    -- Air admission timer override
    IF Valve_Active_${params.valveName} = 2
    THEN
      IF (SIMULATION TIME - T_Air_${params.valveName}) >= ${params.airTime} s
      THEN 
        STATUS = OFF
        Valve_Active_${params.valveName} = 0
      END IF
    END IF
  ELSE
    STATUS = OFF
  END IF

END REGULATOR`;
  };

  const generateWaterloggingMonitor = () => {
    return `-- System-Wide Waterlogging Monitor
-- Monitors all valves and detects system overload

GLOBAL VARIABLE Active_Valves = 0
GLOBAL VARIABLE System_Pressure = 0
GLOBAL VARIABLE Waterlog_Alert = 0

-- Reset counter each timestep
Active_Valves = 0

-- Count active valves (add this to each valve's RTC)
-- IF LINK [PUMP_NAME] STATUS = ON
-- THEN Active_Valves = Active_Valves + 1
-- END IF

-- Monitor system condition
IF Active_Valves > ${params.maxActiveValves}
THEN 
  Waterlog_Alert = 1
  -- Log event or trigger alarm
END IF

-- Calculate average system pressure
-- (This would need to be calculated across all main nodes)
System_Pressure = NODE VACUUM_MAIN_01 HEAD

-- Alert if vacuum pressure approaching atmospheric
IF System_Pressure > -2 m
THEN Waterlog_Alert = 2
END IF`;
  };

  const copyToClipboard = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: `${name} code copied successfully`,
    });
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: `${filename} downloaded successfully`,
    });
  };

  const updateParam = (key: keyof RTCParameters, value: string | number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RTC Code Generator</CardTitle>
          <CardDescription>
            Configure parameters and generate ready-to-use InfoWorks ICM RTC Ruby code for vacuum sewer pneumatic controllers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="valveName">Valve Name/ID</Label>
                <Input
                  id="valveName"
                  value={params.valveName}
                  onChange={(e) => updateParam('valveName', e.target.value)}
                  placeholder="VALVE_001"
                />
              </div>
              
              <div>
                <Label htmlFor="sumpNode">Sump Node ID</Label>
                <Input
                  id="sumpNode"
                  value={params.sumpNode}
                  onChange={(e) => updateParam('sumpNode', e.target.value)}
                  placeholder="SUMP_001"
                />
              </div>
              
              <div>
                <Label htmlFor="pumpLink">Pump Link ID</Label>
                <Input
                  id="pumpLink"
                  value={params.pumpLink}
                  onChange={(e) => updateParam('pumpLink', e.target.value)}
                  placeholder="PUMP_001"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="onLevel">Valve ON Level (m)</Label>
                <Input
                  id="onLevel"
                  type="number"
                  step="0.01"
                  value={params.onLevel}
                  onChange={(e) => updateParam('onLevel', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="offLevel">Valve OFF Level (m)</Label>
                <Input
                  id="offLevel"
                  type="number"
                  step="0.01"
                  value={params.offLevel}
                  onChange={(e) => updateParam('offLevel', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="airTime">Air Admission Time (seconds)</Label>
                <Input
                  id="airTime"
                  type="number"
                  step="0.1"
                  value={params.airTime}
                  onChange={(e) => updateParam('airTime', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxActiveValves">Max Active Valves (Saturation Threshold)</Label>
                  <Input
                    id="maxActiveValves"
                    type="number"
                    value={params.maxActiveValves}
                    onChange={(e) => updateParam('maxActiveValves', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="efficiencyReduction">Efficiency Reduction During Saturation (%)</Label>
                  <Input
                    id="efficiencyReduction"
                    type="number"
                    min="0"
                    max="100"
                    value={params.efficiencyReduction}
                    onChange={(e) => updateParam('efficiencyReduction', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Controller</TabsTrigger>
          <TabsTrigger value="advanced">Advanced + Saturation</TabsTrigger>
          <TabsTrigger value="vsp">Variable Speed</TabsTrigger>
          <TabsTrigger value="monitor">System Monitor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Basic Pneumatic Controller</CardTitle>
                  <CardDescription>
                    Simple ON/OFF controller with hysteresis and air admission timer
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateBasicController(), 'Basic Controller')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCode(generateBasicController(), `${params.valveName}_basic.rb`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SyntaxHighlighter language="ruby" style={vscDarkPlus} showLineNumbers>
                {generateBasicController()}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Advanced Controller with Saturation Protection</CardTitle>
                  <CardDescription>
                    Includes global valve counting and efficiency reduction during system overload
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateAdvancedController(), 'Advanced Controller')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCode(generateAdvancedController(), `${params.valveName}_advanced.rb`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SyntaxHighlighter language="ruby" style={vscDarkPlus} showLineNumbers>
                {generateAdvancedController()}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vsp" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Variable Speed Pump Controller</CardTitle>
                  <CardDescription>
                    Head-dependent flow rate to simulate real valve performance under varying vacuum pressure
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateVSPController(), 'VSP Controller')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCode(generateVSPController(), `${params.valveName}_vsp.rb`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SyntaxHighlighter language="ruby" style={vscDarkPlus} showLineNumbers>
                {generateVSPController()}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitor" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System-Wide Waterlogging Monitor</CardTitle>
                  <CardDescription>
                    Global RTC to detect system saturation and alert conditions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateWaterloggingMonitor(), 'System Monitor')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCode(generateWaterloggingMonitor(), 'system_monitor.rb')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SyntaxHighlighter language="ruby" style={vscDarkPlus} showLineNumbers>
                {generateWaterloggingMonitor()}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
