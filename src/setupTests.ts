import '@testing-library/jest-dom';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// Provide a working localStorage for tests that use zustand/persist
const localStorageStore: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: (key: string) => localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => { localStorageStore[key] = value; },
  removeItem: (key: string) => { delete localStorageStore[key]; },
  clear: () => { Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]); },
  get length() { return Object.keys(localStorageStore).length; },
  key: (index: number) => Object.keys(localStorageStore)[index] ?? null,
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });
