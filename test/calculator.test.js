const { test } = require('node:test');
const assert = require('node:assert');

const {
  applyOperation,
  applyPercent,
  memoryReducer,
  pushHistory,
} = require('../src/calculator.js');

test('applyOperation(2, "+", 3) returns 5', () => {
  assert.strictEqual(applyOperation(2, '+', 3), 5);
});

test('applyOperation(20, "/", 5) returns 4', () => {
  assert.strictEqual(applyOperation(20, '/', 5), 4);
});

test('applyOperation(5, "/", 0) returns null (division-by-zero guard)', () => {
  assert.strictEqual(applyOperation(5, '/', 0), null);
});

test('applyOperation subtracts and multiplies', () => {
  assert.strictEqual(applyOperation(10, '-', 4), 6);
  assert.strictEqual(applyOperation(3, '*', 4), 12);
});

test('applyOperation does not mutate its arguments', () => {
  const a = 2;
  const b = 3;
  applyOperation(a, '+', b);
  assert.strictEqual(a, 2);
  assert.strictEqual(b, 3);
});

test('applyPercent(200, 10) returns 20', () => {
  assert.strictEqual(applyPercent(200, 10), 20);
});

test('memoryReducer(0, "M+", 5) returns 5 and memoryReducer(5, "M-", 2) returns 3', () => {
  assert.strictEqual(memoryReducer(0, 'M+', 5), 5);
  assert.strictEqual(memoryReducer(5, 'M-', 2), 3);
});

test('memoryReducer(7, "MC", 0) returns 0 and memoryReducer(7, "MR", 0) returns 7', () => {
  assert.strictEqual(memoryReducer(7, 'MC', 0), 0);
  assert.strictEqual(memoryReducer(7, 'MR', 0), 7);
});

test('memoryReducer does not mutate its arguments', () => {
  const current = 5;
  memoryReducer(0, 'M+', current);
  assert.strictEqual(current, 5);
});

test('pushHistory([], "2+3=5", 10) returns ["2+3=5"]', () => {
  assert.deepEqual(pushHistory([], '2+3=5', 10), ['2+3=5']);
});

test('pushHistory(["a","b","c"], "d", 3) returns ["b","c","d"] (capped, oldest dropped)', () => {
  assert.deepEqual(pushHistory(['a', 'b', 'c'], 'd', 3), ['b', 'c', 'd']);
});

test('pushHistory returns a new array and does not mutate the input', () => {
  const history = ['a', 'b', 'c'];
  const result = pushHistory(history, 'd', 3);
  assert.deepEqual(history, ['a', 'b', 'c']);
  assert.notStrictEqual(result, history);
});

test('pushHistory with empty history and limit 0 returns []', () => {
  assert.deepEqual(pushHistory([], 'anything', 0), []);
});
