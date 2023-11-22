import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions, Image } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Perfil = () => {
  const [profileImage, setProfileImage] = useState('https://placekitten.com/201/201');
  const [userName, setUserName] = useState('Piscosin Da Silva');

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
    { id: 11, content: 'Post 11', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/210/210', author: 'Karen' },
    { id: 12, content: 'Post 12', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/211/211', author: 'Leo' },
    // Adicione mais postagens conforme necessário
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <Text style={styles.profileName}>{userName}</Text>
        <View style={styles.publicationsContainer}>
          <Text style={styles.publicationsText}> Suas Publicações</Text>
          <View style={styles.blueLine} />
        </View>
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
    backgroundColor: '#FFA500',
    elevation: 4,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 16,
    position: 'relative', // Adicionado para posicionar corretamente o conteúdo fixo
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 200,
    resizeMode: 'cover',
  },
  profileName: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  postContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  post: {
    width: '48%',
    aspectRatio: 0.7,
    backgroundColor: '#ADD8E6',
    borderRadius: 8,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: '70%',
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
  publicationsContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  publicationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 0,
    bottom: -24,
    width: '100%',
    textAlign: 'center',
  },
  blueLine: {
    width: 200,
    height: 3,
    backgroundColor: '#0000FF',
    marginTop: 0,
    position: 'fixed',
    bottom: -24,
  },
});

export default Perfil;
