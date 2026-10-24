import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BreedDetailScreen} from '../screens/BreedDetailScreen';
import {BreedListScreen} from '../screens/BreedListScreen';
import {colors} from '../theme';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: colors.surface},
          headerTintColor: colors.accent,
          headerTitleStyle: {color: colors.text, fontWeight: '700'},
          contentStyle: {backgroundColor: colors.bg},
        }}>
        <Stack.Screen
          name="BreedList"
          component={BreedListScreen}
          options={{title: 'Dog Breed Explorer'}}
        />
        <Stack.Screen
          name="BreedDetail"
          component={BreedDetailScreen}
          options={{title: 'Breed details'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
