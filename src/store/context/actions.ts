import { useCallback } from 'react';
import { useDispatch } from './Provider';

export const useCounterActions = () => {
  const dispatch = useDispatch();

  return {
    increment: useCallback(() => dispatch({ type: 'INCREMENT' }), [dispatch]),
    decrement: useCallback(() => dispatch({ type: 'DECREMENT' }), [dispatch])
  };
};

export const useTodoActions = () => {
  const dispatch = useDispatch();

  return {
    addTodo: useCallback((todo: string) => {
      dispatch({ type: 'ADD_TODO', payload: todo });
    }, [dispatch]),
    removeTodo: useCallback((index: number) => {
      dispatch({ type: 'REMOVE_TODO', payload: index });
    }, [dispatch])
  };
}; 