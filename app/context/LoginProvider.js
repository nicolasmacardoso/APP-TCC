import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user');

        if (storedUser) {
          setProfile(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error('Erro ao carregar usuário do AsyncStorage:', e);
      }

      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (user) => {
    try {
      // Adiciona lógica para armazenar o usuário no AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(user));

      setProfile(user);
      setIsLoggedIn(true);

      console.log('Usuário logado:', user);

    } catch (e) {
      console.error('Erro ao salvar usuário no AsyncStorage:', e);
    }
  };

  const logout = async () => {
    try {
      // Adiciona lógica para remover o usuário do AsyncStorage ao sair
      await AsyncStorage.removeItem('@user');

      setProfile({});
      setIsLoggedIn(false);
    } catch (e) {
      console.error('Erro ao remover usuário do AsyncStorage:', e);
    }
  };

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, profile, setProfile, login, logout, loading }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
