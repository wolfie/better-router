export type Result<T> = [value: T, setValue: (value: T | undefined) => void];

export default Result;
