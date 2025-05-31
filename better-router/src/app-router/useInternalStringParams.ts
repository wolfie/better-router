"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation.js";
import isEqualArrayOneLevel from "../lib/isEqualArrayOneLevel.js";
import type Result from "../lib/Result.js";

type OnChangeHandle = () => void;
const SHARED_STATE_LISTENERS = new Set<OnChangeHandle>();
const QUERY_DIFF_QUEUE: Array<[key: string, value: string[] | undefined]> = [];

export type InternalHookResult = Result<string[] | undefined>;

const useInternalStringParams = (
  key: string,
  defaultValue?: string[] // TODO decide if this should be string[]|string, to avoid calling `arrayify` everywhere
): Result<string[] | undefined> => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [rerenderTrigger, setRerenderTrigger] = useState(Symbol());

  useEffect(
    () => {
      if (QUERY_DIFF_QUEUE.length === 0) return;

      const query = new URLSearchParams(searchParams.toString());
      QUERY_DIFF_QUEUE.forEach(([key, value]) => {
        if (!value) {
          query.delete(key);
        } else {
          const [first, ...rest] = value;
          query.set(key, first);
          rest.forEach((v) => query.append(key, v));
        }
      });
      QUERY_DIFF_QUEUE.splice(0, QUERY_DIFF_QUEUE.length);

      let searchParamsString = query.toString();
      if (searchParamsString) searchParamsString = "?" + searchParamsString;
      router.push(pathname + searchParamsString);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ignore router dependency
    [rerenderTrigger]
  );

  useEffect(() => {
    const triggerRerender: OnChangeHandle = () => setRerenderTrigger(Symbol());
    SHARED_STATE_LISTENERS.add(triggerRerender);
    return () => {
      SHARED_STATE_LISTENERS.delete(triggerRerender);
    };
  }, []);

  const value = searchParams.getAll(key) ?? defaultValue;

  const setValue = useCallback(
    (v: string[] | undefined) => {
      QUERY_DIFF_QUEUE.push([
        key,
        v && !isEqualArrayOneLevel(v, defaultValue) ? v : undefined,
      ]);
      SHARED_STATE_LISTENERS.forEach((rerender) => rerender());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, JSON.stringify(defaultValue)]
  );

  return useMemo(() => [value, setValue], [value, setValue]);
};

export default useInternalStringParams;
