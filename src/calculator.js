'use strict';

function applyOperation(a, operator, b) {
  if (operator === '/' && b === 0) {
    return null;
  }
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      return null;
  }
}

function applyPercent(base, percent) {
  return (base * percent) / 100;
}

function memoryReducer(memValue, action, current) {
  switch (action) {
    case 'MC':
      return 0;
    case 'MR':
      return memValue;
    case 'M+':
      return memValue + current;
    case 'M-':
      return memValue - current;
    default:
      return memValue;
  }
}

function pushHistory(history, entry, limit) {
  return history.concat(entry).slice(-limit);
}

module.exports = {
  applyOperation,
  applyPercent,
  memoryReducer,
  pushHistory,
};
