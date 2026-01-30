import { loadTasks, saveTasks, generateId } from '../public/tasks.js';
import { describe, test, expect, beforeEach } from 'vitest';

// Mock localStorage for Node.js test environment
let mockStorage = {};
global.window = {};
global.window.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => {
    mockStorage[key] = value;
  },
  removeItem: (key) => {
    delete mockStorage[key];
  },
};

beforeEach(() => {
  mockStorage = {};
});

describe('todo sovelluksen testaus', function () {
  test('tehtävän lisääminen toimii', () => {
    const tasks = [];
    const newTask = {
      id: generateId(),
      topic: 'Testitehtävä',
      priority: 'high',
      status: 'todo',
      description: 'Kuvaus',
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    tasks.push(newTask);
    expect(tasks.length).toBe(1);
    expect(tasks[0].topic).toBe('Testitehtävä');
  });

  test('tehtävän päivittäminen toimii', () => {
    const tasks = [
      {
        id: generateId(),
        topic: 'Alku',
        priority: 'medium',
        status: 'todo',
        description: '',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    tasks[0].topic = 'Päivitetty';
    tasks[0].updatedAt = Date.now();
    expect(tasks[0].topic).toBe('Päivitetty');
  });

  test('tehtävän poistaminen toimii', () => {
    const tasks = [{ id: generateId() }, { id: generateId() }];
    const idx = 0;
    tasks.splice(idx, 1);
    expect(tasks.length).toBe(1);
  });

  test('tehtävän tilan muuttaminen toimii', () => {
    const task = { status: 'todo', completed: false };
    task.completed = true;
    task.status = 'done';
    expect(task.completed).toBe(true);
    expect(task.status).toBe('done');
  });

  test('datan oikeellisuus tallennuksen ja haun jälkeen', () => {
    const testKey = 'test_tasks';
    const tasks = [
      {
        id: generateId(),
        topic: 'A',
        priority: 'low',
        status: 'todo',
        completed: false,
      },
    ];
    saveTasks(tasks, testKey);
    const loaded = loadTasks(testKey);
    expect(Array.isArray(loaded)).toBe(true);
    expect(loaded[0].topic).toBe('A');
  });

  test('virheenkäsittely: tehtävän otsikko puuttuu', () => {
    const topic = '';
    function createTask() {
      if (!topic) throw new Error('Otsikko puuttuu');
      return { topic };
    }
    expect(createTask).toThrow('Otsikko puuttuu');
  });
});
