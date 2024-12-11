import React, { createContext, useContext, useReducer } from "react";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Todo {
  id: string;
  text: string;
}

interface State {
  count: number;
  todos: Todo[];
}

type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "ADD_TODO"; text: string }
  | { type: "REMOVE_TODO"; id: string };

// Context
const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<React.Dispatch<Action> | null>(null);

// Reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now().toString(), text: action.text },
        ],
      };
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    default:
      return state;
  }
}

// Screen Component
function ContextScreen() {
  const state = useContext(StateContext)!;
  const dispatch = useContext(DispatchContext)!;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const headerHeight = insets.top + 56;

  return (
    <View
      className='flex-1'
      style={{
        backgroundColor: isDark ? "#000" : "#fff",
        paddingTop: headerHeight,
      }}
    >
      {/* Counter Section */}
      <View className='items-center justify-center p-4 mb-8'>
        <View
          style={{
            backgroundColor: isDark
              ? "rgba(31, 41, 55, 0.8)"
              : "rgba(243, 244, 246, 1)",
            borderRadius: 16,
            padding: 24,
            width: 256,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className='flex-row items-center justify-between'>
            <Pressable
              onPress={() => dispatch({ type: "DECREMENT" })}
              className={`w-12 h-12 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } items-center justify-center active:opacity-70`}
            >
              <Text
                className={`text-2xl ${isDark ? "text-white" : "text-black"}`}
              >
                -
              </Text>
            </Pressable>

            <Text
              className={`text-4xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {state.count}
            </Text>

            <Pressable
              onPress={() => dispatch({ type: "INCREMENT" })}
              className={`w-12 h-12 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } items-center justify-center active:opacity-70`}
            >
              <Text
                className={`text-2xl ${isDark ? "text-white" : "text-black"}`}
              >
                +
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Todos Section */}
      <BaseScreen
        todos={state.todos}
        onAddTodo={(text) => dispatch({ type: "ADD_TODO", text })}
        onRemoveTodo={(id) => dispatch({ type: "REMOVE_TODO", id })}
      />
    </View>
  );
}

// Export wrapped component with Context Provider
export default function ContextWrapper() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    todos: [],
  });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ContextScreen />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
