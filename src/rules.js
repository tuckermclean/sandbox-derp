'use strict';

const { registerRule } = require('./validate.js');

registerRule('required', (value, arg) => {
  if (typeof arg !== 'boolean') {
    throw new Error('required: arg must be a boolean');
  }
  if (!arg) {
    return true;
  }
  if (value === undefined || value === null) {
    return 'value is required';
  }
  return true;
});

registerRule('type', (value, arg) => {
  const allowed = ['string', 'number', 'boolean', 'array', 'object'];
  if (!allowed.includes(arg)) {
    throw new Error(`type: arg must be one of ${allowed.join(', ')}`);
  }
  let matches;
  if (arg === 'array') {
    matches = Array.isArray(value);
  } else if (arg === 'object') {
    matches = value !== null && typeof value === 'object' && !Array.isArray(value);
  } else {
    matches = typeof value === arg;
  }
  if (matches) {
    return true;
  }
  return `expected type ${arg}`;
});

registerRule('minLength', (value, arg) => {
  if (!Number.isInteger(arg) || arg < 0) {
    throw new Error('minLength: arg must be a non-negative integer');
  }
  if (typeof value !== 'string' && !Array.isArray(value)) {
    return `expected a string or array with length at least ${arg}`;
  }
  if (value.length < arg) {
    return `expected length at least ${arg}`;
  }
  return true;
});

registerRule('range', (value, arg) => {
  if (
    !Array.isArray(arg) ||
    arg.length !== 2 ||
    typeof arg[0] !== 'number' ||
    typeof arg[1] !== 'number'
  ) {
    throw new Error('range: arg must be a [min, max] pair of numbers');
  }
  if (typeof value !== 'number') {
    return `expected a number within [${arg[0]}, ${arg[1]}]`;
  }
  if (value < arg[0] || value > arg[1]) {
    return `expected a number within [${arg[0]}, ${arg[1]}]`;
  }
  return true;
});
