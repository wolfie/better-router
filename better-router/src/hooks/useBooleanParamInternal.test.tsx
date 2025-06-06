/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, beforeEach, expect } from "vitest";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime.js";
import { memoryRouter } from "next-router-mock";
import { act, renderHook } from "@testing-library/react";
import { useBooleanParam } from "../page-router/index.js";

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

describe("useBooleanParamInternal", () => {
  beforeEach(() => {
    memoryRouter.setCurrentUrl("/");
  });

  it("treats valid values correctly", () => {
    const { result, rerender } = renderHook(() => useBooleanParam("key"), {
      wrapper,
    });
    expect(result.current[0]).toBeUndefined();

    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
    expect(memoryRouter.asPath).toBe("/?key=true");

    act(() => result.current[1](false));
    expect(result.current[0]).toBe(false);
    expect(memoryRouter.asPath).toBe("/?key=false");

    memoryRouter.setCurrentUrl("/?key=true");
    rerender();
    expect(result.current[0]).toBe(true);
    expect(memoryRouter.asPath).toBe("/?key=true");

    memoryRouter.setCurrentUrl("/?key=false");
    rerender();
    expect(result.current[0]).toBe(false);
    expect(memoryRouter.asPath).toBe("/?key=false");
  });

  it("treats invalid values as undefined", () => {
    const { result, rerender } = renderHook(() => useBooleanParam("key"), {
      wrapper,
    });

    memoryRouter.setCurrentUrl("/?key=True");
    rerender();
    expect(result.current[0]).toBeUndefined();

    memoryRouter.setCurrentUrl("/?key=False");
    rerender();
    expect(result.current[0]).toBeUndefined();

    memoryRouter.setCurrentUrl("/?key");
    rerender();
    expect(result.current[0]).toBeUndefined();
  });
});
