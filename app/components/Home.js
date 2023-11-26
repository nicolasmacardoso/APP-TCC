import React, { useState, useEffect } from 'react';
import { Animated, View, ScrollView, StyleSheet, Text, TextInput, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const Home = () => {
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [userNames, setUserNames] = useState({});

  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  const fetchUserData = async (codusuario) => {
    try {
      const userResponse = await axios.get(`https://cima-production.up.railway.app/usuario/${codusuario}`);
  
      // Log detalhes da resposta da API
      console.log('Resposta da API:', userResponse);
  
      // Verifique se a resposta contém dados
      if (userResponse.data && userResponse.data.length > 0) {
        const userName = userResponse.data[0].nome;
        console.log('Nome do usuário obtido com sucesso:', userName);
  
        // Atualize o estado com o nome do usuário
        return userName;
      } else {
        console.error('Dados do usuário não encontrados na resposta da API');
        return 'Usuário Desconhecido';
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error.response?.data || error.message);
      return 'Usuário Desconhecido';
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cima-production.up.railway.app/postagem');
        const postsWithUserDetails = await Promise.all(
          response.data.map(async (post) => {
            try {
              const userName = await fetchUserData(post.codusuario);
              console.log(post.codusuario);
              if (typeof userName === 'string') {
                return { ...post, userName };
              } else {
                return post;
              }
            } catch (userError) {
              console.error('Erro ao obter detalhes do usuário:', userError);
              return { ...post, userName: 'Usuário Desconhecido' };
            }
          })
        );
        setPosts(postsWithUserDetails);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const timeDiff = now - postTime;

    const minutes = Math.floor(timeDiff / (1000 * 60));

    if (minutes < 60) {
      return `${minutes} min atrás`;
    } else {
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return `${hours}h atrás`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days}d atrás`;
      }
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [70, 20],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisa"
          placeholderTextColor="#8E94AF"
        />
        <View style={styles.searchIcon}>
          <FontAwesome name="search" size={20} color="#304269" />
        </View>
      </View>
      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={20}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.postContainer}>
          {posts.map((post) => (
             <TouchableWithoutFeedback
             key={post.id}
             onPress={() => {
              navigation.navigate('Postagem', { postId: post.id });
            }}
             >
            <View key={post.id} style={styles.post}>
              <View style={styles.postHeader}>
                <Image source={{ uri: base64ToImage(post.imagem) }} style={styles.userImage} />
                <Text style={styles.postAutor} numberOfLines={1}>{post.userName}</Text>
              </View>
              <Image source={{ uri: base64ToImage(post.imagem) }} style={styles.postImage} />
              <Text style={styles.postTitle} numberOfLines={2} ellipsizeMode="tail">{post.titulo}</Text>
              <Text style={styles.postInfo}>Postado a {formatTimeAgo(post.timestamp)}</Text>
            </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 50,
    paddingBottom: 30,
    backgroundColor: '#304269',
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
  postContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  post: {
    width: '48%',
    aspectRatio: 0.7,
    borderRadius: 8,
    marginBottom: 30,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 5, // Ajuste conforme necessário
    marginRight: 8,
  },
  postImage: {
    width: '100%',
    height: '70%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  postTitle: {
    fontSize: 17,
    color: '#3E5481',
    fontFamily: 'Inter-Extrabold',
    fontWeight: 'bold',
    padding: 8,
    paddingLeft: -8,
    textAlign: 'left',
  },
  postInfo: {
    fontSize: 12,
    color: '#9FA5C0',
    textAlign: 'left',
  },
  postAutor: {
    fontSize: 13,
    width: 140,
    color: '#3E5481',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});

export default Home;