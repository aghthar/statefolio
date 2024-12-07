import { useColorScheme as useNativeColorScheme } from "react-native";

export default function useColorScheme() {
  return useNativeColorScheme() as "light" | "dark";
}
