import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const FormSubmitButton = ({ title, submitting, onPress }) => {
  const backgroundColor = submitting
    ? 'rgba(27,27,51,0.4)'
    : '#2E3E5C';

  return (
    <TouchableOpacity
      onPress={!submitting ? onPress : null}
      style={[styles.container, { backgroundColor }]}
    >
      <Text style={{ fontSize: 18, color: '#fff' }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    marginTop: 50,
  },
});

export default FormSubmitButton;
