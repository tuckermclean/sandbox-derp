function applyOperation(a, operator, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? null : a / b;
    default:
      return null;
  }
}

function applyPercent(base, percent) {
  return base * percent / 100;
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
  if (limit <= 0) return [];
  return history.concat(entry).slice(-limit);
}

module.exports = {
  applyOperation,
  applyPercent,
  memoryReducer,
  pushHistory,
};
