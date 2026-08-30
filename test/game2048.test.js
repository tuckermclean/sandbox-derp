const { test } = require('node:test');
const assert = require('node:assert');

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

test('move([[2,2,0,0],[0,0,0,0],[0,0,0,0],[4,0,0,4]], \'left\') returns merged board', () => {
  assert.deepEqual(
    move([[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 4]], 'left'),
    [[4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [8, 0, 0, 0]]
  );
});

test('move \'right\' slides each row toward index 3', () => {
  assert.deepEqual(
    move([[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 4]], 'right'),
    [[0, 0, 0, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 8]]
  );
});

test('move \'up\' slides each column toward index 0', () => {
  assert.deepEqual(
    move([[2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'up'),
    [[4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  );
});

test('move \'down\' slides each column toward index 3', () => {
  assert.deepEqual(
    move([[2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'down'),
    [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0]]
  );
});

test('move returns a new board and does not mutate the input', () => {
  const board = [[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 4]];
  const snapshot = board.map((row) => row.slice());
  const result = move(board, 'left');

  assert.notStrictEqual(result, board);
  result.forEach((row, i) => assert.notStrictEqual(row, board[i]));
  assert.deepEqual(board, snapshot);
});

test('slide returns a new array and does not mutate the input', () => {
  const row = [2, 2, 4, 4];
  const result = slide(row);

  assert.notStrictEqual(result, row);
  assert.deepEqual(row, [2, 2, 4, 4]);
});

test('slide always returns a length-4 array', () => {
  assert.strictEqual(slide([2, 2, 4, 4]).length, 4);
  assert.strictEqual(slide([0, 0, 0, 0]).length, 4);
});
