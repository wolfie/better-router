import { useMemo } from "react";
import arrayify from "../lib/arrayify.js";
import type Result from "../lib/Result.js";
import type { InternalHookResult } from "../app-router/useInternalStringParams.js";

const INT_REGEX = /^-?[\d]+$/;

const useIntParamInternal = (
  hook: InternalHookResult,
  defaultValue?: number
) => {
  const [val, setVal] = hook;
  const strValue = val?.at(0);

  return useMemo<Result<number | undefined>>(() => {
    const value =
      strValue && INT_REGEX.test(strValue)
        ? parseInt(strValue, 10)
        : defaultValue;

    const setValue = (value: number | undefined) => {
      let strValue = value?.toString();
      if (strValue && !INT_REGEX.test(strValue)) strValue = undefined;
      return setVal(arrayify(strValue));
    };

    return [value, setValue];
  }, [strValue, defaultValue, setVal]);
};

export default useIntParamInternal;
