import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FormInput = (props) => {
  const {
    placeholder,
    label,
    error,
    secureTextEntry,
    eyeIcon,
    onEyePress,
    icon,
    ...inputProps
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.inputContentContainer}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
          <TextInput
            {...inputProps}
            placeholder={placeholder}
            style={styles.input}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            placeholderTextColor="#A9A9A9"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        <View style={styles.iconContainer}>
          {secureTextEntry && (
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <FontAwesome
                name={isPasswordVisible ? 'eye' : eyeIcon}
                size={21}
                color="#2E3E5C"
              />
            </TouchableOpacity>
          )}
          <FontAwesome name={icon} size={21} color="#2E3E5C" style={styles.icon} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputContentContainer: {
    flex: 1,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }], // Ajuste conforme necessário
  },
  eyeIcon: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1b1b33',
    height: 60, // Altura ajustada conforme necessário
    borderRadius: 50,
    fontSize: 16,
    paddingLeft: 20, // Ajuste conforme necessário
  },
  icon: {
    position: 'absolute',
    left: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
  },
});

export default FormInput;