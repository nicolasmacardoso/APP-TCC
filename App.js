import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';

import MainNavigator from './app/MainNavigator';
import LoginProvider from './app/context/LoginProvider';
// Importe a fonte diretamente aqui
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

    // Adicione outras fontes conforme necessário
  });

  useEffect(() => {
    const initializeApp = async () => {
      // Configuração do AsyncStorage
      try {
        await AsyncStorage.setItem('@user', ''); // Inicializa o AsyncStorage se necessário
      } catch (e) {
        console.error('Erro ao configurar o AsyncStorage:', e);
      }
    };

    // Chama a função para inicializar o aplicativo
    initializeApp();
  }, []); // O array vazio indica que esse efeito só deve ser executado uma vez, equivalente ao componentDidMount

  if (!loaded) {
    // Aguarde até que as fontes estejam carregadas
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