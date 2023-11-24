import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [profileImagem, setProfileImagem] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profileImageCallback, setProfileImageCallback] = useState(null);
  const [profileUpdateKey, setProfileUpdateKey] = useState(0);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setProfile(parsedUser);
          setUserId(parsedUser.id);
          setProfileImagem(parsedUser.imagem);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error('Erro ao carregar usuário do AsyncStorage:', e);
      }

      setLoading(false);
    };

    loadUserFromStorage();
  }, [profileUpdateKey]);

  const login = async (user) => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(user));

      setProfile(user);
      setUserId(user.id);
      setProfileImagem(user.imagem);

      if (profileImageCallback) {
        profileImageCallback(user.imagem);
      }

      setIsLoggedIn(true);
    } catch (e) {
      console.error('Erro ao salvar usuário no AsyncStorage:', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user');

      setProfile({});
      setUserId(null);
      setProfileImagem(null);
      setIsLoggedIn(false);
    } catch (e) {
      console.error('Erro ao remover usuário do AsyncStorage:', e);
    }
  };

  const registerProfileImageCallback = (callback) => {
    console.log('LoginProvider - registerProfileImageCallback called');
    setProfileImageCallback(() => callback);
  };

  const updateProfileImage = (newImage) => {
    try {
      setProfile((prevProfile) => ({
        ...prevProfile,
        imagem: newImage,
      }));

      if (profileImageCallback) {
        profileImageCallback(newImage);
      }

      setProfileUpdateKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Erro ao atualizar imagem do perfil:', error);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        profile,
        setProfile,
        profileImagem,
        setProfileImagem,
        login,
        logout,
        loading,
        userId,
        registerProfileImageCallback,
        updateProfileImage,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
