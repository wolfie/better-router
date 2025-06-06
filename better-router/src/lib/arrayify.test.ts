import assert from "node:assert";
import { describe, it } from "vitest";
import arrayify from "./arrayify.js";

describe("arrayify", () => {
  it("works", () => {
    assert.equal(arrayify(undefined), undefined);
    assert.equal(arrayify(null), null);
    assert.deepEqual(arrayify(1), [1]);
    assert.deepEqual(arrayify([1]), [1]);
    assert.deepEqual(arrayify([]), []);
  });
});
