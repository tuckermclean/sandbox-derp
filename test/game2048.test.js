const { test } = require('node:test');
const assert = require('node:assert/strict');

const { slide, move } = require('../src/game2048.js');

test('slide([2,2,4,4]) returns [4,8,0,0]', () => {
  assert.deepEqual(slide([2, 2, 4, 4]), [4, 8, 0, 0]);
});

test('slide([2,2,2,2]) returns [4,4,0,0]', () => {
  assert.deepEqual(slide([2, 2, 2, 2]), [4, 4, 0, 0]);
});

test('slide([2,2,2,0]) returns [4,2,0,0]', () => {
  assert.deepEqual(slide([2, 2, 2, 0]), [4, 2, 0, 0]);
});

test('slide([2,4,0,0]) returns [2,4,0,0] (no merge)', () => {
  assert.deepEqual(slide([2, 4, 0, 0]), [2, 4, 0, 0]);
});

test('slide returns a new array and does not mutate its argument', () => {
  const row = [2, 2, 4, 0];
  const result = slide(row);
  assert.notStrictEqual(result, row);
  assert.deepEqual(row, [2, 2, 4, 0]);
});

test("move(board, 'left') slides and merges each row", () => {
  const board = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 4],
  ];
  const expected = [
    [4, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [8, 0, 0, 0],
  ];
  assert.deepEqual(move(board, 'left'), expected);
});

test("move(board, 'right') slides and merges each row toward index 3", () => {
  const board = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 4],
  ];
  const expected = [
    [0, 0, 0, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 8],
  ];
  assert.deepEqual(move(board, 'right'), expected);
});

test("move(board, 'up') slides and merges each column toward index 0", () => {
  const board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0],
  ];
  const expected = [
    [4, 0, 0, 0],
    [8, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  assert.deepEqual(move(board, 'up'), expected);
});

test("move(board, 'down') slides and merges each column toward index 3", () => {
  const board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0],
  ];
  const expected = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 0],
    [8, 0, 0, 0],
  ];
  assert.deepEqual(move(board, 'down'), expected);
});

test('move returns a new board and does not mutate its argument', () => {
  const board = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 4],
  ];
  const snapshot = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 4],
  ];
  const result = move(board, 'left');
  assert.notStrictEqual(result, board);
  assert.deepEqual(board, snapshot);
});
