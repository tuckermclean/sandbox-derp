const { test } = require('node:test');
const assert = require('node:assert/strict');

const { cube } = require('../src/math.js');

test('cube(3) returns 27', () => {
  assert.strictEqual(cube(3), 27);
});

test('cube(0) returns 0', () => {
  assert.strictEqual(cube(0), 0);
});

test('cube(-2) returns -8', () => {
  assert.strictEqual(cube(-2), -8);
});
