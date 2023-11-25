import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const FormContainer = ({ children }) => {
  return ( 
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Alterado para 'height' para Android
      style={styles.container}
      keyboardVerticalOffset={260} // Ajuste este valor conforme necessário
    > 
      <ScrollView
      ref={(ref) => (scrollView = ref)}
        contentContainerStyle={{ flexGrow: 1}} // Ajuste marginTop conforme necessário
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    marginTop: 70,
  },
});

export default FormContainer;
