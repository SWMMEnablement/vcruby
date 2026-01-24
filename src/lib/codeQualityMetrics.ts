/**
 * Code Quality Metrics Calculator
 * Calculates complexity scores, maintainability index, and test coverage for components
 */

import { componentDocs, type ComponentDoc } from "./componentDocs";

export interface QualityMetrics {
  complexityScore: number; // Cyclomatic complexity estimate (1-10)
  maintainabilityIndex: number; // 0-100 scale (higher is better)
  testCoverage: number; // Percentage (0-100)
  codeSmells: CodeSmell[];
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  halsteadMetrics: HalsteadMetrics;
  duplicateCodeRisk: 'low' | 'medium' | 'high';
  documentationCoverage: number; // Percentage (0-100)
}

export interface CodeSmell {
  type: string;
  severity: 'info' | 'warning' | 'error';
  description: string;
  location?: string;
}

export interface HalsteadMetrics {
  vocabulary: number;
  length: number;
  difficulty: number;
  effort: number;
  estimatedBugs: number;
}

// Calculate cyclomatic complexity based on component characteristics
export const calculateComplexityScore = (doc: ComponentDoc): number => {
  let complexity = 1; // Base complexity

  // More methods = higher complexity
  complexity += (doc.methods?.length || 0) * 0.8;

  // More props = more state management complexity
  complexity += (doc.props?.length || 0) * 0.3;

  // More interfaces = more type complexity
  complexity += (doc.interfaces?.length || 0) * 0.5;

  // Lines of code impact
  if (doc.linesOfCode > 500) complexity += 2;
  else if (doc.linesOfCode > 300) complexity += 1;
  else if (doc.linesOfCode > 150) complexity += 0.5;

  // More dependencies = higher coupling complexity
  complexity += doc.dependencies.length * 0.2;

  // Category-specific adjustments
  if (doc.category === "Integration") complexity += 1.5;
  if (doc.category === "Code Generation") complexity += 1.2;
  if (doc.category === "Analysis") complexity += 1;

  return Math.min(10, Math.max(1, Math.round(complexity * 10) / 10));
};

// Calculate maintainability index (based on Microsoft's formula adaptation)
// MI = MAX(0, (171 - 5.2 * ln(V) - 0.23 * G - 16.2 * ln(LOC)) * 100 / 171)
export const calculateMaintainabilityIndex = (doc: ComponentDoc): number => {
  const loc = doc.linesOfCode;
  const complexity = calculateComplexityScore(doc);
  
  // Simplified Halstead volume approximation
  const vocabularyEstimate = doc.dependencies.length + (doc.props?.length || 0) + (doc.methods?.length || 0);
  const halsteadVolume = vocabularyEstimate * Math.log2(Math.max(1, vocabularyEstimate));
  
  // Microsoft MI formula adapted
  let mi = 171 - 5.2 * Math.log(Math.max(1, halsteadVolume)) 
           - 0.23 * complexity 
           - 16.2 * Math.log(Math.max(1, loc));
  
  // Normalize to 0-100
  mi = (mi * 100) / 171;
  
  // Bonus for documentation
  if (doc.usageExample) mi += 5;
  if (doc.description.length > 100) mi += 3;
  
  // Penalty for large files
  if (loc > 1000) mi -= 10;
  if (loc > 500) mi -= 5;
  
  return Math.round(Math.max(0, Math.min(100, mi)));
};

// Estimate test coverage based on component structure
export const estimateTestCoverage = (doc: ComponentDoc): number => {
  let coverage = 0;
  
  // Base coverage by category
  const categoryBaseline: Record<string, number> = {
    "Documentation": 45,
    "Tools": 60,
    "Integration": 55,
    "Code Generation": 70,
    "Testing": 80,
    "Analysis": 65,
    "Validation": 75,
    "Visualization": 50
  };
  
  coverage = categoryBaseline[doc.category] || 40;
  
  // Adjust based on complexity
  const complexity = calculateComplexityScore(doc);
  coverage -= (complexity - 5) * 3;
  
  // Adjust based on methods (more methods = more testable)
  coverage += (doc.methods?.length || 0) * 4;
  
  // Components with interfaces tend to be more tested
  coverage += (doc.interfaces?.length || 0) * 5;
  
  // Large files tend to have lower coverage
  if (doc.linesOfCode > 500) coverage -= 10;
  if (doc.linesOfCode > 1000) coverage -= 10;
  
  return Math.round(Math.max(0, Math.min(100, coverage)));
};

