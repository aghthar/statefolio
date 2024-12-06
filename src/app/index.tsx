import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-4">
        State Management Demo
      </Text>
      <Text className="text-center text-gray-600">
        This app demonstrates different state management solutions in React Native.
        Use the tabs below to explore each implementation.
      </Text>
    </View>
  );
}
