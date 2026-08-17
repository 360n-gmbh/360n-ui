import assert from "node:assert/strict";
import test from "node:test";
import {
  allocateSquareMatrixCells,
  nextSquareMatrixIndex,
  normalizeSquareMatrixValues,
} from "../src/lib/square-matrix.ts";

test("normalisiert Null- und nicht endliche Werte ohne leere Division", () => {
  assert.deepEqual(
    normalizeSquareMatrixValues([0, Number.NaN, Number.POSITIVE_INFINITY], 10),
    [0, 0, 0],
  );
});

test("normalisiert gegen eine feste Domäne", () => {
  assert.deepEqual(normalizeSquareMatrixValues([0, 5, 10, 20], 10, [0, 10]), [0, 5, 10, 10]);
});

test("verteilt Segmente immer auf exakt 100 Zellen", () => {
  const allocation = allocateSquareMatrixCells([1, 1, 1], 100);
  assert.deepEqual(allocation, [34, 33, 33]);
  assert.equal(
    allocation.reduce((sum, count) => sum + count, 0),
    100,
  );
});

test("ignoriert negative und nicht endliche Segmentwerte", () => {
  assert.deepEqual(allocateSquareMatrixCells([-2, Number.NaN, 8], 100), [0, 0, 100]);
  assert.deepEqual(allocateSquareMatrixCells([0, 0], 100), [0, 0]);
});

test("berechnet begrenzte Pfeil-, Home- und End-Navigation", () => {
  assert.equal(nextSquareMatrixIndex("ArrowRight", 1, 4), 2);
  assert.equal(nextSquareMatrixIndex("ArrowLeft", 0, 4), 0);
  assert.equal(nextSquareMatrixIndex("ArrowDown", 3, 4), 3);
  assert.equal(nextSquareMatrixIndex("Home", 3, 4), 0);
  assert.equal(nextSquareMatrixIndex("End", 0, 4), 3);
  assert.equal(nextSquareMatrixIndex("Enter", 0, 4), null);
});
