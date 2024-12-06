import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { counterState, todosState } from './atoms';

export const useCounterActions = () => {
  const setCounter = useSetRecoilState(counterState);

  return {
    increment: useCallback(() => setCounter(c => c + 1), [setCounter]),
    decrement: useCallback(() => setCounter(c => c - 1), [setCounter])
  };
};

export const useTodoActions = () => {
  const setTodos = useSetRecoilState(todosState);

  return {
    addTodo: useCallback((todo: string) => {
      setTodos(todos => [...todos, todo]);
    }, [setTodos]),
    removeTodo: useCallback((index: number) => {
      setTodos(todos => todos.filter((_, i) => i !== index));
    }, [setTodos])
  };
}; 