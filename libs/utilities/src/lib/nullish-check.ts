export function isNonNullish<T>(item: T): item is NonNullable<T> {
  return item !== null && item !== undefined;
}

type Nullable<T> = T extends null | undefined ? T : never;

export function isNullish<T>(item: T): item is Nullable<T> {
  return item === null || item === undefined;
}
