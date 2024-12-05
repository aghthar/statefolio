# Migration Guide

## Overview

This guide provides step-by-step instructions for migrating between different state management solutions, including:
- Migration paths
- Common patterns
- Coexistence strategies
- Gotchas and solutions

## Migration Patterns

### Common Migration Steps

1. **Incremental Migration**
   ```typescript
   // 1. Start with coexisting stores
   const App = () => (
     <ReduxProvider store={reduxStore}>
       <RecoilRoot>
         <AppContent />
       </RecoilRoot>
     </ReduxProvider>
   );

   // 2. Migrate feature by feature
   const FeatureComponent = () => {
     // Old Redux state
     const oldData = useSelector(selectOldData);
     // New Recoil state
     const [newData] = useRecoilState(newDataState);

     useEffect(() => {
       // Sync data during migration if needed
       if (oldData && !newData) {
         setNewData(oldData);
       }
     }, [oldData]);
   };
   ```

### Migration Paths

#### From Redux to MobX

```typescript
// 1. Create equivalent MobX store
class UserStore {
  users = [];
  
  constructor() {
    makeAutoObservable(this);
  }

  // Convert Redux action to MobX action
  addUser = (user) => {
    this.users.push(user);
  }
}

// 2. Create adapter during migration
const useUserData = () => {
  const reduxUsers = useSelector(selectUsers);
  const { userStore } = useMobXStore();

  useEffect(() => {
    if (reduxUsers.length && !userStore.users.length) {
      userStore.setUsers(reduxUsers);
    }
  }, [reduxUsers]);

  return userStore.users;
};
```

#### From MobX to Zustand

```typescript
// 1. Create Zustand store with similar structure
const useStore = create((set) => ({
  users: [],
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),
}));

// 2. Migration helper
const useMigrationHelper = () => {
  const mobxStore = useMobXStore();
  const setZustandUsers = useStore((state) => state.setUsers);

  useEffect(() => {
    if (mobxStore.users.length) {
      setZustandUsers(mobxStore.users.slice());
    }
  }, [mobxStore.users]);
};
```

## Coexistence Strategies

### 1. Bridge Pattern

```typescript
// Create a bridge between stores
const StoreBridge = ({ children }) => {
  const reduxData = useSelector(selectData);
  const setRecoilData = useSetRecoilState(dataState);

  useEffect(() => {
    setRecoilData(reduxData);
  }, [reduxData]);

  return children;
};
```

### 2. Adapter Pattern

```typescript
// Create adapters for different store patterns
const createStoreAdapter = (oldStore, newStore) => ({
  getData: () => ({
    ...oldStore.getData(),
    ...newStore.getData(),
  }),
  
  setData: (data) => {
    oldStore.setData(data);
    newStore.setData(data);
  },
});
```

## Migration Scenarios

### 1. Redux to Zustand

```typescript
// Step 1: Create equivalent Zustand store
const useStore = create((set) => ({
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
}));

// Step 2: Create migration component
const ReduxToZustandMigration = () => {
  const reduxCounter = useSelector((state) => state.counter);
  const setZustandCounter = useStore((state) => state.setCounter);

  useEffect(() => {
    setZustandCounter(reduxCounter);
  }, [reduxCounter]);

  return null;
};
```

### 2. MobX to Jotai

```typescript
// Step 1: Create equivalent Jotai atoms
const counterAtom = atom(0);
const todosAtom = atom<string[]>([]);

// Step 2: Create migration hook
const useMobxToJotaiMigration = () => {
  const mobxStore = useMobXStore();
  const [, setCounter] = useAtom(counterAtom);
  const [, setTodos] = useAtom(todosAtom);

  useEffect(() => {
    setCounter(mobxStore.counter);
    setTodos(mobxStore.todos.slice());
  }, [mobxStore]);
};
```

## Testing During Migration

```typescript
// Test coexistence of stores
describe('Store Migration', () => {
  it('should sync data between stores', async () => {
    const { result } = renderHook(() => ({
      redux: useSelector(selectData),
      recoil: useRecoilValue(dataState),
    }));

    act(() => {
      store.dispatch(updateData('new value'));
    });

    // Wait for sync
    await waitFor(() => {
      expect(result.current.redux).toBe('new value');
      expect(result.current.recoil).toBe('new value');
    });
  });
});
```

## Performance Monitoring

```typescript
// Monitor performance during migration
const PerformanceMonitor = () => {
  useEffect(() => {
    const marks = performance.getEntriesByType('mark');
    console.log('Performance Marks:', marks);
  });

  return null;
};

// Usage in components
const Component = () => {
  useEffect(() => {
    performance.mark('oldStore-start');
    // Old store operation
    performance.mark('oldStore-end');
    
    performance.mark('newStore-start');
    // New store operation
    performance.mark('newStore-end');
  }, []);
};
```

## Best Practices

1. **Gradual Migration**
   - Migrate one feature at a time
   - Keep both solutions running in parallel
   - Use feature flags for rollback capability

2. **Data Consistency**
   - Implement data synchronization
   - Validate data integrity
   - Monitor for data loss

3. **Testing Strategy**
   - Test both stores during migration
   - Implement integration tests
   - Monitor performance metrics

4. **Rollback Plan**
   - Keep old implementation
   - Use feature flags
   - Maintain version control

## Common Pitfalls

1. **Data Synchronization**
   - Solution: Implement proper bridges
   - Monitor data flow
   - Handle edge cases

2. **Performance Impact**
   - Solution: Monitor metrics
   - Optimize gradually
   - Remove old code

3. **Team Coordination**
   - Solution: Clear documentation
   - Team training
   - Gradual adoption

## Additional Resources

- [Redux Migration Guide](https://redux.js.org/usage/migrating-to-modern-redux)
- [MobX Migration Examples](https://mobx.js.org/migrating-from-redux.html)
- [React Query Migration](https://tanstack.com/query/latest/docs/react/guides/migrating-to-react-query-4)
- [State Management Patterns](https://kentcdodds.com/blog/application-state-management-with-react) 