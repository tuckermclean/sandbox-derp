const { test } = require('node:test');
const assert = require('node:assert');

const { applyOperation } = require('../src/calc.js');

test('applyOperation multiplies', () => {
  assert.strictEqual(applyOperation(6, '*', 7), 42);
});

test('applyOperation returns null when dividing by zero', () => {
  assert.strictEqual(applyOperation(5, '/', 0), null);
});

test('applyOperation adds', () => {
  assert.strictEqual(applyOperation(2, '+', 3), 5);
});

test('applyOperation subtracts', () => {
  assert.strictEqual(applyOperation(9, '-', 4), 5);
});

test('applyOperation divides', () => {
  assert.strictEqual(applyOperation(10, '/', 2), 5);
});
