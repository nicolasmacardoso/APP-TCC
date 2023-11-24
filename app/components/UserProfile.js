import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLogin } from '../context/LoginProvider';
import { FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';

const Perfil = () => {
  const { profile, userId, registerProfileImageCallback, updateProfileImage } = useLogin();
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Novo estado para forçar remontagem

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
    { id: 12, content: 'Post 12', timestamp: new Date().toISOString(), imageUrl: 'https://placekitten.com/210/210', author: 'Leo' },
  ]);

  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    console.log('UserProfile - Component mounted');
  }, [refreshKey]);

  useEffect(() => {
    const imageLength = profile?.imagem ? profile?.imagem.length : 0;
    console.log(`UserProfile - profile.imagem length: ${imageLength}`);
    const profileData = {
      usuario: profile.usuario,
      avatar: profile.imagem,
    };
  
    setUserName(profileData.usuario);
    setProfileImage(base64ToImage(profileData.avatar));
  }, [profile]);
  

  useEffect(() => {
    console.log('UserProfile - Setting profileImage callback');
    const callback = (newImage) => {
      setProfileImage(base64ToImage(newImage));
      console.log('UserProfile - profileImageCallback called');
    };
  
    registerProfileImageCallback(callback);
  
    return () => {
      registerProfileImageCallback(null);
    };
  }, [refreshKey]);

  const renderProfileImage = () => {
    if (profileImage) {
      return (
        <Image
          source={{ uri: profileImage }}
          style={{ width: 175, height: 175, borderRadius: 100, borderWidth: 5, borderColor: '#3E5481'}}
        />
      );
    } else {
      return (
        <View style={{ width: 175, height: 175, borderRadius: 100, backgroundColor: '#FFFFFF', borderColor: '#3E5481', borderWidth: 4}}>
          <FontAwesome name="user-circle" size={166.999} color="#757575" />
        </View>
      );
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result.split(",")[1]);
        };
        reader.readAsDataURL(blob);
      });
      return base64;
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;

        const base64Image = await convertImageToBase64(selectedImageUri);

        const response = await axios.patch(`https://cima-production.up.railway.app/usuario/${userId}`, 
        { 
          imagem: base64Image,
          nome: profile.nome,
          usuario: userName,
          senha: profile.senha,
          email: profile.email,
          cpf: profile.cpf,
          numero_casa: profile.numero_casa,
          rua: profile.rua,
          complemento: profile.complemento,
          codbairro: profile.codbairro,
        });

        if (response.status === 200) {
          // Chama a função de atualização de imagem no contexto
          updateProfileImage(base64Image);

          console.log('UserProfile - Callback after updating image called');
          Alert.alert('Imagem atualizada com sucesso!');
        } else {
          Alert.alert('Erro ao enviar a imagem', 'A imagem não pôde ser enviada.');        
        }
      }
    } catch (error) {
      Alert.alert('Erro ao selecionar a imagem', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          {renderProfileImage()}
        </TouchableOpacity>
        <Text style={styles.profileName}>{userName}</Text>
        <View style={styles.publicationsContainer}>
          <Text style={styles.publicationsText}> Minhas Publicações</Text>
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
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 20,
    position: 'relative', // Adicionado para posicionar corretamente o conteúdo fixo
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 200,
    resizeMode: 'cover',
  },
  profileName: {
    marginTop: 30,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3E5481',
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
    color: '#3E5481',
    marginTop: 0,
    bottom: -24,
    width: '100%',
    textAlign: 'center',
  },
  blueLine: {
    width: 200,
    height: 3,
    backgroundColor: '#F26101',
    marginTop: 0,
    position: 'fixed',
    bottom: -24,
  },
});

export default Perfil;