import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AppForm from './components/AppForm';
import UserProfile from './components/UserProfile';
import { useLogin } from './context/LoginProvider';
import DrawerNavigator from './DrawerNavigator';
import SplashScreen from './components/Comecar';
import Postagem from './components/Postagem'; // Importe a tela de postagem
import Home from './components/Home';
import App from '../App';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Postagem" component={Postagem} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="AppForm" component={AppForm} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
  </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isLoggedIn } = useLogin();
  return isLoggedIn ? <DrawerNavigator /> : <StackNavigator />;
};
export default MainNavigator;
