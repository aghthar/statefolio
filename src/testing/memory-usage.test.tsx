import { renderHook, act } from "@testing-library/react-hooks";
import { measurePerformance } from "./performance-utils";

interface MemoryTestResult {
  initialMemory: number;
  afterLoad: number;
  afterOperations: number;
  afterGC: number;
}

describe("Memory Usage Comparison", () => {
  // Helper to force garbage collection if available
  const forceGC = () => {
    if (global.gc) {
      global.gc();
    }
  };

  const generateLargeDataset = (size: number) =>
    Array.from({ length: size }, (_, i) => ({
      id: i,
      text: `Item ${i}`,
      completed: false,
      tags: [`tag${i % 5}`, `priority${i % 3}`],
      timestamp: Date.now(),
      metadata: {
        createdBy: `user${i % 10}`,
        category: `category${i % 8}`,
      },
    }));

  async function measureStoreMemory(
    setupHook: () => any,
    operations: (store: any) => Promise<void>
  ): Promise<MemoryTestResult> {
    forceGC();
    const initialMemory = process.memoryUsage().heapUsed;

    const { result } = renderHook(setupHook);
    const afterLoad = process.memoryUsage().heapUsed;

    await operations(result.current);
    const afterOperations = process.memoryUsage().heapUsed;

    forceGC();
    const afterGC = process.memoryUsage().heapUsed;

    return {
      initialMemory,
      afterLoad: afterLoad - initialMemory,
      afterOperations: afterOperations - initialMemory,
      afterGC: afterGC - initialMemory,
    };
  }

  it("should compare memory usage with large datasets", async () => {
    const results: Record<string, MemoryTestResult> = {};
    const largeDataset = generateLargeDataset(10000);

    // Test Redux
    results.redux = await measureStoreMemory(
      () => useReduxStore(),
      async (store) => {
        await act(async () => {
          store.dispatch(setItems(largeDataset));
          store.dispatch(updateItems(largeDataset.slice(0, 1000)));
          store.dispatch(
            removeItems(largeDataset.slice(0, 500).map((i) => i.id))
          );
        });
      }
    );

    // Test Zustand
    results.zustand = await measureStoreMemory(
      () => useZustandStore(),
      async (store) => {
        await act(async () => {
          store.setItems(largeDataset);
          store.updateItems(largeDataset.slice(0, 1000));
          store.removeItems(largeDataset.slice(0, 500).map((i) => i.id));
        });
      }
    );

    // Test Context
    results.context = await measureStoreMemory(
      () => useContextStore(),
      async (store) => {
        await act(async () => {
          store.setItems(largeDataset);
          store.updateItems(largeDataset.slice(0, 1000));
          store.removeItems(largeDataset.slice(0, 500).map((i) => i.id));
        });
      }
    );

    // Add similar tests for other libraries...

    console.table(
      Object.entries(results).map(([lib, metrics]) => ({
        Library: lib,
        "Initial Load (MB)": (metrics.afterLoad / 1024 / 1024).toFixed(2),
        "After Operations (MB)": (
          metrics.afterOperations /
          1024 /
          1024
        ).toFixed(2),
        "After GC (MB)": (metrics.afterGC / 1024 / 1024).toFixed(2),
        "Memory Retained (MB)": (
          (metrics.afterGC - metrics.afterLoad) /
          1024 /
          1024
        ).toFixed(2),
      }))
    );

    // Verify against documented metrics
    expect(results.zustand.afterGC).toBeLessThan(results.redux.afterGC);
    expect(results.context.afterLoad).toBeLessThan(results.recoil.afterLoad);
  });

  it("should measure memory leaks during rapid updates", async () => {
    const updateCycles = 1000;

    async function runUpdateTest(store: any) {
      for (let i = 0; i < updateCycles; i++) {
        await act(async () => {
          store.updateValue(Math.random());
        });
      }
    }

    // Test each library...
    const results: Record<string, number> = {};

    for (const lib of [
      "redux",
      "zustand",
      "context",
      "mobx",
      "recoil",
      "jotai",
    ]) {
      const { afterGC, initialMemory } = await measureStoreMemory(
        () => useStore(lib),
        runUpdateTest
      );
      results[lib] = afterGC - initialMemory;
    }

    console.table(
      Object.entries(results).map(([lib, leakedMemory]) => ({
        Library: lib,
        "Leaked Memory (KB)": (leakedMemory / 1024).toFixed(2),
      }))
    );
  });
});
