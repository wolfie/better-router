import { useMemo } from "react";
import arrayify from "../lib/arrayify.js";
import type Result from "../lib/Result.js";

type DateFormat = "yyyy" | "yyyy-MM" | "yyyy-MM-dd";
type TimeFormat = "HH:mm" | "HH:mm:ss" | "HH:mm:ss.SSS";
export type DateTimeFormat = `${DateFormat | `${DateFormat}T${TimeFormat}`}Z`;

const splitDateString = (
  str: string
): { year: number; month: number; day: number } => {
  const [yearStr, monthStr, dayStr] = str.split("-", 3);
  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10),
    day: dayStr ? parseInt(dayStr, 10) : 1,
  };
};

const splitTimeString = (
  str: string
): { hours: number; minutes: number; seconds: number; millis: number } => {
  const [hoursStr, minutesStr, secondsFullStr] = str.split(":", 3);
  const [secondsStr, millisStr] = (secondsFullStr ?? "").split(".", 2);
  return {
    hours: parseInt(hoursStr, 10),
    minutes: minutesStr ? parseInt(minutesStr, 10) : 0,
    seconds: secondsStr ? parseInt(secondsStr, 10) : 0,
    millis: millisStr ? parseInt(millisStr, 10) : 0,
  };
};

const splitDateTimeString = (str: string) => {
  str = str.slice(0, str.length - 1); // strip 'Z'
  if (str.includes("T")) {
    const [date, time] = str.split("T", 2);
    return {
      ...splitDateString(date),
      ...splitTimeString(time),
    };
  } else {
    return {
      ...splitDateString(str),
      hours: 0,
      minutes: 0,
      seconds: 0,
      millis: 0,
    };
  }
};

const parseStringToDate = (str: string | undefined): Date | undefined => {
  if (!str) return undefined;
  const { year, month, day, hours, minutes, seconds, millis } =
    splitDateTimeString(str);
  const date = new Date("0000-01-01T00:00:00.000Z");
  date.setUTCFullYear(year);
  date.setUTCMonth(month - 1);
  date.setUTCDate(day);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(seconds);
  date.setUTCMilliseconds(millis);
  return isNaN(date.getTime()) ? undefined : date;
};

const formatDateToString = (
  date: Date,
  format: DateTimeFormat
): string | undefined => {
  if (Number.isNaN(date.getTime())) return undefined;

  return format
    .replace("yyyy", date.getUTCFullYear().toString())
    .replace("MM", (date.getUTCMonth() + 1).toString().padStart(2, "0"))
    .replace("dd", date.getUTCDate().toString().padStart(2, "0"))
    .replace("HH", date.getUTCHours().toString().padStart(2, "0"))
    .replace("mm", date.getUTCMinutes().toString().padStart(2, "0"))
    .replace("ss", date.getUTCSeconds().toString().padStart(2, "0"))
    .replace("SSS", date.getUTCMilliseconds().toString().padStart(3, "0"));
};

const useDateParamInternal = (
  hook: Result<string[] | undefined>,
  format: DateTimeFormat = "yyyy-MM-ddTHH:mm:ss.SSSZ"
): Result<Date | undefined> => {
  const [val, setVal] = hook;
  const strValue = val?.at(0);

  return useMemo<Result<Date | undefined>>(
    () => [
      parseStringToDate(strValue), // value ignores format (...for now)
      (value) => setVal(arrayify(value && formatDateToString(value, format))),
    ],
    [format, setVal, strValue]
  );
};

new Date().toISOString();

export default useDateParamInternal;
