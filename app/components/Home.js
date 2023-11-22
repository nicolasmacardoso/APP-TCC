import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, Dimensions, Image } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const App = () => {
  const [posts, setPosts] = useState([
    { id: 1, content: 'Post 1 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/200/200', author: 'Alice' },
    { id: 2, content: 'Post 2', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/201/201', author: 'Bob' },
    { id: 3, content: 'Post 3 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/202/202', author: 'Charlie' },
    { id: 4, content: 'Post 4', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/203/203', author: 'David' },
    { id: 5, content: 'Post 5 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/204/204', author: 'Eva' },
    { id: 6, content: 'Post 6', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/205/205', author: 'Frank' },
    { id: 7, content: 'Post 7 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/206/206', author: 'Grace' },
    { id: 8, content: 'Post 8', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/207/207', author: 'Henry' },
    { id: 9, content: 'Post 9 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/208/208', author: 'Ivy' },
    { id: 10, content: 'Post 10', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/209/209', author: 'Jack' },
    { id: 11, content: 'Post 9 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/208/208', author: 'Ivy' },
    { id: 12, content: 'Post 10', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/209/209', author: 'Jack' },
    { id: 13, content: 'Post 6', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/205/205', author: 'Frank' },
    { id: 14, content: 'Post 7 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/206/206', author: 'Grace' },
    { id: 15, content: 'Post 8', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/207/207', author: 'Henry' },
    { id: 16, content: 'Post 9 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/208/208', author: 'Ivy' },
    { id: 17, content: 'Post 10', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/209/209', author: 'Jack' },
    { id: 18, content: 'Post 9 com um título mais longo para testar a quebra de linha', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/208/208', author: 'Ivy' },
    { id: 19, content: 'Post 10', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/209/209', author: 'Jack' },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={{ ...styles.searchBar, marginTop: 60, marginBottom: 10 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
        />
      </View>
      <View style={styles.postContainer}>
        {posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            <Text style={styles.postTitle} numberOfLines={2} ellipsizeMode="tail">{post.content}</Text>
            <Text style={styles.postInfo}>{formatTimeAgo(post.timestamp)} • {post.author}</Text>
          </View> 
        ))}
      </View>
    </ScrollView>
  );
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
  },
  searchBar: {
    padding: 16,
    backgroundColor: '#FFA500', // Laranja
    elevation: 4,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    placeholderColor: '#343433',
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
