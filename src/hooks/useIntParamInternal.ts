import { useMemo } from "react";
import arrayify from "../lib/arrayify.js";
import type Result from "../lib/Result.js";
import type { InternalHookResult } from "../app-router/useInternalStringParams.js";

const useIntParamInternal = (
  hook: InternalHookResult,
  defaultValue?: number
) => {
  const [val, setVal] = hook;
  const strValue = val?.at(0);

  return useMemo<Result<number | undefined>>(() => {
    const value =
      strValue && /^-?[\d]+$/.test(strValue)
        ? parseInt(strValue, 10)
        : defaultValue;

    const setValue = (value: number | undefined) =>
      setVal(arrayify(value?.toString()));

    return [value, setValue];
  }, [strValue, defaultValue, setVal]);
};

export default useIntParamInternal;
