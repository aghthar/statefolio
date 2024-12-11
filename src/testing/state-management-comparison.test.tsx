import { renderHook, act } from "@testing-library/react-hooks";
import { measurePerformance } from "./performance-utils";
import { useStore as useZustandStore } from "../store/zustand/store";
import { useStore as useContextStore } from "../store/context/store";
import { useDispatch, useState } from "../store/context/Provider";
import { store as reduxStore } from "../store/redux/store";
import { useCounterActions } from "../store/context/actions";

describe("State Management Performance Comparison", () => {
  const renderCounter = { count: 0 };

  beforeEach(() => {
    renderCounter.count = 0;
  });

  describe("Counter Operations", () => {
    it("should compare increment performance", async () => {
      const results: Record<string, PerformanceMetrics> = {};

      // Context API Test
      results.contextApi = await measurePerformance(async () => {
        const { result } = renderHook(
          () => ({
            actions: useCounterActions(),
            state: useState(),
          }),
          {
            wrapper: ({ children }) => (
              <StoreProvider>{children}</StoreProvider>
            ),
          }
        );

        for (let i = 0; i < 1000; i++) {
          act(() => {
            result.current.actions.increment();
          });
        }
      }, renderCounter);

      // Zustand Test
      results.zustand = await measurePerformance(async () => {
        const { result } = renderHook(() => useZustandStore());

        for (let i = 0; i < 1000; i++) {
          act(() => {
            result.current.increment();
          });
        }
      }, renderCounter);

      // Redux Test
      results.redux = await measurePerformance(async () => {
        for (let i = 0; i < 1000; i++) {
          await reduxStore.dispatch(increment());
        }
      }, renderCounter);

      // Log and compare results
      console.table(results);

      // Assertions based on documented performance metrics
      expect(results.zustand.executionTime).toBeLessThan(
        results.contextApi.executionTime
      );
      expect(results.zustand.reRenderCount).toBeLessThan(
        results.contextApi.reRenderCount
      );
    });
  });

  describe("Todo Operations", () => {
    it("should compare todo list performance", async () => {
      const results: Record<string, PerformanceMetrics> = {};

      // Test adding and removing todos
      const todoOperations = async (
        addTodo: (text: string) => void,
        removeTodo: (index: number) => void
      ) => {
        for (let i = 0; i < 100; i++) {
          await act(async () => {
            addTodo(`Todo ${i}`);
          });
        }

        for (let i = 0; i < 50; i++) {
          await act(async () => {
            removeTodo(0);
          });
        }
      };

      // Context API
      results.contextApi = await measurePerformance(async () => {
        const { result } = renderHook(
          () => ({
            actions: useTodoActions(),
            state: useState(),
          }),
          {
            wrapper: ({ children }) => (
              <StoreProvider>{children}</StoreProvider>
            ),
          }
        );

        await todoOperations(
          result.current.actions.addTodo,
          result.current.actions.removeTodo
        );
      }, renderCounter);

      // Similar tests for other libraries...

      console.table(results);
    });
  });

  describe("Memory Usage", () => {
    it("should compare memory usage for large datasets", async () => {
      const results: Record<string, PerformanceMetrics> = {};

      // Generate large dataset
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        text: `Item ${i}`,
        completed: false,
      }));

      // Test each library with the large dataset
      // ... implementation for each library ...

      console.table(results);
    });
  });
});
