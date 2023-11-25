import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Certifique-se de importar o ícone necessário
import client from '../api/client';
import { useLogin } from '../context/LoginProvider';
import { isValidEmail, isValidObjField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormSubmitButton from './FormSubmitButton';
import FormInput from './FormInput';
const LoginForm = () => {
  const { setIsLoggedIn, login } = useLogin();
  const [userInfo, setUserInfo] = useState({
    email: '',
    senha: '',
  });
  const [error, setError] = useState('');
  const { email, senha } = userInfo;
  const [showPassword, setShowPassword] = useState(false);
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError('Preencha todos os campos.', setError);

    if (!isValidEmail(email)) return updateError('Email inválido.', setError);

    if (!senha.trim() || senha.length < 8)
      return updateError('Senha muito curta.', setError);

    return true;
  };

  const submitForm = async () => {
    if (isValidForm()) {
      try {
        const res = await client.post(
          'https://cima-production.up.railway.app/usuariologin',
          userInfo
        );

        if (res.data.success && res.data.usuario) {
          const user = res.data.usuario;

          if (user.senha === userInfo.senha.trim()) {
            setUserInfo({ email: '', senha: '' });

            login(user); 
            setIsLoggedIn(true);
          } else {
            updateError('Sua senha não condiz com seu email.', setError);
          }
        } else {
          updateError('Usuário não encontrado. Verifique seu email.', setError);
        }
      } catch (error) {
        console.error('Error:', error.message);
        updateError('Usuário não encontrado. Verifique seu email.', setError);
      }
    }
  };

  return (   
    <FormContainer>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
          {error}
        </Text>
      ) : null}
      <FormInput
        value={email}
        onChangeText={(value) => handleOnChangeText(value, 'email')}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
        icon="envelope-o" // Ícone para o campo de email
      />
      <FormInput
        value={senha}
        onChangeText={(value) => handleOnChangeText(value, 'senha')}
        placeholder="Senha"
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
        secureTextEntry={!showPassword}
        eyeIcon={showPassword ? 'eye-slash' : 'eye'}
        onEyePress={() => setShowPassword(!showPassword)}
      />
      <FormSubmitButton onPress={submitForm} title="Entrar" />
    </FormContainer>
  );
};

export default LoginForm;
