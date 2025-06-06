/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, beforeEach, expect } from "vitest";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime.js";
import { memoryRouter } from "next-router-mock";
import { renderHook } from "@testing-library/react";
import { useIntParam } from "../page-router/index.js";

// Note: The test uses page router only because mocking requires less code.
// The underlying logic relies on the `useInternalStringParams` being equal in both routers,
// and that is tested separately. We only test what is specific to this particular hook.

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
  <RouterContext value={memoryRouter as any} {...props} />
);

describe("useIntParamInternal", () => {
  beforeEach(() => {
    memoryRouter.setCurrentUrl("/");
  });

  it("treats integers correctly", () => {
    const { result, rerender } = renderHook(() => useIntParam("key"), {
      wrapper,
    });

    memoryRouter.setCurrentUrl("/?key=0");
    rerender();
    expect(result.current[0]).toBe(0);
    memoryRouter.setCurrentUrl("/?key=1");
    rerender();
    expect(result.current[0]).toBe(1);
    memoryRouter.setCurrentUrl("/?key=-1");
    rerender();
    expect(result.current[0]).toBe(-1);
  });

  it("treats non-integers as undefineds", () => {
    const { result, rerender } = renderHook(() => useIntParam("key"), {
      wrapper,
    });

    memoryRouter.setCurrentUrl("/?key=1.5"); // real
    rerender();
    expect(result.current[0]).toBeUndefined();
    memoryRouter.setCurrentUrl("/?key=NaN"); // NaN
    rerender();
    expect(result.current[0]).toBeUndefined();
    memoryRouter.setCurrentUrl("/?key=Infinity"); // Infinity
    rerender();
    expect(result.current[0]).toBeUndefined();
    memoryRouter.setCurrentUrl("/?key=5e-1"); // scientific notation
    rerender();
    expect(result.current[0]).toBeUndefined();
  });
});
