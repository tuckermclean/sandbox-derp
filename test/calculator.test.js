const { test } = require('node:test');
const assert = require('node:assert');

const {
  applyOperation,
  applyPercent,
  memoryReducer,
  pushHistory,
} = require('../src/calculator.js');

test('applyOperation adds two numbers', () => {
  assert.strictEqual(applyOperation(2, '+', 3), 5);
});

test('applyOperation subtracts two numbers', () => {
  assert.strictEqual(applyOperation(10, '-', 4), 6);
});

test('applyOperation multiplies two numbers', () => {
  assert.strictEqual(applyOperation(6, '*', 7), 42);
});

test('applyOperation divides two numbers', () => {
  assert.strictEqual(applyOperation(20, '/', 5), 4);
});

test('applyOperation returns null on division by zero', () => {
  assert.strictEqual(applyOperation(5, '/', 0), null);
});

test('applyPercent returns base * percent / 100', () => {
  assert.strictEqual(applyPercent(200, 10), 20);
});

test('memoryReducer M+ adds current to memory', () => {
  assert.strictEqual(memoryReducer(0, 'M+', 5), 5);
});

test('memoryReducer M- subtracts current from memory', () => {
  assert.strictEqual(memoryReducer(5, 'M-', 2), 3);
});

test('memoryReducer MC clears memory', () => {
  assert.strictEqual(memoryReducer(7, 'MC', 0), 0);
});

test('memoryReducer MR leaves memory unchanged', () => {
  assert.strictEqual(memoryReducer(7, 'MR', 0), 7);
});

test('pushHistory appends to an empty history', () => {
  assert.deepEqual(pushHistory([], '2+3=5', 10), ['2+3=5']);
});

test('pushHistory caps history and drops the oldest entry', () => {
  assert.deepEqual(pushHistory(['a', 'b', 'c'], 'd', 3), ['b', 'c', 'd']);
});

test('pushHistory returns a new array without mutating its input', () => {
  const history = ['a', 'b', 'c'];
  const result = pushHistory(history, 'd', 3);
  assert.deepEqual(history, ['a', 'b', 'c']);
  assert.notStrictEqual(result, history);
});

test('memoryReducer does not mutate its arguments', () => {
  const current = 5;
  memoryReducer(0, 'M+', current);
  assert.strictEqual(current, 5);
});
