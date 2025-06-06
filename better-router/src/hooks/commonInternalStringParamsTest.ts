import { renderHook } from "@testing-library/react";
import type { MemoryRouter } from "next-router-mock";
import { beforeEach, expect, it } from "vitest";
import type Result from "../lib/Result.js";

const runSharedTests = (
  mockRouter: MemoryRouter,
  wrapper:
    | React.JSXElementConstructor<{ children: React.ReactNode }>
    | undefined,
  useInternalStringParams: (
    key: string,
    defaultValue?: string | string[]
  ) => Result<string[]>
) => {
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
};

export default runSharedTests;
