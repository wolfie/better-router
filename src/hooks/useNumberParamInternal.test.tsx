/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, beforeEach, expect } from "vitest";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime.js";
import { memoryRouter } from "next-router-mock";
import { renderHook } from "@testing-library/react";
import { useNumberParam } from "../page-router/index.js";

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

describe("useNumberParamInternal", () => {
  beforeEach(() => {
    memoryRouter.setCurrentUrl("/");
  });

  it("returns the most funny things as actual numbers", () => {
    const { result, rerender } = renderHook(() => useNumberParam("key"), {
      wrapper,
    });

    memoryRouter.setCurrentUrl("/?key=undefined");
    rerender();
    expect(result.current[0]).toBeNaN();

    memoryRouter.setCurrentUrl("/?key=NaN");
    rerender();
    expect(result.current[0]).toBeNaN();

    memoryRouter.setCurrentUrl("/?key=Infinity");
    rerender();
    expect(result.current[0]).toBe(Infinity);

    memoryRouter.setCurrentUrl("/?key=not-a-number-at-all");
    rerender();
    expect(result.current[0]).toBeNaN();
  });

  it("works for integers", () => {
    const { result, rerender } = renderHook(() => useNumberParam("key"), {
      wrapper,
    });

    memoryRouter.setCurrentUrl("/?key=1");
    rerender();
    expect(result.current[0]).toBe(1);
  });

  it("works for reals", () => {
    const { result, rerender } = renderHook(() => useNumberParam("key"), {
      wrapper,
    });

    memoryRouter.setCurrentUrl("/?key=1.5");
    rerender();
    expect(result.current[0]).toBe(1.5);
  });

  it("works for scientific notation", () => {
    const { result, rerender } = renderHook(() => useNumberParam("key"), {
      wrapper,
    });

    memoryRouter.setCurrentUrl("/?key=1e1");
    rerender();
    expect(result.current[0]).toBe(1e1);
  });
});
