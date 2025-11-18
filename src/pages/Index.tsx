import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BookOpen, Wrench, DollarSign, Network, GitCompare } from "lucide-react";
import SystemOverview from "@/components/vacuum-sewer/SystemOverview";
import DesignCalculator from "@/components/vacuum-sewer/DesignCalculator";
import ComponentsGuide from "@/components/vacuum-sewer/ComponentsGuide";
import CostEstimator from "@/components/vacuum-sewer/CostEstimator";
import SystemComparison from "@/components/vacuum-sewer/SystemComparison";
import InteractiveDiagrams from "@/components/vacuum-sewer/InteractiveDiagrams";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            EPA Vacuum Sewer Modeling Tool
          </h1>
          <p className="text-muted-foreground">
            Chapter 3: Alternative Wastewater Collection Systems - Design & Analysis
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="diagrams" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Diagrams</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Components</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Costs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SystemOverview />
          </TabsContent>

            <TabsContent value="calculator">
              <DesignCalculator />
            </TabsContent>

            <TabsContent value="diagrams">
              <InteractiveDiagrams />
            </TabsContent>

            <TabsContent value="components">
              <ComponentsGuide />
            </TabsContent>

            <TabsContent value="comparison">
              <SystemComparison />
            </TabsContent>

            <TabsContent value="costs">
              <CostEstimator />
            </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Based on EPA/625/1-91/024 - Alternative Wastewater Collection Systems Manual</p>
          <p className="mt-2">U.S. Environmental Protection Agency, October 1991</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
