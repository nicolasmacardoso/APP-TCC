import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Dimensions, 
  Text,
} from 'react-native';

import FormHeader from './FormHeader';
import FormSelectorBtn from './FormSelectorBtn';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

const { width } = Dimensions.get('window');

export default function AppForm({ navigation }) {
  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();

  const rightHeaderOpacity = animation.interpolate({
    inputRange: [0, width],
    outputRange: [1, 0],
  });

  const leftHeaderTranslateX = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, 60],
  });
  const rightHeaderTranslateY = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, -20],
  });
  const loginColorInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['rgba(48,66,105,1)', 'rgba(48,66,105,0.4)'],
  });
  const signupColorInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['rgba(48,66,105,0.4)', 'rgba(48,66,105,1)'],
  });

  return (
    <View style={{ flex: 1, paddingTop: 180}}>
      <View style={{ height: 80 }}>
        <FormHeader
          leftHeading='Bem-vindo '
          rightHeading='de volta'
          subHeading='Insira seus dados:'
          rightHeaderOpacity={rightHeaderOpacity}
          leftHeaderTranslateX={leftHeaderTranslateX}
          rightHeaderTranslateY={rightHeaderTranslateY}
        />
      </View>
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: animation } } }],
          { useNativeDriver: false }
        )}
      >
        <LoginForm navigation={navigation} />
        <SignupForm navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
  },
  loginButton: {
    flex: 1,
    height: 80,
  },
  signupButton: {
    flex: 1,
    height: 80,
  },
});
