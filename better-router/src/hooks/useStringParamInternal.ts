import { useMemo } from "react";
import arrayify from "../lib/arrayify.js";
import type Result from "../lib/Result.js";
import type { InternalHookResult } from "../app-router/useInternalStringParams.js";

const useStringParamInternal = (hook: InternalHookResult) => {
  const [val, setVal] = hook;
  const value = val?.at(0);
  return useMemo<Result<string | undefined>>(
    () => [value, (str) => setVal(arrayify(str))],
    [setVal, value]
  );
};

export default useStringParamInternal;
