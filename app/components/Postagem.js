import React from 'react';
import { View, Text } from 'react-native';

const Postagem = ({ route }) => {
  const { postId } = route.params;

  // Implemente a lógica para carregar os detalhes da postagem com base no postId

  return (
    <View>
      <Text>Detalhes da Postagem {postId}</Text>
      {/* Restante do conteúdo da tela de postagem */}
    </View>
  );
};

export default Postagem;
