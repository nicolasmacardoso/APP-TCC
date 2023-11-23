import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';

import MainNavigator from './app/MainNavigator';
import LoginProvider from './app/context/LoginProvider';

// Importe a fonte diretamente aqui
import InterRegular from './assets/fonts/Inter-Regular.ttf';

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      // Configuração do AsyncStorage
      try {
        await AsyncStorage.setItem('@user', ''); // Inicializa o AsyncStorage se necessário
      } catch (e) {
        console.error('Erro ao configurar o AsyncStorage:', e);
      }

      // Carrega as fontes
      await loadFonts();
    };

    const loadFonts = async () => {
      await useFonts({
        'Inter-Regular': InterRegular,
        // Adicione outras fontes conforme necessário
      });
    };

    // Chama a função para inicializar o aplicativo
    initializeApp();
  }, []); // O array vazio indica que esse efeito só deve ser executado uma vez, equivalente ao componentDidMount

  return (
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
}
