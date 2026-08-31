'use strict';

function addTask(tasks, task) {
  return [...tasks, task];
}

function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter((task) => !task.done);
  if (filter === 'done') return tasks.filter((task) => task.done);
  return tasks.slice();
}

module.exports = { addTask, toggleTask, removeTask, filterTasks };
