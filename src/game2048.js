'use strict';

const SIZE = 4;

function slide(row) {
  const values = row.filter((v) => v !== 0);
  const merged = [];
  for (let i = 0; i < values.length; i++) {
    if (i + 1 < values.length && values[i] === values[i + 1]) {
      merged.push(values[i] * 2);
      i++;
    } else {
      merged.push(values[i]);
    }
  }
  while (merged.length < SIZE) {
    merged.push(0);
  }
  return merged;
}

function move(board, dir) {
  const result = Array.from({ length: SIZE }, () => new Array(SIZE).fill(0));

  if (dir === 'left') {
    for (let r = 0; r < SIZE; r++) {
      result[r] = slide(board[r]);
    }
  } else if (dir === 'right') {
    for (let r = 0; r < SIZE; r++) {
      result[r] = slide([...board[r]].reverse()).reverse();
    }
  } else if (dir === 'up') {
    for (let c = 0; c < SIZE; c++) {
      const col = [];
      for (let r = 0; r < SIZE; r++) col.push(board[r][c]);
      const slid = slide(col);
      for (let r = 0; r < SIZE; r++) result[r][c] = slid[r];
    }
  } else if (dir === 'down') {
    for (let c = 0; c < SIZE; c++) {
      const col = [];
      for (let r = SIZE - 1; r >= 0; r--) col.push(board[r][c]);
      const slid = slide(col);
      for (let r = SIZE - 1, i = 0; r >= 0; r--, i++) result[r][c] = slid[i];
    }
  }

  return result;
}

module.exports = { slide, move };
