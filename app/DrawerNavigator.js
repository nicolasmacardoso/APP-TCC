import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { FontAwesome } from '@expo/vector-icons';

import Home from './components/Home';
import CriarPosts from './components/CriarPosts';
import { useLogin } from './context/LoginProvider';
import ChatPrincipal from './components/ChatPrincipal';
import UserProfile from './components/UserProfile';

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const { setIsLoggedIn, profile, registerProfileImageCallback } = useLogin();
  const [profileImage, setProfileImage] = useState('');

  const base64ToImage = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    const imageLength = profile?.imagem ? profile?.imagem.length : 0;
    console.log(`CustomDrawer - profile.imagem length: ${imageLength}`);
    setProfileImage(base64ToImage(profile?.imagem || ''));
  }, [profile?.imagem]); // Removido updateProfile como dependência

  useEffect(() => {
    const callback = (newImage) => {
      setProfileImage(base64ToImage(newImage));
    };

    // Registra o callback diretamente
    registerProfileImageCallback(callback);

    // Remove o callback quando o componente é desmontado
    return () => {
      registerProfileImageCallback(null);
    };
  }, []); // [] significa que este useEffect é executado apenas uma vez, sem dependências

  const renderProfileImage = () => {
    if (profileImage.length > 30) {
      return (
        <Image
          source={{ uri: profileImage }}
          style={{ width: 80, height: 80, borderRadius: 100, borderWidth: 5, borderColor: '#3E5481' }}
        />
      );
    } else {
      return (
        <View style={{ width: 80, height: 80, borderRadius: 50, backgroundColor: '#FFFFFF', borderColor: '#76bbff', borderWidth: 4 }}>
          <FontAwesome name="user-circle" size={71.999} color="#757575" />
        </View>
      );
    }
  };

  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
      const prepositions = ['de', 'da', 'das', 'dos', 'do'];
      if (str.includes('@')) {
        const [username, domain] = str.split('@');
        const truncatedUsername = truncateName(username, maxLength - domain.length - 3, prepositions);
        return truncatedUsername.toLowerCase() + '...@' + domain;
      } else {
        return str.toLowerCase().substring(0, maxLength - 3) + '...';
      }
    }
    return str.toLowerCase();
  };

  const truncateName = (name, maxLength, prepositions) => {
    const words = name.split(' ');
    const filteredWords = words.map((word, index) => {
      const lowerCasedWord = word.toLowerCase();
      if (index === 0 || index === words.length - 1 || !prepositions.includes(lowerCasedWord)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return lowerCasedWord;
      }
    });
    const truncatedName = filteredWords.join(' ');

    return truncatedName.substring(0, maxLength) + '...';
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#FAB550',
            marginBottom: 20,
          }}
        >
          {renderProfileImage()}
          <View>
            <Text>{truncateName(profile?.nome || '', 18, ['de', 'da', 'das', 'dos', 'do'])}</Text>
            <Text>{truncateString(profile?.email || '', 18)}</Text>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          left: 0,
          bottom: 50,
          backgroundColor: '#304269',
          padding: 20,
        }}
        onPress={() => setIsLoggedIn(false)}
      >
        <Text  style={{fontSize: 20,}}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerNavigator = () => {
  const { profile } = useLogin();
  const [profileChanged, setProfileChanged] = useState(false);
  const [drawerKey, setDrawerKey] = useState(0);

  useEffect(() => {
    const imageLength = profile?.imagem ? profile?.imagem.length : 0;
    console.log(`DrawerNavigator - profile.imagem length: ${imageLength}`);

    if (profileChanged) {
      // Atualiza o Drawer quando o perfil é alterado
      setDrawerKey((prevKey) => prevKey + 1);
      setProfileChanged(false); // Reseta o sinalizador de alteração
    }

  }, [profile, profileChanged]); // Adicionada a dependência profileChanged

  useEffect(() => {
    const profileChangeListener = () => {
      // Sinaliza que o perfil foi alterado
      setProfileChanged(true);
    };

    // Adiciona o ouvinte para mudanças no perfil
    // Não é necessário remover o ouvinte ao desmontar, pois o contexto cuida disso
    profileChangeListener();

  }, []);

  const DrawerComponent = (
    <Drawer.Navigator
      key={drawerKey}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitle: '',
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen component={Home} name='Home' />
      <Drawer.Screen component={CriarPosts} name='Criar Publicação' />
      <Drawer.Screen component={ChatPrincipal} name='Bate-Papo' />
      <Drawer.Screen component={UserProfile} name='Meu Perfil' />
    </Drawer.Navigator>
  );

  return DrawerComponent;
};

export default DrawerNavigator;
