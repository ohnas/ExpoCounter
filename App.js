import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.counterText}>0</Text>
      </View>
      <View>
        <Pressable style={styles.plus}>
          <Text style={styles.plusText}>+</Text>
        </Pressable>
        <Pressable style={styles.miuns}>
          <Text style={styles.miunsText}>-</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
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
  counter: {
    width: 300,
    height: 100,
    marginBottom: 50,
  },
  counterText: {
    fontSize: 100,
    textAlign: 'center',
  },
  plus: {
    width: 350,
    height: 400,
    borderWidth: 2,
    marginBottom: 30,
    backgroundColor: 'gray',
  },
  plusText: {
    fontSize: 200,
    textAlign: 'center',
  },
  miuns: {
    width: 350,
    borderWidth: 2,
    backgroundColor: 'gray',
  },
  miunsText: {
    fontSize: 50,
    textAlign: 'center',
  },
});
