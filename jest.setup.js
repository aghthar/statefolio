import "@testing-library/jest-native/extend-expect";
import { expect } from "@jest/globals";
global.expect = expect;
global.jest = jest;

// Mock React Native
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    // Add any specific component mocks here
    ActionSheetIOS: {},
  };
});

// Mock Expo's Constants
jest.mock("expo-constants", () => ({
  Constants: { manifest: { extra: {} } },
}));

// Mock Safe Area Context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Enable garbage collection testing
global.gc = jest.fn();

// Mock Expo Router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  Stack: {
    Screen: () => null,
  },
}));
