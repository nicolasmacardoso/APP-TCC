import React, { useState } from 'react';
import { Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import client from '../api/client';
import { useLogin } from '../context/LoginProvider';
import { updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormSubmitButton from './FormSubmitButton';
import FormInput from './FormInput';

const LoginForm = () => {
  const { setIsLoggedIn, login } = useLogin();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('E-mail inválido.').required('E-mail é obrigatório.'),
    senha: Yup.string().trim().min(8, 'Senha muito curta.').required('Senha é obrigatória.'),
  });

  const submitForm = async (values, formikActions) => {
    try {
      const res = await client.post('https://cima-production.up.railway.app/usuariologin', values);

      if (res.data.success && res.data.usuario) {
        const user = res.data.usuario;

        if (user.senha === values.senha.trim()) {
          formikActions.resetForm();
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
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
      <Formik
        initialValues={{
          email: '',
          senha: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, formikActions) => submitForm(values, formikActions)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isSubmitting,
        }) => (
          <>
            <FormInput
              value={values.email}
              error={touched.email && errors.email}
              icon = 'envelope'
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              placeholder="Digite seu e-mail..."
              placeholderTextColor="#A9A9A9"
            />
            <FormInput
              value={values.senha}
              error={touched.senha && errors.senha}
              icon = 'key'
              onChangeText={handleChange('senha')}
              secureTextEntry={!showPassword}
              eyeIcon={showPassword ? 'eye-slash' : 'eye'}
              onEyePress={() => setShowPassword(!showPassword)}
              onBlur={handleBlur('senha')}
              autoCapitalize="none"
              placeholder="Digite sua senha..."
              placeholderTextColor="#A9A9A9"
            />
            <FormSubmitButton
              submitting={isSubmitting}
              onPress={handleSubmit}
              title="Entrar"
            />
          </>
        )}
      </Formik>
    </FormContainer>
  );
};

export default LoginForm;
