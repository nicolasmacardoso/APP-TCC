import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';

import MainNavigator from './app/MainNavigator';
import LoginProvider from './app/context/LoginProvider';
import InterRegular from './assets/fonts/Inter-Regular.ttf';
import InterMedium from './assets/fonts/Inter-Medium.ttf';
import InterExtraBold from './assets/fonts/Inter-ExtraBold.ttf';
import InterBold from './assets/fonts/Inter-Bold.ttf';

export default function App() {
  const [loaded] = useFonts({
    'Inter-Regular': InterRegular,
    'Inter-Medium': InterMedium,
    'Inter-Extrabold': InterExtraBold,
    'Inter-bold': InterBold,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await AsyncStorage.setItem('@user', '');
      } catch (e) {
        console.error('Erro ao inicializar AsyncStorage:', e);
      }
    };

    initializeApp();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
}
