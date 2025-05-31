import { useRouter } from "next/router.js";
import isEqualArrayOneLevel from "../lib/isEqualArrayOneLevel.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import type Result from "../lib/Result.js";
import arrayify from "../lib/arrayify.js";

type OnChangeHandle = () => void;
const SHARED_STATE_LISTENERS = new Set<OnChangeHandle>();
const QUERY_DIFF_QUEUE: Array<[key: string, value: string[] | undefined]> = [];

const useInternalStringParams = (
  key: string,
  defaultValue?: string | string[]
): Result<string[] | undefined> => {
  const router = useRouter();
  // https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only
  const [isClient, setIsClient] = useState(false);
  const [rerenderTrigger, setRerenderTrigger] = useState(Symbol());

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(
    () => {
      if (QUERY_DIFF_QUEUE.length === 0) return;

      const query = { ...router.query };
      QUERY_DIFF_QUEUE.forEach(([key, value]) => {
        if (typeof value === "undefined") delete query[key];
        else query[key] = value;
      });
      QUERY_DIFF_QUEUE.splice(0, QUERY_DIFF_QUEUE.length);

      router.push({ pathname: router.pathname, query });
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

  const search = new URLSearchParams(
    isClient ? globalThis?.location?.search ?? "" : ""
  );
  const values = search.has(key) ? search.getAll(key) : arrayify(defaultValue);
  const value = useMemo(
    () => values,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(values)]
  );

  const setValue = useCallback(
    (v: string[] | undefined) => {
      QUERY_DIFF_QUEUE.push([
        key,
        v && !isEqualArrayOneLevel(v, arrayify(defaultValue)) ? v : undefined,
      ]);
      SHARED_STATE_LISTENERS.forEach((triggerRendered) => triggerRendered());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(defaultValue), key]
  );

  return useMemo(() => [value, setValue], [setValue, value]);
};

export default useInternalStringParams;
