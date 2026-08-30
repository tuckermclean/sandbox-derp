'use strict';

function slide(row) {
  const nz = row.filter((v) => v !== 0);
  const out = [];
  for (let i = 0; i < nz.length; i++) {
    if (i + 1 < nz.length && nz[i] === nz[i + 1]) {
      out.push(nz[i] * 2);
      i++;
    } else {
      out.push(nz[i]);
    }
  }
  while (out.length < 4) out.push(0);
  return out;
}

function clone(board) {
  return board.map((row) => row.slice());
}

function move(board, dir) {
  let work = clone(board);
  const n = 4;

  const transformRow = (row) => slide(row.slice());

  switch (dir) {
    case 'left':
      work = work.map(transformRow);
      break;
    case 'right':
      work = work.map((row) => transformRow(row.slice().reverse()).reverse());
      break;
    case 'up':
      work = clone(board);
      for (let c = 0; c < n; c++) {
        const col = [];
        for (let r = 0; r < n; r++) col.push(board[r][c]);
        const slid = slide(col);
        for (let r = 0; r < n; r++) work[r][c] = slid[r];
      }
      break;
    case 'down':
      work = clone(board);
      for (let c = 0; c < n; c++) {
        const col = [];
        for (let r = n - 1; r >= 0; r--) col.push(board[r][c]);
        const slid = slide(col);
        for (let r = 0; r < n; r++) work[n - 1 - r][c] = slid[r];
      }
      break;
    default:
      throw new Error('unknown direction: ' + dir);
  }

  return work;
}

module.exports = { slide, move };
