'use strict';

const LENGTH_TO_M = { m: 1, km: 1000, cm: 0.01, ft: 0.3048 };
const LENGTH_UNITS = new Set(Object.keys(LENGTH_TO_M));
const TEMP_UNITS = new Set(['C', 'F']);

function toCelsius(value, from) {
  return from === 'F' ? ((value - 32) * 5) / 9 : value;
}

function fromCelsius(value, to) {
  return to === 'F' ? (value * 9) / 5 + 32 : value;
}

function convert(value, from, to) {
  if (LENGTH_UNITS.has(from) && LENGTH_UNITS.has(to)) {
    return (value * LENGTH_TO_M[from]) / LENGTH_TO_M[to];
  }
  if (TEMP_UNITS.has(from) && TEMP_UNITS.has(to)) {
    return fromCelsius(toCelsius(value, from), to);
  }
  return null;
}

module.exports = { convert };
