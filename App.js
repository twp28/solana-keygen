
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/homeScreen';
import ConnectScreen from './screens/connectScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen}   options={{ title: 'Create Solana Wallet on devnet' }} />
            <Stack.Screen name="ConnectScreen" component={ConnectScreen} options={{ title: 'Connect to Phantom Wallet' }} />
          </Stack.Navigator>
        </NavigationContainer>
  );
}

