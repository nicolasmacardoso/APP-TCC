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

  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cima-production.up.railway.app/postagem');
        setPosts(response.data);
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
              onPress={() => navigation.navigate('Postagem', { postId: post.id })}
            >
              <View key={post.id} style={styles.post}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: base64ToImage(post.imagem_usuario) }} style={styles.userImage} />
                  <Text style={styles.postAutor}>{post.nome_usuario}</Text>
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
    width: 50,
    height: 50,
    borderRadius: 16,
    marginRight: 8,
  },
  postAutor: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3E5481',
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
});

export default Home;
