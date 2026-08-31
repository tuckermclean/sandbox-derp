#!/usr/bin/env node
'use strict';

const { readTasks } = require('../src/store.js');

function csvEscape(value) {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function toCsv(tasks) {
  const header = ['id', 'title', 'tags', 'done', 'created'];
  const rows = tasks.map((task) => [
    task.id,
    task.title,
    Array.isArray(task.tags) ? task.tags.join(';') : '',
    task.done,
    task.created,
  ]);
  const lines = [header, ...rows].map((row) => row.map(csvEscape).join(','));
  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const tasks = await readTasks();
  if (args.includes('--json')) {
    process.stdout.write(JSON.stringify(tasks, null, 2) + '\n');
  } else if (args.includes('--csv')) {
    process.stdout.write(toCsv(tasks) + '\n');
  } else {
    process.stderr.write('usage: task-export.js --csv | --json\n');
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write((err && err.stack) || String(err) + '\n');
  process.exit(1);
});
