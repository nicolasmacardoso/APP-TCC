import React from 'react';
import { View, Text } from 'react-native';

const Postagem = ({ route }) => {
  const { postId } = route.params;

  return (
    <View>
      <Text>Detalhes da Postagem {postId}</Text>
      {/* Restante do conteúdo da tela de postagem */}
    </View>
  );
};

export default Postagem;
