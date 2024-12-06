import React, { createContext, useContext, useReducer } from 'react';

interface State {
  counter: {
    value: number;
  };
  todos: {
    items: string[];
  };
}

const initialState: State = {
  counter: {
    value: 0
  },
  todos: {
    items: []
  }
};

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'REMOVE_TODO'; payload: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: { value: state.counter.value + 1 } };
    case 'DECREMENT':
      return { ...state, counter: { value: state.counter.value - 1 } };
    case 'ADD_TODO':
      return {
        ...state,
        todos: { items: [...state.todos.items, action.payload] }
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: {
          items: state.todos.items.filter((_, i) => i !== action.payload)
        }
      };
    default:
      return state;
  }
};

const StateContext = createContext<State>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => null);

export const Provider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext); 