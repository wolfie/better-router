import { describe, it } from "vitest";
import isEqualRecordOneLevel from "./isEqualRecordOneLevel.js";
import assert from "node:assert";

describe("isEqualRecordOneLevel", () => {
  it("works", () => {
    assert(isEqualRecordOneLevel(undefined, undefined), "undefined");
    assert(!isEqualRecordOneLevel({}, undefined), "record, undefined");
    assert(!isEqualRecordOneLevel(undefined, {}), "undefined, record");
    assert(isEqualRecordOneLevel({}, {}), "empty record");
    assert(isEqualRecordOneLevel({ a: 1 }, { a: 1 }), "minimal");
    assert(!isEqualRecordOneLevel({ a: 1 }, { a: "1" }), "mismatched value");
    assert(
      isEqualRecordOneLevel({ a: 1, b: 1 }, { b: 1, a: 1 }),
      "key order shouldn't matter"
    );
  });
});
