import { memoryRouter as mockRouter } from "next-router-mock";
import { describe, vi } from "vitest";
import useInternalStringParams from "./useInternalStringParams.js";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime.js";
import React from "react";
import runSharedTests from "../hooks/commonInternalStringParamsTest.js";

vi.mock("next/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/router.js")>();
  const { useRouter } = await vi.importActual<
    typeof import("next-router-mock")
  >("next-router-mock");
  return {
    ...actual,
    useRouter: vi.fn().mockImplementation(useRouter),
  };
});

const wrapper = (props: React.PropsWithChildren) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <RouterContext.Provider value={mockRouter as any} {...props} />
);

describe("pages-router/useInternalStringParams", () => {
  runSharedTests(mockRouter, wrapper, useInternalStringParams);
});
