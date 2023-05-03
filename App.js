import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [goal, setGoal] = useState("");
  const [now, setNow] = useState(0);
  function handleGoal(value) {
    const numericValue = Number(value);
    const maxNumber = 100;
    if (numericValue > maxNumber) {
      Alert.alert(
        "알림" , "목표는 100 까지 입니다"
      );
      setGoal("");
      return;
    }
    const stringValue = String(numericValue);
    setGoal(stringValue);
  }
  function handlePlusPress() {
    setNow((previous) => previous + 1);
    if(now === Number(goal)) {
      Alert.alert("알림", "🎉 축하합니다");
      setNow(0);
      return;
    }
  }
  function handleMinusPress() {
    setNow((previous) => previous - 1);
    if(now <= 0) {
      setNow(0);
      return;
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.counterText}>{now}</Text>
        <Text style={styles.goalText}>/</Text>
        <TextInput style={styles.goalText} inputMode='numeric' returnKeyType='done' onChangeText={handleGoal} value={goal} placeholder='목표' />
      </View>
      <View>
        <TouchableOpacity style={styles.plus} onPress={handlePlusPress}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.minus} onPress={handleMinusPress}>
          <Text style={styles.minusText}>-</Text>
        </TouchableOpacity>
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
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 70,
  },
  goalText: {
    fontSize: 35,
  },
  plus: {
    width: 350,
    height: 450,
    // borderWidth: 2,
    borderRadius: 20,
    marginBottom: 30,
    backgroundColor: '#e1f7d5',
  },
  plusText: {
    fontSize: 200,
    textAlign: 'center',
  },
  minus: {
    width: 350,
    // borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#e1f7d5',
  },
  minusText: {
    fontSize: 50,
    textAlign: 'center',
  },
});
