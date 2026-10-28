import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { BookProvider } from './src/context/BookContext';
import colors from './src/constants/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />

      <BookProvider>
        <AppNavigator />
      </BookProvider>
    </SafeAreaProvider>
  );
}
