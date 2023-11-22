import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';

import MainNavigator from './app/MainNavigator';
import LoginProvider from './app/context/LoginProvider';

export default function App() {
  useEffect(() => {
    // Configuração do AsyncStorage
    const configureAsyncStorage = async () => {
      try {
        await AsyncStorage.setItem('@user', ''); // Inicializa o AsyncStorage se necessário
      } catch (e) {
        console.error('Erro ao configurar o AsyncStorage:', e);
      }
    };

    configureAsyncStorage();
  }, []);

  return (
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
}
