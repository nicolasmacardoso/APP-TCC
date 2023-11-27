import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppForm from './components/AppForm';
import UserProfile from './components/UserProfile';
import DrawerNavigator from './DrawerNavigator';
import SplashScreen from './components/Comecar';
import Home from './components/Home';
import Postagem from './components/Postagem';
import { useLogin } from './context/LoginProvider';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { isLoggedIn } = useLogin();

  return (
    <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="Postagem" component={Postagem} />
        </>
      ) : (
        <>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="AppForm" component={AppForm} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
