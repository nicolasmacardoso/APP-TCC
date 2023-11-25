import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Keyboard} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

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
                    icon = 'address-card'
                    onChangeText={handleChange('nome')}
                    onBlur={handleBlur('nome')}
                    placeholder="Nome Completo."
                    placeholderTextColor="#A9A9A9"
                  />
                  <FormInput
                    value={values.usuario}
                    error={touched.usuario && errors.usuario}
                    icon = 'user'
                    onChangeText={handleChange('usuario')}
                    onBlur={handleBlur('usuario')}
                    placeholder="Usuário"
                    placeholderTextColor="#A9A9A9"
                  />
                  <View style={styles.labelContainer}>
                  </View>
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
                    placeholder="CPF"
                    placeholderTextColor="#A9A9A9"
                    keyboardType="numeric"
                  />
                  <View style={styles.iconContainer}>
                    <FontAwesome
                      name={'file-text'}
                      size={22}
                      color="#2E3E5C"
                    />
                  </View>

                  {touched.cpf && errors.cpf && (
                    <Text style={styles.errorText}>
                      {errors.cpf}
                    </Text>
                  )}
                  <FormInput
                    value={values.email}
                    error={touched.email && errors.email}
                    icon = 'envelope'
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    autoCapitalize="none"
                    placeholder="Email"
                    placeholderTextColor="#A9A9A9"
                  />
                  <FormInput
                    value={values.senha}
                    error={touched.senha && errors.senha}
                    icon = 'key'
                    onChangeText={handleChange('senha')}
                    secureTextEntry
                    onBlur={handleBlur('senha')}
                    autoCapitalize="none"
                    placeholder="Senha"
                    placeholderTextColor="#A9A9A9"
                  />
                  <FormInput
                    value={values.confirmSenha}
                    error={touched.confirmSenha && errors.confirmSenha}
                    icon = 'key'
                    onChangeText={handleChange('confirmSenha')}
                    secureTextEntry
                    onBlur={handleBlur('confirmSenha')}
                    autoCapitalize="none"
                    placeholder="Confirmar senha"
                    placeholderTextColor="#A9A9A9"
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <FormInput
                    value={values.rua}
                    error={touched.rua && errors.rua}
                    icon = 'globe'
                    onChangeText={handleChange('rua')}
                    onBlur={handleBlur('rua')}
                    placeholder="Endereço"
                    placeholderTextColor="#A9A9A9"
                  />
                  <FormInput
                    value={values.complemento}
                    error={touched.complemento && errors.complemento}
                    icon = 'plus-circle'
                    onChangeText={handleChange('complemento')}
                    onBlur={handleBlur('complemento')}
                    placeholder="Complemento"
                    placeholderTextColor="#A9A9A9"
                  />
                  <FormInput
                    value={values.numero_casa}
                    error={touched.numero_casa && errors.numero_casa}
                    icon = 'home'
                    onChangeText={handleChange('numero_casa')}
                    onBlur={handleBlur('numero_casa')}
                    placeholder="Número"
                    placeholderTextColor="#A9A9A9"
                  />
                   <BairroSelect
                value={values.codbairro}
                error={touched.codbairro && errors.codbairro}
                onBlur={handleBlur('codbairro')}
                onValueChange={handleChange('codbairro')}
                placeholder="Bairro"
                placeholderTextColor="#A9A9A9"
              />
                </>
              )}
                <View style={styles.buttonCadastrar}>
                  <FormSubmitButton
                    submitting={isSubmitting}
                    onPress={handleSubmit}
                    title={step === 1 ? 'Continuar' : 'Cadastrar'}
                  />
                </View>
                {step === 2 && (
                   <View style={styles.backButtonContainer}>
                      <FormSubmitButton
                        submitting={isSubmitting}
                        style={styles.backButton}
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
    borderColor: '#A8B3C5',
    height: 60,
    borderRadius: 50,
    fontSize: 16,
    paddingLeft: 60,
    marginBottom: 15,
    marginTop: 20,
  },
  iconContainer: {
    position: 'absolute',
    left: 25, 
    top: '32.4%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: '72.4%',
    marginLeft: 20,
    position: 'absolute'
  },
  buttonCadastrar: {
    marginTop: -85,
    marginBottom: -50,
    marginTop: -28,
  },
  backButtonContainer: {
    marginBottom: 150,
    marginTop: "0%",
    marginTop: -20,
    marginBottom: -50,
  },

});

export default SignupForm;