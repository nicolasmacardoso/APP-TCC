import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Home from './components/Home';
import CriarPosts from './components/CriarPosts';
import { useLogin } from './context/LoginProvider';

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const { setIsLoggedIn, profile, user } = useLogin();

  console.log('user:', user);

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
      if (index === 0 || index === words.length - 1 || !prepositions.includes(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word.toLowerCase();
      }
    });
    const truncatedName = filteredWords.join(' ');

    return truncatedName.substring(0, maxLength);
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
          <Image
            source={{
              uri: profile?.avatar ||
                'https://images.unsplash.com/photo-1624243225303-261cc3cd2fbc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <View>
            <Text>{truncateString(user?.nome || "", 24)}</Text>
            <Text>{truncateString(user?.email || "", 20)}</Text>
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
          backgroundColor: '#FAB550',
          padding: 20,
        }}
        onPress={() => setIsLoggedIn(false)}
      >
        <Text>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
