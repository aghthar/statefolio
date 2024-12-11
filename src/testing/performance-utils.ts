import { performance } from "perf_hooks";

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  reRenderCount: number;
}

export const measurePerformance = async (
  operation: () => Promise<void> | void,
  renderCounter: { count: number }
): Promise<PerformanceMetrics> => {
  const startMemory = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  renderCounter.count = 0;
  await operation();

  return {
    executionTime: performance.now() - startTime,
    memoryUsage: process.memoryUsage().heapUsed - startMemory,
    reRenderCount: renderCounter.count,
  };
};
