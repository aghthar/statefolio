import { create } from 'zustand';

interface StoreState {
  counter: number;
  todos: string[];
  increment: () => void;
  decrement: () => void;
  addTodo: (todo: string) => void;
  removeTodo: (index: number) => void;
}

const useStore = create<StoreState>()((set) => ({
  counter: 0,
  todos: [],
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
  addTodo: (todo: string) => set((state) => ({ todos: [...state.todos, todo] })),
  removeTodo: (index: number) =>
    set((state) => ({ todos: state.todos.filter((_, i) => i !== index) }))
}));

export const useCounter = () => useStore((state) => state.counter);
export const useTodos = () => useStore((state) => state.todos);
export const useActions = () => {
  const { increment, decrement, addTodo, removeTodo } = useStore();
  return { increment, decrement, addTodo, removeTodo };
};

export default useStore; 