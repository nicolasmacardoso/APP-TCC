import React from 'react';
import { View, StyleSheet, Text, Animated, Image } from 'react-native';

const FormHeader = ({
  leftHeading,
  rightHeading,
  subHeading,
  leftHeaderTranslateX = 40,
  rightHeaderTranslateY = -20,
  rightHeaderOpacity = 0,
}) => {
  return (
    <>
      <View>
        <View style={styles.logoContainer}>
          <Image
            source={require('./CimaLogo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.container}>
          <Animated.Text
            style={[
              styles.heading,
              { transform: [{ translateX: leftHeaderTranslateX }] },
            ]}
          >
            {leftHeading}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.heading,
              {
                opacity: rightHeaderOpacity,
                transform: [{ translateY: rightHeaderTranslateY }],
              },
            ]}
          >
            {rightHeading}
          </Animated.Text>
        </View>
      </View>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  logoContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  logo: {
    width: 115,
    position: 'absolute',
    bottom: -130,
    left: '36%',
  },
  heading: { fontSize: 30, fontWeight: 'bold', color: '#1b1b33' },
  subHeading: { fontSize: 18, color: '#1b1b33', textAlign: 'center' },
});

export default FormHeader;
