import { useMemo } from "react";
import arrayify from "../lib/arrayify.js";
import type Result from "../lib/Result.js";
import type { InternalHookResult } from "../app-router/useInternalStringParams.js";

const useNumberParamInternal = (
  hook: InternalHookResult,
  defaultValue?: number
) => {
  const [val, setVal] = hook;
  const strValue = val?.at(0);
  return useMemo<Result<number | undefined>>(
    () => [
      strValue ? parseFloat(strValue) : defaultValue,
      (value) => setVal(arrayify(value?.toString())),
    ],
    [strValue, defaultValue, setVal]
  );
};

export default useNumberParamInternal;
