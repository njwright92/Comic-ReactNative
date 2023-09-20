import React, { Suspense, lazy } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Linking, View, Text } from 'react-native';

const MainComponent = lazy(() => import('./src/components/mainComponent'));

const linking = {
  prefixes: ['http://localhost:19006', 'comedify://'],
  config: {
    screens: {
      Home: 'home',
      Jokes: 'jokes',
      ComicBot: 'comicbot',
      SignIn: 'signin',
      SignUp: 'signup',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Suspense fallback={<View><Text>Loading...</Text></View>}>
        <MainComponent />
      </Suspense>
    </NavigationContainer>
  );
}


