import { useMemo } from "react";
import type Result from "../lib/Result.js";
import type { InternalHookResult } from "../app-router/useInternalStringParams.js";

export const useStringArrayParamInternal = (hook: InternalHookResult) => {
  const [val, setVal] = hook;

  return useMemo<Result<string[] | undefined>>(
    () => {
      const value =
        !val || val.length === 0
          ? undefined
          : val.length === 1 && val[0] === ""
          ? []
          : val;

      return [
        value,
        (val) => {
          if (val?.length === 0) val = [""];
          return setVal(val);
        },
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setVal, JSON.stringify(val)]
  );
};

export default useStringArrayParamInternal;
