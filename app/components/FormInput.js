import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FormInput = (props) => {
  const { placeholder, label, error, secureTextEntry, eyeIcon, onEyePress, ...inputProps } = props;

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>{label}</Text>
        {error ? (
          <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
        ) : null}
      </View>
      <View style={{ position: 'relative' }}>
        <TextInput
          {...inputProps}
          placeholder={placeholder}
          style={styles.input}
          secureTextEntry={secureTextEntry} // Mantenha isso aqui
        />
        {secureTextEntry !== undefined && (
          <TouchableOpacity
            onPress={onEyePress} // Mantenha a chamada direta da propriedade onEyePress
            style={{ position: 'absolute', right: 0, top: -10, padding: 15 }}
          >
            <FontAwesome
              name={secureTextEntry ? 'eye-slash' : eyeIcon}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
    </>
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
});

export default FormInput;
