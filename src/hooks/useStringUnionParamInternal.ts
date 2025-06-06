import { useMemo } from "react";
import arrayify from "../lib/arrayify.js";
import type Result from "../lib/Result.js";

export const useStringUnionParamInternal = <const T extends string>(
  hook: Result<string[] | undefined>,
  values: T[],
  defaultValue?: NoInfer<T>
) => {
  const [val, setVal] = hook;
  const value =
    typeof val !== "undefined" && values.includes(val[0] as T)
      ? (val[0] as T)
      : defaultValue;
  return useMemo<Result<T | undefined>>(
    () => [value, (str) => setVal(arrayify(values.find((x) => x === str)))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setVal, value, JSON.stringify(values)]
  );
};

export default useStringUnionParamInternal;
