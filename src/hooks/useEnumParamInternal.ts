import { useMemo } from "react";
import arrayify from "../lib/arrayify.js";
import type Result from "../lib/Result.js";
import type { InternalHookResult } from "../app-router/useInternalStringParams.js";

export type EnumType = Record<string, string | number>;
export type EnumValueType<T extends EnumType> = T[keyof T];

const useEnumParamInternal = <const T extends EnumType>(
  hook: InternalHookResult,
  values: T,
  defaultValue?: NoInfer<EnumValueType<T>>
): Result<EnumValueType<T> | undefined> => {
  const [val, setVal] = hook;
  const strValue = val?.at(0);

  const value = useMemo(
    () => {
      let value: EnumValueType<T> | undefined = undefined;
      if (typeof strValue !== "undefined") {
        value = Object.values(values).find(
          (x): x is EnumValueType<T> =>
            x === strValue || x === parseInt(strValue, 10)
        );
      }

      return value ?? defaultValue;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValue, strValue, JSON.stringify(values)]
  );

  return useMemo<Result<EnumValueType<T> | undefined>>(() => {
    return [value, (newValue) => setVal(arrayify(newValue?.toString()))];
  }, [value, setVal]);
};

export default useEnumParamInternal;
