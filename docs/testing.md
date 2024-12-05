# Testing Strategies Guide

## Overview

This guide covers comprehensive testing approaches for each state management solution, including:
- Unit Testing
- Integration Testing
- Component Testing
- Performance Testing

## Testing Setup

```typescript:src/testing/setup.ts
import '@testing-library/jest-native/extend-expect';
import { cleanup } from '@testing-library/react-native';

// Global setup
beforeEach(() => {
  jest.useFakeTimers();
});

// Global teardown
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
```

## Common Test Utilities

```typescript:src/testing/utils.ts
import { render } from '@testing-library/react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { RecoilRoot } from 'recoil';
import { StoreProvider as MobXProvider } from '../store/mobx/StoreProvider';
import { Provider as JotaiProvider } from 'jotai';

// Redux wrapper
export const renderWithRedux = (ui: React.ReactElement, { store } = {}) => {
  return render(<ReduxProvider store={store}>{ui}</ReduxProvider>);
};

// MobX wrapper
export const renderWithMobX = (ui: React.ReactElement, { store } = {}) => {
  return render(<MobXProvider store={store}>{ui}</MobXProvider>);
};

// Recoil wrapper
export const renderWithRecoil = (ui: React.ReactElement) => {
  return render(<RecoilRoot>{ui}</RecoilRoot>);
};

// Jotai wrapper
export const renderWithJotai = (ui: React.ReactElement) => {
  return render(<JotaiProvider>{ui}</JotaiProvider>);
};
```

## Testing Patterns by Library

### 1. Redux Toolkit Testing

```typescript:src/store/redux/__tests__/integration.test.tsx
import { renderWithRedux, fireEvent } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { ReduxScreen } from '../../../screens/ReduxScreen';
import { counterSlice } from '../slices/counterSlice';

describe('Redux Integration', () => {
  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  });

  it('should handle counter interactions', () => {
    const { getByText } = renderWithRedux(<ReduxScreen />, { store });
    
    fireEvent.press(getByText('Increment'));
    expect(getByText('Counter: 1')).toBeTruthy();
    
    fireEvent.press(getByText('Decrement'));
    expect(getByText('Counter: 0')).toBeTruthy();
  });

  // Async action testing
  it('should handle async actions', async () => {
    const { result } = renderHook(() => useAppDispatch());
    await act(async () => {
      await result.current(fetchTodos());
    });
    expect(store.getState().todos.items).toHaveLength(3);
  });
});
```

### 2. MobX Testing

```typescript:src/store/mobx/__tests__/store.test.ts
import { TodoStore } from '../store';
import { reaction } from 'mobx';

describe('MobX Store', () => {
  let store: TodoStore;
  let reactionSpy: jest.Mock;

  beforeEach(() => {
    store = new TodoStore();
    reactionSpy = jest.fn();
  });

  it('should track reactions', () => {
    reaction(
      () => store.todos.length,
      (length) => reactionSpy(length)
    );

    store.addTodo('Test');
    expect(reactionSpy).toHaveBeenCalledWith(1);
  });

  // Component testing
  it('should render and update correctly', () => {
    const { getByText } = renderWithMobX(<MobXScreen />, { store });
    
    fireEvent.press(getByText('Add Todo'));
    expect(getByText('Total: 1')).toBeTruthy();
  });
});
```

### 3. Zustand Testing

```typescript:src/store/zustand/__tests__/store.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { createStore } from '../store';

describe('Zustand Store', () => {
  it('should handle state updates', () => {
    const { result } = renderHook(() => createStore());
    
    act(() => {
      result.current.getState().increment();
    });
    
    expect(result.current.getState().count).toBe(1);
  });

  // Middleware testing
  it('should handle middleware', () => {
    const logSpy = jest.fn();
    const store = createStore(logSpy);
    
    act(() => {
      store.getState().increment();
    });
    
    expect(logSpy).toHaveBeenCalled();
  });
});
```

### 4. Recoil Testing

```typescript:src/store/recoil/__tests__/atoms.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { RecoilRoot, useRecoilState } from 'recoil';
import { counterState } from '../atoms';

describe('Recoil Atoms', () => {
  const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

  it('should handle atom updates', () => {
    const { result } = renderHook(() => useRecoilState(counterState), {
      wrapper,
    });

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
  });

  // Selector testing
  it('should compute derived state', () => {
    const { result } = renderHook(() => useRecoilValue(todoStatsState), {
      wrapper,
    });
    expect(result.current.total).toBe(0);
  });
});
```

### 5. Context API Testing

```typescript:src/store/context/__tests__/context.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useStore, StoreProvider } from '../context';

describe('Context Store', () => {
  const wrapper = ({ children }) => (
    <StoreProvider>{children}</StoreProvider>
  );

  it('should handle context updates', () => {
    const { result } = renderHook(() => useStore(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'INCREMENT' });
    });

    expect(result.current.state.count).toBe(1);
  });
});
```

### 6. Jotai Testing

```typescript:src/store/jotai/__tests__/atoms.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useAtom } from 'jotai';
import { counterAtom } from '../atoms';

describe('Jotai Atoms', () => {
  it('should handle atom updates', () => {
    const { result } = renderHook(() => useAtom(counterAtom));

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
  });
});
```

## Performance Testing

```typescript:src/testing/performance.test.ts
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  it('should measure state update performance', async () => {
    const start = performance.now();
    
    // Perform 1000 state updates
    for (let i = 0; i < 1000; i++) {
      await store.dispatch(increment());
    }
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
  });
});
```

## E2E Testing with Detox

```typescript:e2e/firstTest.e2e.ts
describe('State Management E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should handle counter interactions', async () => {
    await element(by.text('Increment')).tap();
    await expect(element(by.text('Counter: 1'))).toBeVisible();
  });
});
```

## Best Practices

1. **Test Organization**
   - Group tests by feature
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)
   - Keep tests focused and simple

2. **Test Coverage**
   - Aim for high coverage of business logic
   - Test edge cases
   - Include error scenarios
   - Test async operations

3. **Performance Testing**
   - Measure render times
   - Test state update performance
   - Monitor memory usage
   - Test with large datasets

4. **Integration Testing**
   - Test component interactions
   - Verify state updates
   - Test side effects
   - Validate UI updates

## Additional Resources

- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Detox Documentation](https://github.com/wix/Detox)
- [Testing Performance](https://reactnative.dev/docs/performance) 