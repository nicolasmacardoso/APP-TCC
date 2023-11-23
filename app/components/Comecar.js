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
      {/* Insira a imagem da sua logo aqui */}
      <Image
        source={require('./CimaLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Frase abaixo da logo */}
      <Text style={styles.tagline}>
        Unindo o Bairro, Notícia a Notícia, Coração a Coração.
      </Text>

      {/* Botão Iniciar */}
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
    width: 340,
    height: 340,
    marginBottom: 15, // Reduzi o espaço entre a logo e a frase
  },
  tagline: {
    color: '#304269', // Cor do texto da frase
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30, // Adicionado espaço abaixo da frase
    marginTop: -5,
  },
  startButton: {
    backgroundColor: '#304269', // Cor de fundo do botão
    paddingVertical: 18,
    paddingHorizontal: 145,
    borderRadius: 30, // Aumentei o raio para tornar mais arredondado
    marginTop: 75,
  },
  buttonText: {
    color: '#FFFFFF', // Cor do texto do botão
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
