import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import BairroSelect from './BairroSelect';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { TextInputMask } from 'react-native-masked-text';

const SignupForm = ({}) => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(null);

  const validationSchema = Yup.object({
    nome: Yup.string().trim().required('Nome é obrigatório.'),
    usuario: Yup.string().trim().required('Usuário é obrigatório.'),
    cpf: Yup.string()
    .matches(/^\d{11}$/, 'CPF inválido.')
    .required('CPF é obrigatório.'),
    email: Yup.string().email('E-mail inválido.').required('E-mail é obrigatório.'),
    senha: Yup.string().trim().min(8, 'Senha muito curta.').required('Senha é obrigatória.'),
    confirmSenha: Yup.string().oneOf(
      [Yup.ref('senha'), null],
      'As senhas não coincidem.'
    ).required('Confirme sua senha.'),
  });

  const validationSchemaPersonalInfo = Yup.object({
    rua: Yup.string().trim().required('Endereço é obrigatório.'),
    complemento: Yup.string(),
    numero_casa: Yup.string().required('Número é obrigatório.'),
    codbairro: Yup.string().required('Bairro é obrigatório.'),
  });  

  const signUp = async (values, formikActions) => {
    try {
      if (step === 1) {
        setStep1Data(values);
        setSuccessMessage('');
        setStep(2); 
      } else {
        const response = await axios.post('https://cima-production.up.railway.app/usuario_temp', {
          ...step1Data,
          rua: values.rua,
          complemento: values.complemento,
          numero_casa: values.numero_casa,
          codbairro: values.codbairro,
        });
  
        if (response.status === 201) {
          setSuccessMessage('Cadastro bem sucedido. Sua conta está aguardando aprovação, você será notificado quando estiver ativa.');
          formikActions.resetForm(); 
        } else {
          updateError(response.data.message || 'Erro desconhecido.', setError);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      updateError('Erro ao tentar criar conta. Tente novamente mais tarde.', setError);
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  const updateError = (message, setError) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  return (
    <FormContainer>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
      {successMessage ? (
        <Text style={{ color: 'green', fontSize: 18, textAlign: 'center' }}>
          {successMessage}
        </Text>
      ) : null}

      <Formik
        initialValues={{
          nome: '',
          usuario: '',
          cpf: '',
          email: '',
          senha: '',
          confirmSenha: '',
          rua: '',
          complemento: '',
          numero_casa: '',
          codbairro: '',
        }}
        validationSchema={step === 1 ? validationSchema : validationSchemaPersonalInfo}
        onSubmit={signUp}
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
            {step === 1 && (
              <>
                <FormInput
                  value={values.nome}
                  error={touched.nome && errors.nome}
                  onChangeText={handleChange('nome')}
                  onBlur={handleBlur('nome')}
                  label="Nome Completo"
                  placeholder="Digite seu nome completo..."
                  placeholderTextColor="#A9A9A9"
                />
                <FormInput
                  value={values.usuario}
                  error={touched.usuario && errors.usuario}
                  onChangeText={handleChange('usuario')}
                  onBlur={handleBlur('usuario')}
                  label="Nome de Usuário"
                  placeholder="Digite seu nome de usuário..."
                  placeholderTextColor="#A9A9A9"
                />
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>CPF</Text>
                </View>
                {touched.cpf && errors.cpf && (
                  <Text style={{ color: 'red', fontSize: 16, textAlign: 'right',marginTop: -30, marginBottom: 10.5,}}>
                    {errors.cpf}
                  </Text>
                )}
                <TextInputMask
                  type={'cpf'}
                  options={{
                    maskType: 'CPF',
                    withDDD: true,
                    dddMask: '9',
                  }}
                  value={values.cpf}
                  onChangeText={(text) => handleChange('cpf')(text.replace(/\D/g, ''))}
                  onBlur={handleBlur('cpf')}
                  style={styles.input}
                  placeholder="Digite seu CPF..."
                  placeholderTextColor="#A9A9A9"
                  keyboardType="numeric"
                />
                <FormInput
                  value={values.email}
                  error={touched.email && errors.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                  label="E-mail"
                  placeholder="Digite seu e-mail..."
                  placeholderTextColor="#A9A9A9"
                />
                <FormInput
                  value={values.senha}
                  error={touched.senha && errors.senha}
                  onChangeText={handleChange('senha')}
                  onBlur={handleBlur('senha')}
                  autoCapitalize="none"
                  secureTextEntry
                  label="Senha"
                  placeholder="Digite sua senha..."
                  placeholderTextColor="#A9A9A9"
                />
                <FormInput
                  value={values.confirmSenha}
                  error={touched.confirmSenha && errors.confirmSenha}
                  onChangeText={handleChange('confirmSenha')}
                  onBlur={handleBlur('confirmSenha')}
                  autoCapitalize="none"
                  secureTextEntry
                  label="Confirme a Senha"
                  placeholder="Confirme sua senha..."
                  placeholderTextColor="#A9A9A9"
                />
              </>
            )}
            {step === 2 && (
              <>
                <FormInput
                  value={values.rua}
                  error={touched.rua && errors.rua}
                  onChangeText={handleChange('rua')}
                  onBlur={handleBlur('rua')}
                  label="Endereço"
                  placeholder="Digite seu endereço..."
                  placeholderTextColor="#A9A9A9"
                />
                <FormInput
                  value={values.complemento}
                  error={touched.complemento && errors.complemento}
                  onChangeText={handleChange('complemento')}
                  onBlur={handleBlur('complemento')}
                  label="Complemento(Opcional)"
                  placeholder="Digite o complemento..."
                  placeholderTextColor="#A9A9A9"
                />
                <FormInput
                  value={values.numero_casa}
                  error={touched.numero_casa && errors.numero_casa}
                  onChangeText={handleChange('numero_casa')}
                  onBlur={handleBlur('numero_casa')}
                  label="Número"
                  placeholder="Digite o número..."
                  placeholderTextColor="#A9A9A9"
                />
                 <BairroSelect
                  value={values.codbairro}
                  onValueChange={handleChange('codbairro')}
                  label="Bairro"
                  placeholder="Selecione o bairro..."
                />
              </>
            )}
              <FormSubmitButton
                submitting={isSubmitting}
                onPress={handleSubmit}
                title={step === 1 ? 'Continuar' : 'Cadastrar'}
              />
              {step === 2 && (
                <View style={{ marginTop: 20 }}>
                  <FormSubmitButton
                    submitting={isSubmitting}
                    onPress={() => {
                      setStep(1);
                      setSuccessMessage('');
                    }}
                    title={'Voltar'}
                  />
                </View>
              )}
          </>
        )}
      </Formik>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#1b1b33',
    height: 35,
    borderRadius: 8,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 20,
  },
  labelContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // ou a cor desejada
  },
});

export default SignupForm;