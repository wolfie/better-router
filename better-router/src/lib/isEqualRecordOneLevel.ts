const isEqualRecordOneLevel = (
  a?: Record<string, unknown>,
  b?: Record<string, unknown>
): boolean => {
  if (!a && !b) return true;
  if (!!a !== !!b) return false;

  const aKeys = new Set(Object.keys(a!));
  const bKeys = new Set(Object.keys(b!));
  if (aKeys.difference(bKeys).size > 0) return false;
  for (const key of aKeys) if (a![key] !== b![key]) return false;

  return true;
};

export default isEqualRecordOneLevel;
