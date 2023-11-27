import React, { useState, useEffect } from 'react';
import { Animated, View, ScrollView, StyleSheet, Text, TextInput, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLogin } from '../context/LoginProvider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const Home = () => {
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { userBairro } = useLogin();


  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://cima-production.up.railway.app/postagem/bairro/${userBairro}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [userBairro]);

  const handleSearchChange = (text) => {
    setSearchTerm(text);
  };

  const formatTimeAgo = (timestamp) => {
    const postTime = new Date(timestamp);
  
    // Diferença em milissegundos entre a data atual e a data da postagem
    const timeDiff = new Date() - postTime;
  
    // Converter a diferença para minutos
    const minutes = Math.floor(timeDiff / (1000 * 60));
  
    if (minutes < 1) {
      return 'Agora mesmo';
    } else if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days}d atrás`;
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisa"
          placeholderTextColor="#8E94AF"
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
        <View style={styles.searchIcon}>
          <FontAwesome name="search" size={20} color="#304269" />
        </View>
      </View>
      <Text style={styles.tituloCodBairro}>Código do bairro: {userBairro}</Text>

      <ScrollView style={styles.Scrollcontainer} bounces={false}>
        <View style={styles.postContainer}>
          {filteredPosts.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Image
                source={require('../Imagens/EmojiChorando.png')}
                style={styles.noPostsImage}
              />
              <Text style={styles.noPostsText}>Nenhuma postagem encontrada.</Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <TouchableWithoutFeedback
                key={post.id}
                onPress={() => navigation.navigate('Postagem', { 
                  postId: post.id,
                  postTitulo: post.titulo, 
                  postImagem: post.imagem, 
                  postNomeUsuario: post.nome_usuario, 
                  postImagemUsuario: post.imagem_usuario,
                  postDescricao: post.descricao,
                })}
              >
                <View key={post.id} style={styles.post}>
                  <View style={styles.postHeader}>
                    {post.imagem_usuario ? (
                      <Image source={{ uri: base64ToImage(post.imagem_usuario) }} style={styles.userImage} />
                    ) : (
                      <FontAwesome name="user-circle" size={50} color="#9FA5C0" style={styles.defaultUserIcon} />
                    )}
                    <Text style={styles.postAutor}>{post.nome_usuario}</Text>
                  </View>
                    <Image source={{ uri: base64ToImage(post.imagem) }} style={styles.postImage} />
                    <Text style={styles.postTitle} numberOfLines={2} ellipsizeMode="tail">{post.titulo}</Text>
                    <Text style={styles.postInfo}>Postado a {formatTimeAgo(post.data)}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Scrollcontainer: {
    height: 1000,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 50,
    paddingBottom: 30,
    backgroundColor: '#3E5481',
    paddingTop: 70,
  },
  searchIcon: {
    position: 'absolute',
    left: 70,
    top: 109,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: 20,
    height: 60,
    marginTop: 20,
    borderRadius: 50,
    paddingLeft: 60,
  },
  tituloCodBairro: {
    color: '#fff',
    width: '100%',
    fontSize: 20,
    fontFamily: 'Inter-bold',
    paddingLeft: 110,
    paddingVertical: 10,
    backgroundColor: '#354279',
  },  
  postContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPostsImage: {
    marginTop: 150,
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noPostsText: {
    fontSize: 20,
    width: 300,
    color: '#3E5481',
    fontFamily: 'Inter-bold',
    textAlign: 'center',
  },
  post: {
    width: '48%',
    backgroundColor: '#304269',
    aspectRatio: 0.6,
    borderRadius: 10,
    marginBottom: 30,
    paddingBottom: 75,
    borderColor: '#304269',
    borderWidth: 5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 16,
    marginRight: 8,
  },
  postAutor: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    textAlign: 'left',
  },
  postImage: {
    width: '100%',
    height: '70%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  postTitle: {
    fontSize: 17,
    color: '#fff',
    fontFamily: 'Inter-Extrabold',
    fontWeight: 'bold',
    padding: 8,
    paddingLeft: -8,
    textAlign: 'left',
  },
  postInfo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'left',
  },
});

export default Home;
