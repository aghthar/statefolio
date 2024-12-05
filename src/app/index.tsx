import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RecoilRoot } from 'recoil';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/redux/store';

import ReduxScreen from '../screens/ReduxScreen';
import MobxScreen from '../screens/MobxScreen';
import ZustandScreen from '../screens/ZustandScreen';
import RecoilScreen from '../screens/RecoilScreen';
import ContextScreen from '../screens/ContextScreen';
import JotaiScreen from '../screens/JotaiScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <RecoilRoot>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
              },
              headerStyle: {
                backgroundColor: '#f3f4f6',
              },
              tabBarStyle: {
                backgroundColor: '#f3f4f6',
              },
            }}
          >
            <Tab.Screen 
              name="Redux" 
              component={ReduxScreen}
              options={{
                title: 'Redux Toolkit'
              }}
            />
            <Tab.Screen 
              name="Mobx" 
              component={MobxScreen}
              options={{
                title: 'MobX'
              }}
            />
            <Tab.Screen 
              name="Zustand" 
              component={ZustandScreen}
              options={{
                title: 'Zustand'
              }}
            />
            <Tab.Screen 
              name="Recoil" 
              component={RecoilScreen}
              options={{
                title: 'Recoil'
              }}
            />
            <Tab.Screen 
              name="Context" 
              component={ContextScreen}
              options={{
                title: 'Context API'
              }}
            />
            <Tab.Screen 
              name="Jotai" 
              component={JotaiScreen}
              options={{
                title: 'Jotai'
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ReduxProvider>
    </RecoilRoot>
  );
}
