# Jotai Implementation Guide

## Implementation in Expo Router

```typescript:src/app/jotai.tsx
import React from "react";
import { atom, useAtom } from "jotai";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Todo {
  id: string;
  text: string;
}

// Atoms
const countAtom = atom(0);
const todosAtom = atom<Todo[]>([]);

// Derived Atoms
const todoStatsAtom = atom((get) => {
  const todos = get(todosAtom);
  return {
    total: todos.length,
    isEmpty: todos.length === 0,
  };
});

// Actions
export function useJotaiActions() {
  const [, setCount] = useAtom(countAtom);
  const [, setTodos] = useAtom(todosAtom);

  return {
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
    addTodo: (text: string) =>
      setTodos((prev) => [...prev, { id: Date.now().toString(), text }]),
    removeTodo: (id: string) =>
      setTodos((prev) => prev.filter((todo) => todo.id !== id)),
  };
}
```

## Screen Implementation with Safe Areas and Dark Mode

```typescript:src/app/jotai.tsx
export default function JotaiScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [count] = useAtom(countAtom);
  const [todos] = useAtom(todosAtom);
  const stats = useAtom(todoStatsAtom);
  const { increment, decrement, addTodo, removeTodo } = useJotaiActions();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      {/* Counter Section */}
      <View className="mb-8">
        <Text className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
          Counter: {count}
        </Text>
        <View className="flex-row space-x-4">
          <Button title="Increment" onPress={increment} />
          <Button title="Decrement" onPress={decrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
          Todos ({stats.total})
        </Text>
        {/* Todo implementation */}
      </View>
    </View>
  );
}
```

## Integration with Expo Router

```typescript:src/app/_layout.tsx
import { Stack } from "expo-router";
import { Provider } from "jotai";

export default function Layout() {
  return (
    <Provider>
      <Stack>
        <Stack.Screen
          name="jotai"
          options={{
            headerShown: true,
            presentation: "modal",
            animation: "slide_from_bottom",
            contentStyle: {
              backgroundColor: isDark ? "#000" : "#fff",
            },
          }}
        />
      </Stack>
    </Provider>
  );
}
```

## Best Practices

1. **Atom Organization**

   - Keep atoms small and focused
   - Use derived atoms for computed values
   - Group related atoms together
   - Use proper TypeScript types

2. **State Management**

   - Use atoms for primitive values
   - Implement derived atoms for computed state
   - Keep state normalized
   - Handle async operations properly

3. **Performance**

   - Use derived atoms efficiently
   - Implement proper component splitting
   - Use React.memo when needed
   - Keep state granular

4. **Integration**
   - Wrap app with Provider
   - Configure proper screen options
   - Handle safe areas correctly
   - Support dark mode

## Common Pitfalls

1. Not wrapping the app with Provider
2. Creating unnecessary derived atoms
3. Not handling async operations properly
4. Overcomplicating atom structure

## Additional Resources

- [Jotai Documentation](https://jotai.org/)
- [Jotai Utils Documentation](https://jotai.org/docs/utils)
- [Jotai TypeScript Guide](https://jotai.org/docs/typescript)
- [Jotai Best Practices](https://jotai.org/docs/basics/best-practices)
