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
  let value = strValue ? parseInt(strValue, 10) : undefined;
  value =
    typeof value !== "undefined" && isFinite(value) ? value : defaultValue;

  return useMemo<Result<number | undefined>>(
    () => [value, (value) => setVal(arrayify(value?.toString()))],
    [value, setVal]
  );
};

export default useIntParamInternal;
