'use strict';

const fs = require('node:fs');
const path = require('node:path');

require('../src/rules.js');
const { validate } = require('../src/validate.js');

function main() {
  const [, , schemaPath, dataPath] = process.argv;
  if (!schemaPath || !dataPath) {
    console.error('Usage: node bin/validate.js <schema.json> <data.json>');
    process.exit(2);
  }
  try {
    const schema = JSON.parse(fs.readFileSync(path.resolve(schemaPath), 'utf8'));
    const data = JSON.parse(fs.readFileSync(path.resolve(dataPath), 'utf8'));
    const violations = validate(schema, data);
    for (const violation of violations) {
      console.log(`${violation.path}: ${violation.rule}: ${violation.message}`);
    }
    if (violations.length > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

main();
