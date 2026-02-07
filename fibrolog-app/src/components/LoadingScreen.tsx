import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.brandF}>Fibrolog</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandF: {
    fontFamily: 'Carattere_400Regular',
    fontSize: 120,
    color: '#B1278E',
    lineHeight: 140,
  },
  brandText: {
    fontFamily: 'Carattere_400Regular',
    fontSize: 48,
    color: '#B1278E',
    marginTop: -20,
  },
});
