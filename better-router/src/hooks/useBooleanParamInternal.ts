import { useMemo } from "react";
import type Result from "../lib/Result.js";
import type { InternalHookResult } from "../app-router/useInternalStringParams.js";

const toBool = (x: string | undefined) =>
  x === "true" ? true : x === "false" ? false : undefined;

const useBooleanParamInternal = (
  hook: InternalHookResult,
  defaultValue?: boolean
) => {
  const [val, setVal] = hook;
  const value = toBool(val?.at(0)) ?? defaultValue;
  return useMemo<Result<boolean | undefined>>(
    () => [
      value,
      (val) => setVal(typeof val !== "undefined" ? [String(val)] : undefined),
    ],
    [setVal, value]
  );
};

export default useBooleanParamInternal;
