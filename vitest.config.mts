import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      // anything that does import { useRouter } from 'next/router'
      "next/router$": "next-router-mock",
      // anything that does import { useRouter } from 'next/navigation'
      "next/navigation$": "next-router-mock/next",
    },
  },
});
