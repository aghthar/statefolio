# Recoil Implementation Guide

## Implementation in Expo Router

```typescript:src/app/recoil.tsx
import React from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Todo {
  id: string;
  text: string;
}

// Atoms
const counterState = atom({
  key: "counterState",
  default: 0,
});

const todosState = atom<Todo[]>({
  key: "todosState",
  default: [],
});

// Selectors
const todoStatsState = selector({
  key: "todoStatsState",
  get: ({ get }) => {
    const todos = get(todosState);
    return {
      total: todos.length,
      isEmpty: todos.length === 0,
    };
  },
});

// Actions
export function useRecoilActions() {
  const [, setCounter] = useRecoilState(counterState);
  const [, setTodos] = useRecoilState(todosState);

  return {
    increment: () => setCounter((c) => c + 1),
    decrement: () => setCounter((c) => c - 1),
    addTodo: (text: string) =>
      setTodos((prev) => [...prev, { id: Date.now().toString(), text }]),
    removeTodo: (id: string) =>
      setTodos((prev) => prev.filter((todo) => todo.id !== id)),
  };
}
```

## Screen Implementation with Safe Areas and Dark Mode

```typescript:src/app/recoil.tsx
export default function RecoilScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const count = useRecoilValue(counterState);
  const todos = useRecoilValue(todosState);
  const stats = useRecoilValue(todoStatsState);
  const { increment, decrement, addTodo, removeTodo } = useRecoilActions();

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
import { RecoilRoot } from "recoil";

export default function Layout() {
  return (
    <RecoilRoot>
      <Stack>
        <Stack.Screen
          name="recoil"
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
    </RecoilRoot>
  );
}
```

## Best Practices

1. **Atom Organization**

   - Keep atoms small and focused
   - Use selectors for derived state
   - Implement atom families for dynamic data
   - Use proper key naming conventions

2. **State Management**

   - Prefer selectors over complex atoms
   - Use atom effects for side effects
   - Implement proper error boundaries
   - Keep state normalized

3. **Performance**

   - Use atom families for large lists
   - Implement selectors for computed values
   - Split atoms appropriately
   - Use React.memo for components

4. **Integration**
   - Wrap app with RecoilRoot
   - Configure proper screen options
   - Handle safe areas correctly
   - Support dark mode

## Common Pitfalls

1. Not using unique keys for atoms
2. Overusing atom families
3. Creating circular dependencies
4. Not handling loading states

## Additional Resources

- [Recoil Documentation](https://recoiljs.org/)
- [Recoil Best Practices](https://recoiljs.org/docs/guides/best-practices)
- [Recoil API Reference](https://recoiljs.org/docs/api-reference/core/RecoilRoot)
- [Recoil DevTools](https://github.com/recoiljs/recoil-devtools)
