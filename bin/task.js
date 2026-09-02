#!/usr/bin/env node

'use strict';

const crypto = require('node:crypto');
const { readTasks, writeTasks } = require('../src/store');

const tasksFile = process.env.TASKS_FILE || '.tasks.json';

const USAGE = `Usage:
  task add <title> [--tag <tag> ...]
  task list [--tag <tag>] [--done] [--search <text>]
  task done <id>
  task rm <id>
`;

function usage() {
  process.stderr.write(USAGE);
  process.exit(1);
}

function fail(message) {
  process.stderr.write(message);
  process.exit(1);
}

function add(args) {
  const titleParts = [];
  const tags = [];
  let parsingTags = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--tag') {
      parsingTags = true;
      const value = args[++i];
      if (value === undefined) {
        usage();
      }
      tags.push(value);
    } else if (!parsingTags) {
      titleParts.push(arg);
    } else {
      usage();
    }
  }

  if (titleParts.length === 0) {
    usage();
  }

  const tasks = readTasks(tasksFile);
  const task = {
    id: crypto.randomUUID(),
    title: titleParts.join(' '),
    tags,
    done: false,
    created: new Date().toISOString(),
  };
  tasks.push(task);
  writeTasks(tasks, tasksFile);
  process.stdout.write(`${task.id}\n`);
}

function list(args) {
  let tag;
  let search;
  let doneOnly = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--tag':
        tag = args[++i];
        if (tag === undefined) {
          usage();
        }
        break;
      case '--search':
        search = args[++i];
        if (search === undefined) {
          usage();
        }
        break;
      case '--done':
        doneOnly = true;
        break;
      default:
        usage();
    }
  }

  const tasks = readTasks(tasksFile);
  for (const task of tasks) {
    if (tag !== undefined && !task.tags.includes(tag)) {
      continue;
    }
    if (doneOnly && task.done !== true) {
      continue;
    }
    if (
      search !== undefined &&
      !task.title.toLowerCase().includes(search.toLowerCase())
    ) {
      continue;
    }
    process.stdout.write(
      `${task.id} ${task.title} [${task.tags.join(', ')}] ${task.done ? 'done' : 'pending'}\n`
    );
  }
}

function done(args) {
  if (args.length !== 1) {
    usage();
  }
  const id = args[0];
  const tasks = readTasks(tasksFile);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    fail(`no matching task with id ${id}\n`);
  }
  task.done = true;
  writeTasks(tasks, tasksFile);
  process.stdout.write(`done ${id}\n`);
}

function rm(args) {
  if (args.length !== 1) {
    usage();
  }
  const id = args[0];
  const tasks = readTasks(tasksFile);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    fail(`no matching task with id ${id}\n`);
  }
  tasks.splice(index, 1);
  writeTasks(tasks, tasksFile);
  process.stdout.write(`removed ${id}\n`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'add':
      return add(args.slice(1));
    case 'list':
      return list(args.slice(1));
    case 'done':
      return done(args.slice(1));
    case 'rm':
      return rm(args.slice(1));
    default:
      return usage();
  }
}

main();
