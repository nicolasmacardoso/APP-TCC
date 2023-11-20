import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import client from '../api/client';
import { useLogin } from '../context/LoginProvider';
import { isValidEmail, isValidObjField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';

const LoginForm = () => {
  const { setIsLoggedIn, setProfile } = useLogin();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const { email, password } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError('Preencha todos os campos.', setError);

    if (!isValidEmail(email)) return updateError('Email inválido.', setError);

    if (!password.trim() || password.length < 8)
      return updateError('Senha muito curta.', setError);

    return true;
  };

  const submitForm = async () => {
    if (isValidForm()) {
      try {
        const res = await client.post('/sign-in', { ...userInfo });

        if (res.data.success) {
          setUserInfo({ email: '', password: '' });
          setProfile(res.data.usuario);
          setIsLoggedIn(true);
        }
        setIsLoggedIn(true);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(true);
      }
    }
  };

  return (
    <FormContainer>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
      <FormInput
        value={email}
        onChangeText={value => handleOnChangeText(value, 'email')}
        label='Email'
        placeholder='Digite seu email...'
        autoCapitalize='none'
        placeholderTextColor="#A9A9A9"
      />
      <FormInput
        value={password}
        onChangeText={value => handleOnChangeText(value, 'password')}
        label='Senha'
        placeholder='Digite sua senha...'
        autoCapitalize='none'
        placeholderTextColor="#A9A9A9"
        secureTextEntry
      />
      <FormSubmitButton onPress={submitForm} title='Entrar' />
    </FormContainer>
  );
};

export default LoginForm;
