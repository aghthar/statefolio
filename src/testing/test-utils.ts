import { render } from "@testing-library/react-native";
import { ReactElement } from "react";

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });

export * from "@testing-library/react-native";
export { customRender as render };