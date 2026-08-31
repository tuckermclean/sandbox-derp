const { test } = require('node:test');
const assert = require('node:assert');

const { addTask, toggleTask, removeTask, filterTasks } = require('../src/todo.js');

test('addTask appends a task to the list', () => {
  const result = addTask([], { id: 1, text: 'a', done: false });
  assert.deepStrictEqual(result, [{ id: 1, text: 'a', done: false }]);
});

test('addTask does not mutate the original array', () => {
  const tasks = [];
  addTask(tasks, { id: 1, text: 'a', done: false });
  assert.deepStrictEqual(tasks, []);
});

test('toggleTask flips done to true for the matching task', () => {
  const result = toggleTask([{ id: 1, text: 'a', done: false }], 1);
  assert.strictEqual(result[0].done, true);
});

test('toggleTask flips done back to false when already done', () => {
  const result = toggleTask([{ id: 1, text: 'a', done: true }], 1);
  assert.strictEqual(result[0].done, false);
});

test('toggleTask does not mutate the original array', () => {
  const tasks = [{ id: 1, text: 'a', done: false }];
  toggleTask(tasks, 1);
  assert.strictEqual(tasks[0].done, false);
});

test('removeTask removes the matching task', () => {
  const result = removeTask(
    [{ id: 1, text: 'a', done: false }, { id: 2, text: 'b', done: false }],
    1
  );
  assert.deepStrictEqual(result, [{ id: 2, text: 'b', done: false }]);
});

test('filterTasks returns only active (not done) tasks', () => {
  const result = filterTasks(
    [{ id: 1, text: 'a', done: true }, { id: 2, text: 'b', done: false }],
    'active'
  );
  assert.deepStrictEqual(result, [{ id: 2, text: 'b', done: false }]);
});

test('filterTasks "done" returns only done tasks', () => {
  const result = filterTasks(
    [{ id: 1, text: 'a', done: true }, { id: 2, text: 'b', done: false }],
    'done'
  );
  assert.deepStrictEqual(result, [{ id: 1, text: 'a', done: true }]);
});

test('filterTasks "all" returns every task', () => {
  const tasks = [
    { id: 1, text: 'a', done: true },
    { id: 2, text: 'b', done: false },
  ];
  assert.deepStrictEqual(filterTasks(tasks, 'all'), tasks);
});
