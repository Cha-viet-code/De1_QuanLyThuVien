import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../constants/colors';
import BookListScreen from '../screens/BookListScreen';
import BookFormScreen from '../screens/BookFormScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BookList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.surface,
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '700',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={{
            title: 'Thư viện PTIT',
          }}
        />

        <Stack.Screen
          name="BookForm"
          component={BookFormScreen}
          options={({ route }) => ({
            title: route.params?.bookId
              ? 'Chỉnh sửa sách'
              : 'Thêm sách mới',
          })}
        />

        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{
            title: 'Chi tiết sách',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}