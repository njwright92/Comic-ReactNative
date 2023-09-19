import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainComponent from './src/components/mainComponent';

export default function App() {
  return (
    <NavigationContainer>
      <MainComponent />
    </NavigationContainer>
  );
}
