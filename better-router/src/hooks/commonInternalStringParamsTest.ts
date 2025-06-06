import { renderHook, act } from "@testing-library/react";
import type { MemoryRouter } from "next-router-mock";
import { beforeEach, describe, expect, it } from "vitest";
import type Result from "../lib/Result.js";

const runSharedTests = (
  memoryRouter: MemoryRouter,
  wrapper:
    | React.JSXElementConstructor<{ children: React.ReactNode }>
    | undefined,
  useInternalStringParams: (
    key: string,
    defaultValue?: string | string[]
  ) => Result<string[]>
) => {
  beforeEach(() => {
    memoryRouter.setCurrentUrl("/");
  });

  describe("read single key", () => {
    it("returns empty array on no values found", () => {
      const { result } = renderHook(() => useInternalStringParams("key"), {
        wrapper,
      });
      expect(result.current[0]).toHaveLength(0);
    });

    it("returns a single empty string element on empty query parameter", () => {
      memoryRouter.push("/?key");
      const { result, rerender } = renderHook(() =>
        useInternalStringParams("key")
      );
      expect(result.current[0]).toEqual([""]);

      memoryRouter.push("/?key=");
      rerender();
      expect(result.current[0]).toEqual([""]);
    });

    it("returns a single string element on one query parameter", () => {
      memoryRouter.push("/?key=value");
      const { result } = renderHook(() => useInternalStringParams("key"));
      const [value] = result.current;
      expect(value).toEqual(["value"]);
    });

    it("returns a two string elements on repeated parameter, with order preserved", () => {
      memoryRouter.push("/?key=value1&key=value2");
      const { result, rerender } = renderHook(() =>
        useInternalStringParams("key")
      );
      expect(result.current[0]).toEqual(["value1", "value2"]);

      memoryRouter.push("/?key=value2&key=value1");
      rerender();
      expect(result.current[0]).toEqual(["value2", "value1"]);
    });
  });

  describe("handle multiple keys", () => {
    it("reacts to route changes correctly", () => {
      const { result: key1, rerender: key1Rerender } = renderHook(
        () => useInternalStringParams("key1"),
        { wrapper }
      );
      const { result: key2, rerender: key2Rerender } = renderHook(
        () => useInternalStringParams("key2"),
        { wrapper }
      );
      expect(key1.current[0]).toEqual([]);
      expect(key2.current[0]).toEqual([]);

      memoryRouter.push("/?key1=value");
      key1Rerender();
      key2Rerender();
      expect(key1.current[0]).toEqual(["value"]);
      expect(key2.current[0]).toEqual([]);

      memoryRouter.push("/?key2=value");
      key1Rerender();
      key2Rerender();
      expect(key1.current[0]).toEqual([]);
      expect(key2.current[0]).toEqual(["value"]);
    });

    it("handles single one change at a time", () => {
      const { result: key1, rerender: key1Rerender } = renderHook(
        () => useInternalStringParams("key1"),
        { wrapper }
      );
      const { result: key2, rerender: key2Rerender } = renderHook(
        () => useInternalStringParams("key2"),
        { wrapper }
      );
      act(() => key1.current[1](["value"]));

      key1Rerender();
      key2Rerender();
      expect(key1.current[0]).toEqual(["value"]);
      expect(key2.current[0]).toEqual([]);

      act(() => key2.current[1](["value"]));
      key1Rerender();
      key2Rerender();
      expect(key1.current[0]).toEqual(["value"]);
      expect(key2.current[0]).toEqual(["value"]);
    });

    it("handles multiple changes at a time", () => {
      const { result: key1, rerender: key1Rerender } = renderHook(
        () => useInternalStringParams("key1"),
        { wrapper }
      );
      const { result: key2, rerender: key2Rerender } = renderHook(
        () => useInternalStringParams("key2"),
        { wrapper }
      );
      act(() => {
        key1.current[1](["value"]);
        key2.current[1](["value"]);
      });

      key1Rerender();
      key2Rerender();
      expect(key1.current[0]).toEqual(["value"]);
      expect(key2.current[0]).toEqual(["value"]);
    });
  });

  describe("change routes", () => {
    it("changes the route with single value", () => {
      const { result, rerender } = renderHook(() =>
        useInternalStringParams("key")
      );
      expect(result.current[0].at(0)).toBeUndefined();
      act(() => result.current[1](["value"]));

      rerender();
      expect(result.current[0].at(0)).toBe("value");
      expect(memoryRouter.asPath).toBe("/?key=value");
    });

    it("changes the route with two values", () => {
      const { result, rerender } = renderHook(() =>
        useInternalStringParams("key")
      );
      expect(result.current[0].at(0)).toBeUndefined();
      act(() => result.current[1](["value1", "value2"]));

      rerender();
      expect(result.current[0]).toEqual(["value1", "value2"]);
      expect(memoryRouter.asPath).toBe("/?key=value1&key=value2");
    });

    it("clears the value with undefined", () => {
      const { result, rerender } = renderHook(() =>
        useInternalStringParams("key")
      );

      act(() => result.current[1](["value1", "value2"]));
      rerender();
      act(() => result.current[1](undefined));
      rerender();
      expect(result.current[0]).toEqual([]);
      expect(memoryRouter.asPath).toBe("/");
    });

    it("clears the value with empty array", () => {
      const { result, rerender } = renderHook(() =>
        useInternalStringParams("key")
      );

      act(() => result.current[1](["value1", "value2"]));
      rerender();
      act(() => result.current[1]([]));
      rerender();
      expect(result.current[0]).toEqual([]);
      expect(memoryRouter.asPath).toBe("/");
    });
  });

  describe("defaultValue handling", () => {
    it("returns the defaultValue by default (single string)", () => {
      const { result } = renderHook(() =>
        useInternalStringParams("key", "default-value")
      );
      expect(result.current[0]).toEqual(["default-value"]);
      expect(memoryRouter.asPath).toBe("/");
    });

    it("returns the defaultValue by default (array)", () => {
      const { result } = renderHook(() =>
        useInternalStringParams("key", ["default-value"])
      );
      expect(result.current[0]).toEqual(["default-value"]);
      expect(memoryRouter.asPath).toBe("/");
    });

    it("clears the URL when given defaultValue", () => {
      const { result, rerender } = renderHook(() =>
        useInternalStringParams("key", ["default-value"])
      );
      act(() => result.current[1](["value"]));
      rerender();
      act(() => result.current[1](["default-value"]));
      rerender();
      expect(result.current[0]).toEqual(["default-value"]);
      expect(memoryRouter.asPath).toBe("/");
    });
  });
};

export default runSharedTests;