// Detect potential code smells
export const detectCodeSmells = (doc: ComponentDoc): CodeSmell[] => {
  const smells: CodeSmell[] = [];
  
  // God Component smell
  if (doc.linesOfCode > 800) {
    smells.push({
      type: "God Component",
      severity: "warning",
      description: `Component has ${doc.linesOfCode} lines. Consider splitting into smaller components.`,
      location: doc.filePath
    });
  }
  
  if (doc.linesOfCode > 1500) {
    smells.push({
      type: "Excessive Size",
      severity: "error",
      description: "Component exceeds 1500 lines. Refactoring strongly recommended.",
      location: doc.filePath
    });
  }
  
  // High coupling
  if (doc.dependencies.length > 10) {
    smells.push({
      type: "High Coupling",
      severity: "warning",
      description: `${doc.dependencies.length} dependencies detected. Consider reducing external dependencies.`
    });
  }
  
  // Missing documentation
  if (!doc.usageExample) {
    smells.push({
      type: "Missing Example",
      severity: "info",
      description: "No usage example provided. Consider adding documentation."
    });
  }
  
  // Complex interface
  if ((doc.interfaces?.length || 0) > 3) {
    smells.push({
      type: "Complex Types",
      severity: "info",
      description: "Multiple interfaces suggest complex data structures."
    });
  }
  
  // No props on integration component
  if (doc.category === "Integration" && (!doc.props || doc.props.length === 0)) {
    smells.push({
      type: "Limited Configurability",
      severity: "info",
      description: "Integration component lacks configurable props."
    });
  }
  
  return smells;
};

// Calculate Halstead metrics
export const calculateHalsteadMetrics = (doc: ComponentDoc): HalsteadMetrics => {
  // Operators estimate based on methods and complexity
  const operators = (doc.methods?.length || 0) * 5 + doc.dependencies.length * 2;
  
  // Operands estimate based on props and interfaces
  const operands = (doc.props?.length || 0) * 3 + 
                   (doc.interfaces?.reduce((sum, i) => sum + i.properties.length, 0) || 0);
  
  const vocabulary = operators + operands;
  const length = operators * 2 + operands * 3;
  const difficulty = vocabulary > 0 ? (operators / 2) * (operands / Math.max(1, operators)) : 0;
  const effort = difficulty * length;
  const estimatedBugs = length / 3000;
  
  return {
    vocabulary: Math.round(vocabulary),
    length: Math.round(length),
    difficulty: Math.round(difficulty * 10) / 10,
    effort: Math.round(effort),
    estimatedBugs: Math.round(estimatedBugs * 100) / 100
  };
};

// Determine quality grade
export const calculateQualityGrade = (
  maintainability: number,
  complexity: number,
  testCoverage: number
): 'A' | 'B' | 'C' | 'D' | 'F' => {
  const score = (maintainability * 0.4) + ((10 - complexity) * 3 * 0.3) + (testCoverage * 0.3);
  
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
};

// Calculate duplicate code risk
export const calculateDuplicateRisk = (doc: ComponentDoc): 'low' | 'medium' | 'high' => {
  // Large files with similar patterns suggest duplication
  if (doc.linesOfCode > 1000) return 'high';
  if (doc.linesOfCode > 500 && doc.dependencies.length < 5) return 'medium';
  return 'low';
};

// Calculate documentation coverage
export const calculateDocumentationCoverage = (doc: ComponentDoc): number => {
  let coverage = 0;
  const totalPoints = 5;
  
  if (doc.description && doc.description.length > 50) coverage += 1;
  if (doc.usageExample) coverage += 1;
  if (doc.props && doc.props.every(p => p.description)) coverage += 1;
  if (doc.methods && doc.methods.every(m => m.description)) coverage += 1;
  if (doc.interfaces && doc.interfaces.every(i => i.properties.every(p => p.description))) coverage += 1;
  
  return Math.round((coverage / totalPoints) * 100);
};

// Get complete quality metrics for a component
export const getComponentQualityMetrics = (doc: ComponentDoc): QualityMetrics => {
  const complexityScore = calculateComplexityScore(doc);
  const maintainabilityIndex = calculateMaintainabilityIndex(doc);
  const testCoverage = estimateTestCoverage(doc);
  
  return {
    complexityScore,
    maintainabilityIndex,
    testCoverage,
    codeSmells: detectCodeSmells(doc),
    qualityGrade: calculateQualityGrade(maintainabilityIndex, complexityScore, testCoverage),
    halsteadMetrics: calculateHalsteadMetrics(doc),
    duplicateCodeRisk: calculateDuplicateRisk(doc),
    documentationCoverage: calculateDocumentationCoverage(doc)
  };
};

// Get project-wide quality summary
export const getProjectQualitySummary = () => {
  const allMetrics = componentDocs.map(doc => ({
    name: doc.name,
    metrics: getComponentQualityMetrics(doc)
  }));
  
  const avgMaintainability = allMetrics.reduce((sum, m) => sum + m.metrics.maintainabilityIndex, 0) / allMetrics.length;
  const avgComplexity = allMetrics.reduce((sum, m) => sum + m.metrics.complexityScore, 0) / allMetrics.length;
  const avgTestCoverage = allMetrics.reduce((sum, m) => sum + m.metrics.testCoverage, 0) / allMetrics.length;
  
  const gradeDistribution = allMetrics.reduce((acc, m) => {
    acc[m.metrics.qualityGrade] = (acc[m.metrics.qualityGrade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalSmells = allMetrics.reduce((sum, m) => sum + m.metrics.codeSmells.length, 0);
  const criticalSmells = allMetrics.reduce((sum, m) => 
    sum + m.metrics.codeSmells.filter(s => s.severity === 'error').length, 0);
  
  return {
    avgMaintainability: Math.round(avgMaintainability),
    avgComplexity: Math.round(avgComplexity * 10) / 10,
    avgTestCoverage: Math.round(avgTestCoverage),
    gradeDistribution,
    totalSmells,
    criticalSmells,
    componentMetrics: allMetrics
  };
};
