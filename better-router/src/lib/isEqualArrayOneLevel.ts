const isEqualArrayOneLevel = (
  a: unknown[] | undefined,
  b: unknown[] | undefined
): boolean => {
  if (a === b) return true;
  if (!!a !== !!b || a?.length !== b?.length) return false;
  for (let i = 0; i < a!.length; i++) if (a![i] !== b![i]) return false;
  return true;
};

export default isEqualArrayOneLevel;
