'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function filePath() {
  return process.env.TASKS_FILE || '.tasks.json';
}

function readTasks() {
  const target = filePath();
  let raw;
  try {
    raw = fs.readFileSync(target, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }

  try {
    const tasks = JSON.parse(raw);
    return Array.isArray(tasks) ? tasks : [];
  } catch (err) {
    return [];
  }
}

function writeTasks(tasks) {
  const target = filePath();
  const dir = path.dirname(target);
  const tmpPath = path.join(
    dir,
    `.tasks-${process.pid}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.tmp`
  );

  try {
    fs.writeFileSync(tmpPath, JSON.stringify(tasks, null, 2), 'utf8');
    fs.renameSync(tmpPath, target);
  } catch (err) {
    try {
      fs.unlinkSync(tmpPath);
    } catch (_) {
      // ignore cleanup failure; rethrow the original error
    }
    throw err;
  }
}

function listTasks() {
  return readTasks();
}

function addTask(title, tags = []) {
  const tasks = readTasks();
  const task = {
    id: crypto.randomUUID(),
    title,
    tags,
    done: false,
    created: new Date().toISOString(),
  };
  tasks.push(task);
  writeTasks(tasks);
  return task;
}

function markDone(id) {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error(`task not found: ${id}`);
  }
  task.done = true;
  writeTasks(tasks);
  return task;
}

function removeTask(id) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`task not found: ${id}`);
  }
  const [removed] = tasks.splice(index, 1);
  writeTasks(tasks);
  return removed;
}

module.exports = { listTasks, addTask, markDone, removeTask };
