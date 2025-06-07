/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, beforeEach, expect } from "vitest";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime.js";
import { memoryRouter } from "next-router-mock";
import { renderHook } from "@testing-library/react";
import { useEnumParam } from "../page-router/index.js";

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

enum SimpleEnum {
  FOO,
  BAR,
}

enum DefinedNumberEnum {
  FOO = 1,
  BAR = 2,
}

enum DefinedStringEnum {
  FOO = "Foo",
  BAR = "Bar",
}

describe("useEnumParamInternal", () => {
  beforeEach(() => {
    memoryRouter.setCurrentUrl("/");
  });

  it("works for simple enums", () => {
    const { result, rerender } = renderHook(
      () => useEnumParam("key", SimpleEnum),
      { wrapper }
    );

    result.current[1](SimpleEnum.FOO);
    rerender();
    expect(result.current[0]).toBe(SimpleEnum.FOO);
    expect(memoryRouter.asPath).toBe("/?key=0");
  });

  it("works for number enums", () => {
    const { result, rerender } = renderHook(
      () => useEnumParam("key", DefinedNumberEnum),
      { wrapper }
    );

    result.current[1](DefinedNumberEnum.FOO);
    rerender();
    expect(result.current[0]).toBe(DefinedNumberEnum.FOO);
    expect(memoryRouter.asPath).toBe("/?key=1");
  });

  it("works for string enums", () => {
    const { result, rerender } = renderHook(
      () => useEnumParam("key", DefinedStringEnum),
      { wrapper }
    );

    result.current[1](DefinedStringEnum.FOO);
    rerender();
    expect(result.current[0]).toBe(DefinedStringEnum.FOO);
    expect(memoryRouter.asPath).toBe("/?key=Foo");
  });

  it("returns undefined on invalid values (simple enum)", () => {
    const { result, rerender } = renderHook(
      () => useEnumParam("key", SimpleEnum),
      { wrapper }
    );

    result.current[1](2 as any);
    rerender();
    expect(result.current[0]).toBeUndefined();
  });

  it("returns undefined on invalid values (numeric enum)", () => {
    const { result, rerender } = renderHook(
      () => useEnumParam("key", DefinedNumberEnum),
      { wrapper }
    );

    result.current[1](3 as any);
    rerender();
    expect(result.current[0]).toBeUndefined();
  });

  it("returns undefined on invalid values (string enum)", () => {
    const { result, rerender } = renderHook(
      () => useEnumParam("key", DefinedStringEnum),
      { wrapper }
    );

    result.current[1]("INVALID" as any);
    rerender();
    expect(result.current[0]).toBeUndefined();
  });
});
