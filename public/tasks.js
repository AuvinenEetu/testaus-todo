// Tehtävien käsittelylogiikka, ei DOM-viittauksia
const STORAGE_KEY = 'todo_tasks_v1';

const getLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  // Mock for Node.js tests
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};

/**
 * @returns {Array}
 */
export function loadTasks(storageKey = 'todo_tasks_v1') {
  const storage = getLocalStorage();
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks, storageKey = 'todo_tasks_v1') {
  const storage = getLocalStorage();
  storage.setItem(storageKey, JSON.stringify(tasks));
}

export function generateId() {
  return (
    't_' +
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}
