import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Button, MD3DarkTheme, MD3LightTheme, PaperProvider, Surface, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const App = () => {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === 'dark'
      ? {
          ...MD3DarkTheme,
          colors: {
            ...MD3DarkTheme.colors,
            primary: '#4dabf7',
            surface: '#121212',
            background: '#121212',
          },
        }
      : {
          ...MD3LightTheme,
          colors: {
            ...MD3LightTheme.colors,
            primary: '#0a7ea4',
            surface: '#f6f7fb',
            background: '#f6f7fb',
          },
        };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <Surface style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>Garmin Golf Canada</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Watch data and golf insights, ready to explore.
          </Text>
          <Button mode="contained" onPress={() => undefined} style={styles.button}>
            Connect watch
          </Button>
        </Surface>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default App;
