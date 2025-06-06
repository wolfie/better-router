import { memoryRouter as mockRouter } from "next-router-mock";
import { describe, vi } from "vitest";
import useInternalStringParams from "./useInternalStringParams.js";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime.js";
import React from "react";
import runSharedTests from "../hooks/commonInternalStringParamsTest.js";

// https://github.com/vercel/next.js/discussions/63100#discussioncomment-8737391 (with modifications)
vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation.js")>();
  const { useRouter } = await vi.importActual<
    typeof import("next-router-mock")
  >("next-router-mock");
  const usePathname = vi.fn().mockImplementation(() => {
    return mockRouter.pathname;
  });
  const useSearchParams = vi.fn().mockImplementation(() => {
    const query = mockRouter.query as Record<string, string | string[]>;
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });
    return params;
  });
  return {
    ...actual,
    useRouter: vi.fn().mockImplementation(useRouter),
    usePathname,
    useSearchParams,
  };
});

const wrapper = (props: React.PropsWithChildren) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <AppRouterContext value={mockRouter as any} {...props} />
);

describe("app-router/useInternalStringParams", () => {
  runSharedTests(mockRouter, wrapper, useInternalStringParams);
});
