import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppForm from './AppForm';

const SplashScreen = ({ navigation }) => {
  const handleStartButtonPress = () => {
    // Navegue para a tela LoginForm
    navigation.navigate('AppForm');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../Imagens/CimaLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.tagline}>
        Unindo o Bairro, Notícia a Notícia, Coração a Coração.
      </Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartButtonPress}
      >
        <Text style={styles.buttonText}>INICIAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Cor de fundo da tela
  },
  logo: {
    width: 380,
    height: 380,
    marginBottom: 7, // Reduzi o espaço entre a logo e a frase
    marginTop: -70,
  },
  tagline: {
    color: '#304269', // Cor do texto da frase
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30, // Adicionado espaço abaixo da frase
    marginTop: -5,
    fontFamily: 'Inter-Medium',
    width: 400,
  },
  startButton: {
    backgroundColor: '#304269', // Cor de fundo do botão
    paddingVertical: 21,
    paddingHorizontal: 145,
    borderRadius: 30, // Aumentei o raio para tornar mais arredondado
    marginTop: 45,
  },
  buttonText: {
    color: '#FFFFFF', // Cor do texto do botão
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-bold',
  },
});

export default SplashScreen;
