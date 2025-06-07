import useInternalStringParams from "./useInternalStringParams.js";
import useStringParamInternal from "../hooks/useStringParamInternal.js";
import arrayify from "../lib/arrayify.js";
import useIntParamInternal from "../hooks/useIntParamInternal.js";
import type Result from "../lib/Result.js";
import useBooleanParamInternal from "../hooks/useBooleanParamInternal.js";
import useStringUnionParamInternal from "../hooks/useStringUnionParamInternal.js";
import useStringArrayParamInternal from "../hooks/useStringArrayParamInternal.js";
import useDateParamInternal, {
  type DateTimeFormat,
} from "../hooks/useDateParamInternal.js";
import useNumberParamInternal from "../hooks/useNumberParamInternal.js";
import useEnumParamInternal, {
  EnumType,
  EnumValueType,
} from "../hooks/useEnumParamInternal.js";

/** @since v1.0.0 */
export function useBooleanParam(key: string): Result<boolean | undefined>;
export function useBooleanParam(
  key: string,
  defaultValue: boolean
): Result<boolean>;
export function useBooleanParam(
  key: string,
  defaultValue?: boolean
): Result<boolean | undefined> | Result<string> {
  const hook = useInternalStringParams(key, arrayify(defaultValue?.toString()));
  return useBooleanParamInternal(hook, defaultValue);
}

/** @since v1.0.0 */
export function useDateParam(
  key: string,
  format?: DateTimeFormat
): Result<Date | undefined> {
  const hook = useInternalStringParams(key, undefined);
  return useDateParamInternal(hook, format);
}

/** @since v1.1.0 */
export function useEnumParam<const T extends EnumType>(
  key: string,
  values: T
): Result<EnumValueType<T> | undefined>;
export function useEnumParam<const T extends EnumType>(
  key: string,
  values: T,
  defaultValue: NoInfer<EnumValueType<T>>
): Result<EnumValueType<T>>;
export function useEnumParam<const T extends EnumType>(
  key: string,
  values: T,
  defaultValue?: NoInfer<EnumValueType<T>>
): Result<EnumValueType<T> | undefined> {
  const hook = useInternalStringParams(key, arrayify(defaultValue?.toString()));
  return useEnumParamInternal(hook, values, defaultValue);
}

/** @since v1.0.0 */
export function useIntParam(key: string): Result<number | undefined>;
export function useIntParam(key: string, defaultValue: number): Result<number>;
export function useIntParam(
  key: string,
  defaultValue?: number
): Result<number | undefined> | Result<number> {
  const hook = useInternalStringParams(key, arrayify(defaultValue?.toString()));
  return useIntParamInternal(hook, defaultValue);
}

/** @since v1.1.0 */
export function useNumberParam(key: string): Result<number | undefined>;
export function useNumberParam(
  key: string,
  defaultValue: number
): Result<number>;
export function useNumberParam(
  key: string,
  defaultValue?: number
): Result<number | undefined> {
  const hook = useInternalStringParams(key, arrayify(defaultValue?.toString()));
  return useNumberParamInternal(hook, defaultValue);
}

/** @since v1.0.0 */
export function useStringArrayParam(key: string): Result<string[] | undefined>;
export function useStringArrayParam(
  key: string,
  defaultValue: string[]
): Result<string[]>;
export function useStringArrayParam(
  key: string,
  defaultValue?: string[]
): Result<string[] | undefined> {
  const hook = useInternalStringParams(key, arrayify(defaultValue?.toString()));
  return useStringArrayParamInternal(hook);
}

/** @since v1.0.0 */
export function useStringParam(key: string): Result<string | undefined>;
export function useStringParam(
  key: string,
  defaultValue: string
): Result<string>;
export function useStringParam(
  key: string,
  defaultValue?: string
): Result<string | undefined> {
  const hook = useInternalStringParams(key, arrayify(defaultValue));
  return useStringParamInternal(hook);
}

/** @since v1.0.0 */
export function useStringUnionParam<T extends string>(
  key: string,
  values: T[]
): Result<T | undefined>;
export function useStringUnionParam<T extends string>(
  key: string,
  values: T[],
  defaultValue: NoInfer<T>
): Result<T>;
export function useStringUnionParam<T extends string>(
  key: string,
  values: T[],
  defaultValue?: NoInfer<T>
): Result<T | undefined> {
  const hook = useInternalStringParams(key, arrayify(defaultValue?.toString()));
  return useStringUnionParamInternal(hook, values, defaultValue);
}

export default {
  useBooleanParam,
  useDateParam,
  useEnumParam,
  useIntParam,
  useNumberParam,
  useStringArrayParam,
  useStringParam,
  useStringUnionParam,
};
