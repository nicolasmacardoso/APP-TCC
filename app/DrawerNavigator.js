import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
  const { setIsLoggedIn, profile, registerProfileImageCallback, logout } = useLogin();
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
          style={{ width: 80, height: 80, borderRadius: 100, borderWidth: 4, borderColor: '#6180BF', marginLeft: -5}}
        />
      );
    } else {
      return (
        <View style={{ width: 80, height: 80, borderRadius: 50, backgroundColor: '#FFFFFF', borderColor: '#6180BF', borderWidth: 4, marginLeft: -5}}>
          <FontAwesome name="user-circle" size={72.333} color="#757575" />
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
  
    if (truncatedName.length > maxLength) {
      return truncatedName.substring(0, maxLength)  + '...';
    } else {
      return truncatedName;
    }
  };

  const logoutHandler = async () => {
    await logout(); // Chama a função logout para realizar as ações de logout necessárias
    // Outras ações de logout que você pode precisar fazer
    setIsLoggedIn(false); // Defina o estado de login como falso
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} bounces={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 24,
            paddingTop: 100,
            backgroundColor: '#304269',
            marginTop: -76,
            marginBottom: 50,
          }}
        >
          {renderProfileImage()}
          <View>
            <Text style={styles.infoUser}>
              {truncateName(profile?.nome || '', 18, ['de', 'da', 'das', 'dos', 'do'])}
            </Text >
            <Text style={styles.infoUser}>
              {truncateString(profile?.email || '', 18)}
              </Text>
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
        onPress={logoutHandler}
      >
        <Text  style={{fontSize: 20, color: '#fff', fontFamily: 'Inter-bold', paddingLeft: 50}}>Sair</Text>
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
        drawerLabelStyle: {
          color: '#304269', // Cor do texto do item do menu
        },
        drawerActiveBackgroundColor: '#FFE2D1', // Cor de fundo quando a página está ativa
        drawerInactiveBackgroundColor: '#fff', // Cor de fundo quando a página não está ativa
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        component={Home}
        name='Home'
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome name="home" size={30} color="#304269" />
          ),
        }}
      />
      <Drawer.Screen
        component={CriarPosts}
        name='Criar Publicação'
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome name="pencil" size={30} color="#304269" />
          ),
        }}
      />
      <Drawer.Screen
        component={ChatPrincipal}
        name='Bate-Papo'
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome name="comments-o" size={30} color="#304269" /> // Mudando a cor para verde
          ),
        }}
      />
      <Drawer.Screen
        component={UserProfile}
        name='Meu Perfil'
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome name="user" size={30} color="#304269" />
          ),
        }}
      />
    </Drawer.Navigator>
  );

  return DrawerComponent;
};

const styles = StyleSheet.create({
  infoUser: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
  }
})

export default DrawerNavigator;
