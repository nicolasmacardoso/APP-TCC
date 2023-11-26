import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLogin } from '../context/LoginProvider';
import { FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';

const Perfil = () => {
  const { profileUpdateKey, profile, userId, registerProfileImageCallback, updateProfileImage } = useLogin();
  const [profileImage, setProfileImage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Novo estado para forçar remontagem
  const [posts, setPosts] = useState([]);

  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
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
  }, [profileUpdateKey, userId]);

  useEffect(() => {
    // Lógica para obter as postagens do usuário
    const fetchPosts = async () => {
      try {
        const apiUrl = `https://cima-production.up.railway.app/postagem?codusuario=${userId}`;
/*         console.log(`Trying to fetch posts from: ${apiUrl}`);
 */  
        const response = await axios.get(apiUrl);
        setPosts(response.data);
      } catch (error) {
        console.error('Erro ao obter postagens:', error);
      }
    };

    fetchPosts();
    const intervalId = setInterval(fetchPosts, 5000);

    // Limpa o intervalo quando o componente é desmontado para evitar vazamentos de memória
    return () => clearInterval(intervalId);
  }, [userId]);
  

  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.05,
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
          usuario: profile.usuario,
          senha: profile.senha,
          email: profile.email,
          cpf: profile.cpf,
          numero_casa: profile.numero_casa,
          rua: profile.rua,
          complemento: profile.complemento,
          codbairro: profile.codbairro,
        });

        if (response.status === 200) {
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

  const renderProfileImage = () => {
    if (profileImage.length > 100) {
      return (
        <Image
          source={{ uri: profileImage }}
          style={{ width: 175, height: 175, borderRadius: 100, borderWidth: 5, borderColor: '#304269'}}
        />
      );
    } else {
      return (
        <View style={{ width: 175, height: 175, borderRadius: 100, backgroundColor: '#FFFFFF', borderColor: '#304269', borderWidth: 4}}>
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

  return (
    <ScrollView 
      style={styles.container}
      bounces={false}>
      <View style={styles.profileContainer}>
        <View style={styles.blueBackground}></View>
        <View style={styles.fotoPerfil}>
          <TouchableOpacity onPress={pickImage}>
            {renderProfileImage()}
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{profile.usuario}</Text>
        <Text style={styles.profileNome}>{profile.nome}</Text>
        <View style={styles.publicationsContainer}>
          <Text style={styles.publicationsText}> Minhas Publicações</Text>
          <View style={styles.Line2} />
          <View style={styles.Line} />
        </View>
      </View>
      <View style={styles.postContainer}>
        {posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <Image source={{ uri: base64ToImage(post.imagem) }} style={styles.postImage} />
            <Text style={styles.postTitle} numberOfLines={2} ellipsizeMode="tail">{post.titulo}</Text>
            <Text style={styles.postInfo}>{formatTimeAgo(post.timestamp)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blueBackground: {
    backgroundColor: '#304269',
    height: '100%', // Ajuste conforme necessário
    position: 'absolute',
    top: -210,
    left: 0,
    right: 0,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 84,
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
    color: '#304269',
  },
  profileNome: {
    fontSize: 14,
    color: '#304269',
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
    color: '#304269',
    marginTop: 0,
    bottom: -24,
    marginLeft: -7,
    textAlign: 'center',
  },
  Line: {
    width: 230,
    height: 3,
    backgroundColor: '#F26101',
    marginTop: 5,
    marginLeft: 5,
    position: 'fixed',
    bottom: -24,
  },
  Line2: {
    width: 450,
    height: 3,
    backgroundColor: '#EEEEEE',
    marginTop: 0,
    position: 'absolute',
    bottom: -24,
  },
});

export default Perfil;
