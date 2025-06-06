import { memoryRouter as mockRouter } from "next-router-mock";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useInternalStringParams from "./useInternalStringParams.js";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime.js";
import React from "react";

// // https://github.com/vercel/next.js/discussions/63100#discussioncomment-8737391 (with modifications)
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
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("returns empty array on no values found", () => {
    const { result } = renderHook(() => useInternalStringParams("key"), {
      wrapper,
    });
    expect(result.current[0]).toHaveLength(0);
  });

  it("returns a single empty string element on empty query parameter", () => {
    mockRouter.push("/?key");
    const { result, rerender } = renderHook(() =>
      useInternalStringParams("key")
    );
    expect(result.current[0]).toEqual([""]);

    mockRouter.push("/?key=");
    rerender("key");
    expect(result.current[0]).toEqual([""]);
  });

  it("returns a single string element on one query parameter", () => {
    mockRouter.push("/?key=value");
    const { result } = renderHook(() => useInternalStringParams("key"));
    const [value] = result.current;
    expect(value).toEqual(["value"]);
  });

  it("returns a two string elements on repeated parameter, with order preserved", () => {
    mockRouter.push("/?key=value1&key=value2");
    const { result, rerender } = renderHook(() =>
      useInternalStringParams("key")
    );
    expect(result.current[0]).toEqual(["value1", "value2"]);

    mockRouter.push("/?key=value2&key=value1");
    rerender("key");
    expect(result.current[0]).toEqual(["value2", "value1"]);
  });
});
