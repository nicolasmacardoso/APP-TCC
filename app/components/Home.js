import React, { useState, useEffect } from 'react';
import { Animated, View, ScrollView, StyleSheet, Text, TextInput, Dimensions, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const windowWidth = Dimensions.get('window').width;

const App = () => {
  const [posts, setPosts] = useState([]);
  const [nome, setNome] = useState([]);
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  const decodeBase64Image = (base64String) => {
    if (!base64String) {
      return null;
    }

    const uri = `data:image/jpeg;base64,${base64String}`;
    return uri;
  };
  useEffect(() => {
    axios.get('https://cima-production.up.railway.app/postagem')
      .then(response => {
        console.log('Resposta da API:', response.data);
        setPosts(response.data);
      })
      .catch(error => console.error('Erro ao buscar postagens:', error));

      axios.get(`https://cima-production.up.railway.app/usuario/${posts.id}`)
      .then(response => {
        setNome(response.data);
      })
      .catch(error => console.error('Erro ao buscar postagens:', error));
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const timeDiff = now - postTime;

    // Convert timeDiff to minutes
    const minutes = Math.floor(timeDiff / (1000 * 60));

    if (minutes < 60) {
      return `${minutes} min ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return `${hours}h ago`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
      }
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50], // Ou qualquer valor desejado
    outputRange: [70, 20],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.searchBar, paddingTop: headerHeight }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisa"
          placeholderTextColor="#8E94AF"
        />
        <View style={styles.searchIcon}>
          <FontAwesome name="search" size={20} color="#304269" />
        </View>
      </Animated.View>
      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.postContainer}>
          {posts.map((post) => (
            <View key={post.id} style={styles.post}>
              <Image source={{ uri: decodeBase64Image(post.imageUrl) }} style={styles.postImage} />
              <Text style={styles.postTitle} numberOfLines={2} ellipsizeMode="tail">{post.descricao}</Text>
              <Text style={styles.postInfo}>{formatTimeAgo(post.timestamp)} • {nome.usuario}</Text>
            </View>
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
    backgroundColor: '#304269',
    paddingTop: 125,
  },
  searchIcon: {
    position: 'absolute',
    left: 70,
    top: 89,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: 20,
    height: 60,
    borderRadius: 50,
    paddingLeft: 60,
  },
  postContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  post: {
    width: '48%', // 2% menos para a margem entre os quadrados
    aspectRatio: 0.7, // Mantendo a proporção 1:1 para ser um quadrado
    borderRadius: 8,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: '70%', // Ajuste a altura conforme necessário
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  postInfo: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});

export default App;
