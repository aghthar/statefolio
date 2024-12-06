import { atom, selector } from 'recoil';

export const counterState = atom({
  key: 'counterState',
  default: 0
});

export const todosState = atom<string[]>({
  key: 'todosState',
  default: []
});

export const todoStatsState = selector({
  key: 'todoStatsState',
  get: ({get}) => {
    const todos = get(todosState);
    return {
      total: todos.length
    };
  }
}); 