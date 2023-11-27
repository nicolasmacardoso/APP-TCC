
import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importe o FontAwesome

const Postagem = ({ route }) => {
  const { postId, postTitulo, postDescricao, postImagemUsuario, postNomeUsuario, postImagem } = route.params;

  const post = {
    id: postId,
    titulo: postTitulo,
    conteudo: postDescricao,
    imagemUsuario: postImagemUsuario,
    nomeUsuario: postNomeUsuario,
    imagemPost: postImagem,
    timestamp: Date.now(),
  };

  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  console.log(post.id, post.titulo, post.nomeUsuario, post.conteudo );
  return (
    <View style={styles.container}>
      <View style={styles.postagemContainer}>

      <View style={styles.backgroundPost}></View>

        <Image source={{ uri: base64ToImage(post.imagemPost) }} style={styles.imagemPost} />

        <View style={styles.usuarioContainer}>
          {post.imagemUsuario ? (
            <Image source={{ uri: base64ToImage(post.imagemUsuario) }} style={styles.imagemUsuario} />
          ) : (
            <FontAwesome name="user-circle" size={40} color="#9FA5C0" style={styles.defaultUserIcon} />
          )}
          <Text style={styles.nomeUsuario}>{post.nomeUsuario}</Text>
        </View>

        <Text style={styles.titulo}>{post.titulo}</Text>
        <Text style={styles.conteudo}>{post.conteudo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postagemContainer: {
    padding: 20,
    marginTop: 100,
    alignItems: 'center',
  },
  imagemPost: {
    width: 375,
    height: 375,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 8,
    borderColor: '#304269',
  },
  backgroundPost: {
    width: 500,
    height: 400,
    top: -320,
    position: 'absolute',
    backgroundColor: '#304269',
  },
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagemUsuario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    marginLeft: -190,
  },
  nomeUsuario: {
    fontSize: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  conteudo: {
    fontSize: 18,
  },
});

export default Postagem;