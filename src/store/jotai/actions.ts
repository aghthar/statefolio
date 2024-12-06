import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { counterAtom, todosAtom } from './atoms';

export const useCounterActions = () => {
  const setCounter = useSetAtom(counterAtom);

  return {
    increment: useCallback(() => setCounter(c => c + 1), [setCounter]),
    decrement: useCallback(() => setCounter(c => c - 1), [setCounter])
  };
};

export const useTodoActions = () => {
  const setTodos = useSetAtom(todosAtom);

  return {
    addTodo: useCallback((todo: string) => {
      setTodos(todos => [...todos, todo]);
    }, [setTodos]),
    removeTodo: useCallback((index: number) => {
      setTodos(todos => todos.filter((_, i) => i !== index));
    }, [setTodos])
  };
}; 