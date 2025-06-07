# Betterouter

This library aims to make [search parameters](https://developer.mozilla.org/en-US/docs/Web/API/URL/search) in [Next.js](https://nextjs.org/) easier to update, and use as a primary state management strategy.

Both [page and app routers](https://nextjs.org/docs#app-router-and-pages-router) are supported.

## Hooks

These hooks work only in client code, and will get live after hydration. For app router apps, the [`'use client'`](https://nextjs.org/docs/app/api-reference/directives/use-client) directive is required, otherwise the hook will not work.

For page router, use the `betterouter/page-router` package to import the hooks. For app router, use the `betterouter/app-router` package. Alternatively, you can import either `AppRouter` or `PageRouter` from `betterouter` and use those as namespaces.

```typescript
import { useStringParam } from "betterouter/page-router";
import { PageRouter } from "betterouter";

// Both uses end up in the same beahvior.
const [str1, setStr1] = useStringParam("str");
const [str2, setStr2] = PageRouter.useStringParam("str");
```

### General Use

The hooks return a React state-like value, with the value and a function to set a new value for the value.

```typescript
const [value, setValue] = useStringParam("key");
// site.com/?key=value ➡️ value === "value"
// site.com/ ➡️ value === undefined
```

The hooks always take the `key` as its first parameter. Most of them take a default value as a parameter as well.

```typescript
const [value, setValue] = useStringParam("key", "fallback");
// site.com/?key=value ➡️ value === "value"
// site.com/ ➡️ value === "fallback"
```

Unlike the normal `React.useState`, you can only set the value directly.

```typescript
const [value, setValue] = useStringParam("key", "fallback");
// ✅ valid: Will navigate to site.com/?key=newValue
setValue("newValue");

// ❌ invalid!
setValue(() => "newValue");

// Since the given value is the same as the default value,
// the key will be removed from the URL: site.com/
setValue("fallback");

// `undefined` will also remove the key from the URL
setValue(undefined);
```

Multiple keys can be set at once, and navigation will happen once the last value has been set.

```typescript
const [value1, setValue1] = useStringParam("key1");
const [value2, setValue2] = useStringParam("key2");

// Clicking this button will navigate to site.com/?key1=foo&key2=bar
return (
  <button
    onClick={() => {
      setValue1("foo");
      setValue2("bar");
    }}
  >
    Click
  </button>
);
```

Most of the hooks operate only on single values. In these cases, if the key is in the url multiple times, the first one will become the value.

```typescript
const [value, setValue] = useStringParam("key");
// site.com/?key=foo&key=bar ➡️ value === 'foo'
```

Whenever the hooks deal with non-primitive values (e.g. `Date` or `string[]`), internally they are used against their JSON representations. In other words, you do not need to memoize non-primitive values in order to avoid unnecessary renders due to the hooks' behavior.

### useBooleanParam

_since v1.0.0_

<!-- prettier-ignore -->
```typescript
function useBooleanParam(key: string): Result<boolean | undefined>;
function useBooleanParam(key: string, defaultValue: boolean): Result<boolean>;
```

Only the literal string values `"true"` and `"false"` (without quotes) are recognized as valid values. If the matching parameter is not one of those, `defaultValue` (or `undefined`) will be returned.

### useDateParam

_since v1.0.0_

<!-- prettier-ignore -->
```typescript
// Default format = "yyyy-MM-ddTHH:mm:ss.SSSZ"
function useDateParam(key: string, format?: DateTimeFormat): Result<Date | undefined>;

type DateFormat = "yyyy" | "yyyy-MM" | "yyyy-MM-dd";
type TimeFormat = "HH:mm" | "HH:mm:ss" | "HH:mm:ss.SSS";
type DateTimeFormat = `${DateFormat | `${DateFormat}T${TimeFormat}`}Z`;
```

If the matching parameter does not encode into a valid `Date` object, `undefined` will be returned.

Note: `useDateParam` does not accept a default value.

### useIntParam

_since v1.0.0_

```typescript
function useIntParam(key: string): Result<number | undefined>;
function useIntParam(key: string, defaultValue: number): Result<number>;
```

If the matching parameter is not a valid base-10 integer, `defaultValue` (or `undefined`) will be returned. If you need support for "any number", see `useNumberParam`.

### useNumberParam

_since v1.1.0_

<!-- prettier-ignore -->
```typescript
function useNumberParam(key: string): Result<number | undefined>;
function useNumberParam(key: string, defaultValue: number): Result<number>;
```

A more lenient version of `useIntParam`. The parameter is parsed with [`parseFloat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat), so the rules of what is valid will follow from there.

### useStringArrayParam

_since v1.0.0_

<!-- prettier-ignore -->
```typescript
function useStringArrayParam(key: string): Result<string[] | undefined>;
function useStringArrayParam(key: string, defaultValue: string[]): Result<string[]>;
```

### useStringParam

_since v1.0.0_

<!-- prettier-ignore -->
```typescript
function useStringParam(key: string): Result<string | undefined>;
function useStringParam(key: string, defaultValue: string): Result<string>;
```

### useStringUnionParam

_since v1.0.0_

<!-- prettier-ignore -->
```typescript
function useStringUnionParam<T extends string>(key: string, values: T[]): Result<T | undefined>;
function useStringUnionParam<T extends string>(key: string, values: T[], defaultValue: NoInfer<T>): Result<T>;
```

If the matching parameter is not present in `values`, then `defaultValue` (or `undefined`) will be returned.
