import { z } from 'zod';

// Pipe validation schema
export const PipeSchema = z.object({
  id: z.string().min(1).max(50),
  length: z.number().positive().max(10000),
  diameter: z.number().int().positive().max(1000),
  flow: z.number().nonnegative().max(100),
  cFactor: z.number().int().min(50).max(150),
});

// Network validation schema
export const NetworkSchema = z.object({
  pipes: z.array(PipeSchema).min(1).max(1000),
});

// Fix validation schema
export const FixSchema = z.object({
  pipeId: z.string().min(1).max(50),
  before: z.object({
    parameter: z.enum(['diameter', 'cFactor']),
    value: z.number(),
  }),
  after: z.object({
    parameter: z.enum(['diameter', 'cFactor']),
    value: z.number(),
  }),
});

// ML Optimize request schema
export const MLOptimizeRequestSchema = z.object({
  networkData: NetworkSchema,
  requestType: z.enum(['suggest_fixes', 'learn_from_history']),
});

// What-If Simulate request schema
export const WhatIfSimulateRequestSchema = z.object({
  currentNetwork: NetworkSchema,
  proposedFixes: z.array(FixSchema).max(100),
});
