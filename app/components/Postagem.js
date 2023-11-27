import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

const Postagem = ({ route }) => {
  const { postId, postTitulo, postDescricao, postImagemUsuario, postNomeUsuario, postImagem } = route.params;

  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);

  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  const adicionarComentario = () => {
    if (comentario.trim() !== '') {
      setComentarios([...comentarios, { usuario: 'Seu Nome', texto: comentario }]);
      setComentario('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postagemContainer}>
        <View style={styles.backgroundPost}></View>

        <Image source={{ uri: base64ToImage(postImagem) }} style={styles.imagemPost} />

        <View style={styles.usuarioContainer}>
          <Image source={{ uri: base64ToImage(postImagemUsuario) }} style={styles.imagemUsuario} />
          <Text style={styles.nomeUsuario}>{postNomeUsuario}</Text>
        </View>

        <Text style={styles.titulo}>{postTitulo}</Text>
        <Text style={styles.conteudo}>{postDescricao}</Text>

        {/* Formulário de Comentário */}
        <View style={styles.comentarioContainer}>
          <TextInput
            style={styles.inputComentario}
            placeholder="Adicione um comentário..."
            value={comentario}
            onChangeText={(text) => setComentario(text)}
          />
          <TouchableOpacity style={styles.botaoComentario} onPress={adicionarComentario}>
            <Text style={styles.textoBotaoComentario}>Comentar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Comentários */}
        <View style={styles.listaComentarios}>
          {comentarios.map((comentario, index) => (
            <View key={index} style={styles.comentarioItem}>
              <Text style={styles.nomeUsuarioComentario}>{comentario.usuario}</Text>
              <Text style={styles.textoComentario}>{comentario.texto}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  comentarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  inputComentario: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  botaoComentario: {
    backgroundColor: '#304269',
    borderRadius: 8,
    paddingVertical: 8,
  },
  textoBotaoComentario: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listaComentarios: {
    marginTop: 16,
  },
  comentarioItem: {
    marginBottom: 8,
  },
  nomeUsuarioComentario: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textoComentario: {
    marginLeft: 8,
  },
});

export default Postagem;
/* Sem comentários: import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';

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
          <Image source={{ uri: base64ToImage(post.imagemUsuario)}} style={styles.imagemUsuario} />
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
 */