import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["dotenv/config"],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 180_000,
    restoreMocks: true,
  },
});
