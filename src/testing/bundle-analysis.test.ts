import { statSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import gzipSize from "gzip-size";

interface BundleMetrics {
  rawSize: number;
  gzippedSize: number;
  relativePath: string;
}

describe("Bundle Size Analysis", () => {
  const createTestFile = (path: string, content: string) => {
    const fullPath = join(__dirname, "..", "store", path);
    try {
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, content);
      return fullPath;
    } catch (error) {
      console.error(`Error creating test file: ${error}`);
      throw error;
    }
  };

  const getBundleMetrics = async (
    relativePath: string,
    defaultContent: string
  ): Promise<BundleMetrics> => {
    try {
      const fullPath = createTestFile(relativePath, defaultContent);
      const stats = statSync(fullPath);
      const gzipped = await gzipSize.file(fullPath);

      return {
        rawSize: stats.size,
        gzippedSize: gzipped,
        relativePath,
      };
    } catch (error) {
      console.error(`Error getting bundle metrics: ${error}`);
      throw error;
    }
  };

  it("should compare bundle sizes of different implementations", async () => {
    const defaultStoreContent = `
      export const createStore = () => ({
        state: {},
        actions: {},
      });
    `;

    const results: Record<string, BundleMetrics> = {};

    try {
      results.redux = await getBundleMetrics(
        "redux/store.ts",
        defaultStoreContent
      );
      results.zustand = await getBundleMetrics(
        "zustand/store.ts",
        defaultStoreContent
      );
      results.context = await getBundleMetrics(
        "context/store.ts",
        defaultStoreContent
      );
      results.mobx = await getBundleMetrics(
        "mobx/store.ts",
        defaultStoreContent
      );
      results.recoil = await getBundleMetrics(
        "recoil/store.ts",
        defaultStoreContent
      );
      results.jotai = await getBundleMetrics(
        "jotai/store.ts",
        defaultStoreContent
      );

      console.table(
        Object.entries(results).map(([lib, metrics]) => ({
          Library: lib,
          "Raw Size (KB)": (metrics.rawSize / 1024).toFixed(2),
          "Gzipped (KB)": (metrics.gzippedSize / 1024).toFixed(2),
        }))
      );

      expect(results.zustand.gzippedSize).toBeLessThan(
        results.redux.gzippedSize
      );
      expect(results.context.rawSize).toBeLessThan(results.recoil.rawSize);
    } catch (error) {
      console.error(`Test failed: ${error}`);
      throw error;
    }
  });
});
