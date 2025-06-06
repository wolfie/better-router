type Arrayfied<T> = T extends undefined
  ? undefined
  : T extends null
  ? null
  : T extends unknown[]
  ? T
  : [T];

const arrayify = <T>(val: T): Arrayfied<T> =>
  (typeof val === "undefined" || val === null || Array.isArray(val)
    ? val
    : [val]) as Arrayfied<T>;

export default arrayify;
