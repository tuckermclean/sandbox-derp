#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const { readTasks, writeTasks } = require('../src/store.js');

function printLine(text) {
  process.stdout.write(text + '\n');
}

function fail(message) {
  process.stderr.write(message + '\n');
  process.exit(1);
}

async function addTask(args) {
  const tags = [];
  const titleParts = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tag') {
      const tag = args[++i];
      if (tag === undefined) {
        fail('missing value for --tag');
      }
      tags.push(tag);
    } else {
      titleParts.push(args[i]);
    }
  }
  if (titleParts.length === 0) {
    fail('usage: task.js add <title> [--tag <tag>...]');
  }
  const title = titleParts.join(' ');
  const tasks = await readTasks();
  const task = {
    id: crypto.randomUUID(),
    title,
    tags,
    done: false,
    created: new Date().toISOString(),
  };
  tasks.push(task);
  await writeTasks(tasks);
  printLine(task.id);
}

async function listTasks(args) {
  let tag = null;
  let done = false;
  let search = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tag') {
      tag = args[++i];
      if (tag === undefined) {
        fail('missing value for --tag');
      }
    } else if (args[i] === '--done') {
      done = true;
    } else if (args[i] === '--search') {
      search = args[++i];
      if (search === undefined) {
        fail('missing value for --search');
      }
    } else {
      fail(`unknown argument: ${args[i]}`);
    }
  }
  let tasks = await readTasks();
  if (tag !== null) {
    tasks = tasks.filter((task) => task.tags.includes(tag));
  }
  if (done) {
    tasks = tasks.filter((task) => task.done);
  }
  if (search !== null) {
    const needle = search.toLowerCase();
    tasks = tasks.filter((task) => task.title.toLowerCase().includes(needle));
  }
  for (const task of tasks) {
    const mark = task.done ? '[x]' : '[ ]';
    const tags = task.tags.length > 0 ? ` (${task.tags.join(', ')})` : '';
    printLine(`${mark} ${task.id} ${task.title}${tags}`);
  }
}

async function markDone(args) {
  const [id] = args;
  if (!id) {
    fail('usage: task.js done <id>');
  }
  const tasks = await readTasks();
  let changed = false;
  for (const task of tasks) {
    if (task.id === id) {
      task.done = true;
      changed = true;
    }
  }
  if (!changed) {
    fail(`no task with id ${id}`);
  }
  await writeTasks(tasks);
}

async function removeTask(args) {
  const [id] = args;
  if (!id) {
    fail('usage: task.js rm <id>');
  }
  const tasks = await readTasks();
  const next = tasks.filter((task) => task.id !== id);
  if (next.length === tasks.length) {
    fail(`no task with id ${id}`);
  }
  await writeTasks(next);
}

async function main() {
  const [, , command, ...args] = process.argv;
  switch (command) {
    case 'add':
      await addTask(args);
      break;
    case 'list':
      await listTasks(args);
      break;
    case 'done':
      await markDone(args);
      break;
    case 'rm':
      await removeTask(args);
      break;
    default:
      fail('usage: task.js <add|list|done|rm> ...');
  }
}

main().catch((err) => {
  fail(err.stack || String(err));
});
