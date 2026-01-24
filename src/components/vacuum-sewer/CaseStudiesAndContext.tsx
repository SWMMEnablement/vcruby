import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  AlertTriangle, 
  DollarSign, 
  Wrench,
  Clock,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap
} from "lucide-react";

const CaseStudiesAndContext = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Case Studies & Practical Context</CardTitle>
              <CardDescription>
                Real-world performance data, operational challenges, and lessons learned from vacuum sewer installations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Operational Challenges
          </TabsTrigger>
          <TabsTrigger value="costs" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Real Costs
          </TabsTrigger>
          <TabsTrigger value="cases" className="gap-2">
            <MapPin className="h-4 w-4" />
            Case Studies
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Valve Pit Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Valve pits are the most maintenance-intensive component. Field experience shows 
                  1-2 service calls per valve pit per year are typical, not the 0.5/year often quoted.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Common Failure Modes</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Sensor tube blockage</span>
                        <p className="text-muted-foreground text-xs">Grease/debris blocks pneumatic sensor, valve fails open</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Diaphragm wear</span>
                        <p className="text-muted-foreground text-xs">Neoprene degrades after 50,000-100,000 cycles</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Controller malfunction</span>
                        <p className="text-muted-foreground text-xs">Pneumatic controller timing drift or failure</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Sump flooding</span>
                        <p className="text-muted-foreground text-xs">Groundwater infiltration through seals</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Maintenance Schedule (Realistic)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span>Valve inspection</span>
                      <Badge variant="outline">Every 6 months</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Sensor cleaning</span>
                      <Badge variant="outline">Quarterly</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Diaphragm replacement</span>
                      <Badge variant="outline">5-8 years</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Full valve rebuild</span>
                      <Badge variant="outline">8-12 years</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Controller calibration</span>
                      <Badge variant="outline">Annual</Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Power Dependency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Unlike gravity sewers, vacuum systems are completely power-dependent. Extended 
                    outages (&gt;2-4 hours) can result in sump overflows and sewage backups.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Backup Power Options</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Diesel generator (typical)</li>
                      <li>• UPS for controls</li>
                      <li>• Natural gas generator</li>
                      <li>• Battery backup (emerging)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Typical Storage Times</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Valve pit sump: 4-8 hours</li>
                      <li>• Collection tank: 2-4 hours</li>
                      <li>• With generator: Unlimited</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Generator Sizing</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 50 homes: 30-50 kW</li>
                      <li>• 150 homes: 75-100 kW</li>
                      <li>• 300 homes: 150-200 kW</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Skilled Operator Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Required Skills
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Pneumatic system troubleshooting</li>
                    <li>• Vacuum pump maintenance</li>
                    <li>• PLC/SCADA familiarity</li>
                    <li>• Valve rebuild procedures</li>
                    <li>• Leak detection methods</li>
                    <li>• Basic electrical knowledge</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Training Timeline</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center justify-between">
                      <span>Initial manufacturer training</span>
                      <Badge>3-5 days</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Field competency</span>
                      <Badge>3-6 months</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Full system proficiency</span>
                      <Badge>1-2 years</Badge>
                    </li>
                  </ul>
                </div>
              </div>
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Many small utilities underestimate training needs. The EPA myth "any mechanically 
                  inclined person can operate a vacuum system" is technically true but understates 
                  the learning curve for efficient troubleshooting.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-World Cost Comparison (2024 Dollars)</CardTitle>
              <CardDescription>Based on actual project data, not manufacturer estimates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Cost Element</th>
                      <th className="text-center p-3">Vacuum</th>
                      <th className="text-center p-3">Gravity</th>
                      <th className="text-center p-3">Low-Pressure</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Capital: Mains ($/LF)</td>
                      <td className="p-3 text-center">$45-75</td>
                      <td className="p-3 text-center">$80-200</td>
                      <td className="p-3 text-center">$40-70</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Capital: Service ($/home)</td>
                      <td className="p-3 text-center">$4,500-8,000</td>
                      <td className="p-3 text-center">$3,000-6,000</td>
                      <td className="p-3 text-center">$8,000-15,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Capital: Station</td>
                      <td className="p-3 text-center">$350K-800K</td>
                      <td className="p-3 text-center">$150K-400K (lift)</td>
                      <td className="p-3 text-center">$100K-250K</td>
                    </tr>
                    <tr className="border-b bg-secondary">
                      <td className="p-3 font-medium">O&M: Annual ($/EDU)</td>
                      <td className="p-3 text-center">$180-350</td>
                      <td className="p-3 text-center">$80-150</td>
                      <td className="p-3 text-center">$200-400</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Power ($/EDU/yr)</td>
                      <td className="p-3 text-center">$35-60</td>
                      <td className="p-3 text-center">$15-30</td>
                      <td className="p-3 text-center">$80-150</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Major Rehab (20-yr)</td>
                      <td className="p-3 text-center">$2,500-4,000/EDU</td>
                      <td className="p-3 text-center">$500-1,500/EDU</td>
                      <td className="p-3 text-center">$3,000-5,000/EDU</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                EDU = Equivalent Dwelling Unit. Costs vary significantly by region, soil conditions, and labor rates. 
                Data compiled from ASCE, WEF publications, and utility surveys (2018-2023).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">When Vacuum Systems Are Cost-Competitive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                    <CheckCircle className="h-4 w-4" />
                    Favorable Conditions
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 bg-primary/10 rounded">
                      <span className="font-medium">High water table (&gt;4 ft)</span>
                      <p className="text-xs text-muted-foreground">Eliminates dewatering costs, reduces I&I</p>
                    </li>
                    <li className="p-2 bg-primary/10 rounded">
                      <span className="font-medium">Rocky/hard soil</span>
                      <p className="text-xs text-muted-foreground">Shallow trenching saves 40-60% excavation</p>
                    </li>
                    <li className="p-2 bg-primary/10 rounded">
                      <span className="font-medium">Flat terrain (&lt;0.5% grade)</span>
                      <p className="text-xs text-muted-foreground">Avoids multiple lift stations</p>
                    </li>
                    <li className="p-2 bg-primary/10 rounded">
                      <span className="font-medium">Low density (&lt;3 homes/acre)</span>
                      <p className="text-xs text-muted-foreground">Smaller pipe sizes economical</p>
                    </li>
                    <li className="p-2 bg-primary/10 rounded">
                      <span className="font-medium">Environmentally sensitive areas</span>
                      <p className="text-xs text-muted-foreground">Sealed system prevents contamination</p>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" />
                    Unfavorable Conditions
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 bg-destructive/10 rounded">
                      <span className="font-medium">Hilly terrain (&gt;3% grade)</span>
                      <p className="text-xs text-muted-foreground">Gravity becomes more economical</p>
                    </li>
                    <li className="p-2 bg-destructive/10 rounded">
                      <span className="font-medium">High density (&gt;6 homes/acre)</span>
                      <p className="text-xs text-muted-foreground">Many valve pits = high O&M</p>
                    </li>
                    <li className="p-2 bg-destructive/10 rounded">
                      <span className="font-medium">Commercial/industrial loads</span>
                      <p className="text-xs text-muted-foreground">High flow variability challenges system</p>
                    </li>
                    <li className="p-2 bg-destructive/10 rounded">
                      <span className="font-medium">Limited skilled labor</span>
                      <p className="text-xs text-muted-foreground">High O&M costs, poor performance</p>
                    </li>
                    <li className="p-2 bg-destructive/10 rounded">
                      <span className="font-medium">Extreme cold climates</span>
                      <p className="text-xs text-muted-foreground">Valve pit freezing concerns</p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ocean Pines, MD
                </CardTitle>
                <CardDescription>Large-scale residential success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Homes Served</p>
                    <p className="font-bold">8,500+</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Years Operating</p>
                    <p className="font-bold">40+ years</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">System Length</p>
                    <p className="font-bold">150+ miles</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Valve Pits</p>
                    <p className="font-bold">2,800+</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Key Lessons</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• High water table made gravity impossible</li>
                    <li>• Dedicated O&M staff (8 FTE) essential</li>
                    <li>• Proactive valve maintenance reduces emergencies</li>
                    <li>• System has 97%+ uptime reliability</li>
                  </ul>
                </div>
                <Badge variant="secondary">AIRVAC System</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Lake of the Woods, VA
                </CardTitle>
                <CardDescription>First U.S. vacuum sewer system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Homes Served</p>
                    <p className="font-bold">3,200+</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Years Operating</p>
                    <p className="font-bold">50+ years</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">System Type</p>
                    <p className="font-bold">Vac-Q-Tec</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Terrain</p>
                    <p className="font-bold">Flat/wooded</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Key Lessons</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Early electric valves less reliable than pneumatic</li>
                    <li>• System upgraded over decades</li>
                    <li>• Operator training critical for long-term success</li>
                    <li>• Expansion phases proven cost-effective</li>
                  </ul>
                </div>
                <Badge variant="outline">Historic Installation</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Sanibel Island, FL
                </CardTitle>
                <CardDescription>Environmental protection focus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Homes Served</p>
                    <p className="font-bold">4,000+</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Environment</p>
                    <p className="font-bold">Barrier Island</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Water Table</p>
                    <p className="font-bold">2-3 ft</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Soil Type</p>
                    <p className="font-bold">Sandy/coral</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Key Lessons</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Zero I&I critical for sensitive waters</li>
                    <li>• Hurricane resilience tested and proven</li>
                    <li>• Saltwater corrosion required special materials</li>
                    <li>• Tourism economy justified higher capital cost</li>
                  </ul>
                </div>
                <Badge className="bg-primary">Environmental Success</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Various European Cities
                </CardTitle>
                <CardDescription>Different design philosophy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Countries</p>
                    <p className="font-bold">Germany, Sweden, NL</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Total Connections</p>
                    <p className="font-bold">100,000+</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Approach</p>
                    <p className="font-bold">Larger networks</p>
                  </div>
                  <div className="p-2 bg-secondary rounded">
                    <p className="text-xs text-muted-foreground">Integration</p>
                    <p className="font-bold">SCADA standard</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Key Differences</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Higher automation, remote monitoring standard</li>
                    <li>• Larger service areas per station</li>
                    <li>• More centralized O&M organizations</li>
                    <li>• Vacuum toilet integration common</li>
                  </ul>
                </div>
                <Badge variant="secondary">International Reference</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                20-Year Performance Data Summary
              </CardTitle>
              <CardDescription>Aggregated from published utility surveys and WEF studies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-3xl font-bold text-primary">96%</p>
                  <p className="text-sm text-muted-foreground">Avg System Uptime</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="text-3xl font-bold">1.8</p>
                  <p className="text-sm text-muted-foreground">Service Calls/Valve/Yr</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="text-3xl font-bold">$285</p>
                  <p className="text-sm text-muted-foreground">Avg O&M $/EDU/Yr</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="text-3xl font-bold">25+</p>
                  <p className="text-sm text-muted-foreground">Avg System Life (Yrs)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Reliability Metrics</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Valve Pit Reliability</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: '94%'}}></div>
                        </div>
                        <span className="text-sm font-bold">94%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vacuum Station Reliability</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: '98%'}}></div>
                        </div>
                        <span className="text-sm font-bold">98%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pipeline Integrity</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: '99%'}}></div>
                        </div>
                        <span className="text-sm font-bold">99%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">I&I Performance</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: '97%'}}></div>
                        </div>
                        <span className="text-sm font-bold">97% less than gravity</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Common Issues by Frequency</h4>
                  <div className="space-y-2">
                    {[
                      { issue: 'Valve sensor/controller issues', pct: 45 },
                      { issue: 'Valve diaphragm/seal wear', pct: 25 },
                      { issue: 'Blockages (FOG, debris)', pct: 15 },
                      { issue: 'Vacuum pump issues', pct: 8 },
                      { issue: 'Pipeline damage', pct: 5 },
                      { issue: 'Other', pct: 2 }
                    ].map(item => (
                      <div key={item.issue} className="flex items-center gap-3">
                        <span className="text-sm flex-1">{item.issue}</span>
                        <div className="w-48 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{width: `${item.pct}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-12 text-right">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Key Finding:</strong> Systems with dedicated vacuum-trained staff show 40% 
                    fewer service calls and 60% faster response times than those relying on general 
                    utility workers. Investment in training has measurable ROI.
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

export default CaseStudiesAndContext;
