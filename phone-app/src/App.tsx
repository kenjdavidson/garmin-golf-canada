import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export const App = () => {
  return (
    <SafeAreaView style="{styles.container}">
      <Text style="{styles.text}">Garmin Golf Canada</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
