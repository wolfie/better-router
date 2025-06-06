/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, beforeEach, expect } from "vitest";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime.js";
import { memoryRouter } from "next-router-mock";
import { renderHook } from "@testing-library/react";
import { useStringUnionParam } from "../page-router/index.js";

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

describe("useStringUnionParamInternal", () => {
  beforeEach(() => {
    memoryRouter.setCurrentUrl("/");
  });

  it("treats valid value correctly", () => {
    const { result, rerender } = renderHook(
      () => useStringUnionParam("key", ["foo"]),
      { wrapper }
    );
    expect(result.current[0]).toBeUndefined();

    result.current[1]("foo");
    rerender();
    expect(result.current[0]).toBe("foo");
  });

  it("treats invalid value as undefined (via setter)", () => {
    const { result, rerender } = renderHook(
      () => useStringUnionParam("key", ["foo"]),
      { wrapper }
    );
    result.current[1]("foo");
    rerender();
    expect(result.current[0]).toBe("foo");

    result.current[1]("bar" as any);
    rerender();
    expect(result.current[0]).toBeUndefined();
  });

  it("treats invalid value as undefined (via url)", () => {
    memoryRouter.push("/?key=bar");
    const { result } = renderHook(() => useStringUnionParam("key", ["foo"]), {
      wrapper,
    });
    expect(result.current[0]).toBeUndefined();
  });
});
