const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { readTasks, writeTasks } = require('../src/store.js');

function tmpFile(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'store-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return { dir, file: path.join(dir, 'tasks.json') };
}

const tasks = [
  { id: '1', title: 'Write report', tags: ['work'], done: false, created: '2024-01-01T00:00:00.000Z' },
  { id: '2', title: 'Buy milk', tags: ['home'], done: true, created: '2024-01-02T00:00:00.000Z' },
];

test('writing tasks then reading them back returns the same list', async (t) => {
  const { file } = tmpFile(t);
  await writeTasks(tasks, file);
  const result = await readTasks(file);
  assert.deepStrictEqual(result, tasks);
});

test('an absent tasks file reads as an empty list', async (t) => {
  const { file } = tmpFile(t);
  const result = await readTasks(file);
  assert.deepStrictEqual(result, []);
});

test('a corrupt tasks file reads as an empty list', async (t) => {
  const { file } = tmpFile(t);
  fs.writeFileSync(file, 'not json');
  const result = await readTasks(file);
  assert.deepStrictEqual(result, []);
});

test('readTasks honours the TASKS_FILE environment variable', async (t) => {
  const { file } = tmpFile(t);
  fs.writeFileSync(file, 'not json');
  const previous = process.env.TASKS_FILE;
  process.env.TASKS_FILE = file;
  t.after(() => {
    if (previous === undefined) {
      delete process.env.TASKS_FILE;
    } else {
      process.env.TASKS_FILE = previous;
    }
  });
  const result = await readTasks();
  assert.deepStrictEqual(result, []);
});
