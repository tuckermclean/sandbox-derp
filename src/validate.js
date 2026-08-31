'use strict';

const rules = new Map();

function registerRule(name, fn) {
  rules.set(name, fn);
}

function validate(schema, data) {
  const violations = [];
  for (const field of Object.keys(schema)) {
    const value = data[field];
    const fieldRules = schema[field];
    for (const rule of Object.keys(fieldRules)) {
      if (!rules.has(rule)) {
        throw new Error(`Unknown validation rule: ${rule}`);
      }
      if (value === undefined && rule !== 'required') {
        continue;
      }
      const result = rules.get(rule)(value, fieldRules[rule]);
      if (result !== true) {
        violations.push({ path: field, rule, message: result });
      }
    }
  }
  return violations;
}

module.exports = { registerRule, validate };
