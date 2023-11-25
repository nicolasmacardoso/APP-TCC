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
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}></Text>
          <TextInput
            {...inputProps}
            placeholder={placeholder}
            style={styles.input}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            placeholderTextColor="#A9A9A9"
          />
            {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
        </View>
        <View style={styles.iconContainer}>
        {secureTextEntry && (
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <FontAwesome
                name={isPasswordVisible ? 'eye' : eyeIcon}
                size={22}
                color="#646FA3"
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.iconContainer2}>          
          {icon && (
            <FontAwesome name={icon} size={21} color="#2E3E5C" style={{ marginLeft: 20 }} />
          )}
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
    right: -2, 
    top: '17%',
  },
  iconContainer2: {
    position: 'absolute',
    left: 5, 
    top: '47%',
  },
  eyeIcon: {
    padding: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A8B3C5',
    height: 60,
    borderRadius: 50,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingLeft: 60,
  },
  icon: {
    position: 'absolute',
    left: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 85,
    marginLeft: 20,
    position: 'absolute'
  },
});

export default FormInput;