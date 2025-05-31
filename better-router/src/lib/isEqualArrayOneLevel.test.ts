import assert from "node:assert/strict";
import { describe, it } from "node:test";
import isEqualArrayOneLevel from "./isEqualArrayOneLevel.js";

describe("isArrayEqualOneLevel", () => {
  it("works", () => {
    assert(isEqualArrayOneLevel(undefined, undefined), "undefined");
    assert(!isEqualArrayOneLevel([], undefined), "array, undefined");
    assert(!isEqualArrayOneLevel(undefined, []), "undefined, array");
    assert(isEqualArrayOneLevel([1], [1]), "[1]");
    assert(!isEqualArrayOneLevel([1], []), "mismatch length");
    assert(!isEqualArrayOneLevel([1, 2], [2, 1]), "element order");
  });
});
