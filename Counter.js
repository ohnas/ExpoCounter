import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const day = new Date();
const today = new Date(day.setDate(day.getDate()));
let month = today.getMonth() + 1;
if(month < 10) {
    month = `0${month}`
}
let date = today.getDate();
if(date < 10) {
    date = `0${date}`
}
const todayValue = `${today.getFullYear()}-${month}-${date}`;
const STORAGE_KEY = todayValue;

function Counter() {
    const [text, setText] = useState("");
    const [isEmptyStorage, setIsEmptyStorage] = useState(true);
    const [isInputMode, setIsInputMode] = useState(true);
    const [header, setHeader] = useState("noGoal");
    const [goal, setGoal] = useState("");
    const [goalNow, setGoalNow] = useState(0);
    const [noGoalNow, setNoGoalNow] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    function onChangeText(payload) {
        setText(payload);
    }
    async function storeData(value) {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
        } catch (e) {
            // saving error
            console.log(e);
        }
    }
    async function getData() {
        const value = await AsyncStorage.getItem(STORAGE_KEY)
        const data = JSON.parse(value)
        if(data === null) {
            setIsEmptyStorage(true);
        } else {
            setIsEmptyStorage(false);
            setIsInputMode(false);
            setText(data.text);
            setGoal(data.goal);
        }
    }
    async function mergeData(value) {
      await AsyncStorage.mergeItem(STORAGE_KEY, JSON.stringify(value))
    }
    async function addData() {
      const value = await AsyncStorage.getItem(STORAGE_KEY)
      if(value === null) {
        if(text === '') {
            return;
        } else {
            const data = {
              "text" : text,
              "goal" : '',
            }
            await storeData(data);
            setIsEmptyStorage(false);
        }
      } else {
        const data = {
          "text" : text,
          "goal" : goal,
        }
        await mergeData(data);
        setIsEmptyStorage(false);
        setIsInputMode(false);
      }
    }
    async function delData() {
        await AsyncStorage.removeItem(STORAGE_KEY)
        setIsEmptyStorage(true);
        setIsInputMode(true);
        setIsSuccess(false);
        setText('');
        setGoal('');
        setGoalNow(0);
    }
    function handleInputMode() {
      setGoal('');
      setIsInputMode(true);
    }
    function handleHeaderNoGoal() {
      if(header === 'goal') {
        setHeader('noGoal');
      }
    }
    function handleHeaderGoal() {
      if(header === 'noGoal') {
        setHeader('goal');
      }
    }
    function handleGoal(value) {
      if(text === '') {
        Alert.alert(
          "알림" , "목표 문장을 먼저 작성해주세요"
        );
      } else {
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
    }
    async function handleGoalPlusPress() {
      if(goal === '') {
        Alert.alert(
          "알림" , "목표를 먼저 설정해주세요"
        );
      } else {
        const data = {
          "text" : text,
          "goal" : goal,
          "goalNow" : goalNow,
        }
        await mergeData(data);
        setGoalNow((previous) => previous + 1);
        if(goalNow === Number(goal)) {
          const data = {
            "text" : text,
            "goal" : goal,
            "goalNow" : goalNow,
            "success" : true,
          }
          await mergeData(data);
          Alert.alert("알림", "🎉 축하합니다");
          setIsSuccess(true);
        }
      }
    }
    async function handleGoalMinusPress() {
      if(goal === '') {
        Alert.alert(
          "알림" , "목표를 먼저 설정해주세요"
        );
      } else {
        if(goalNow <= 0) {
          setGoalNow(0);
          const data = {
            "text" : text,
            "goal" : goal,
            "goalNow" : goalNow,
          }
          await mergeData(data);
          return;
        } else {
          const data = {
            "text" : text,
            "goal" : goal,
            "goalNow" : goalNow,
          }
          await mergeData(data);
          setGoalNow((previous) => previous - 1);
        }
      }
    }
    function handleNoGoalPlusPress() {
      setNoGoalNow((previous) => previous + 1);
    }
    function handleNoGoalMinusPress() {
      setNoGoalNow((previous) => previous - 1);
      if(noGoalNow <= 0) {
        setNoGoalNow(0);
        return;
      }
    }
    async function multiGetData() {
      const values = await AsyncStorage.multiGet(['2023-05-11', '2023-05-12'])
      console.log(values);
    }
    useEffect(() => {
      multiGetData();
    }, []);
    useEffect(() => {
        getData();
    }, [text]);
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.infoDay}>{todayValue}</Text>
                {isEmptyStorage? 
                  <TextInput style={styles.infoText} onSubmitEditing={addData} onChangeText={onChangeText} returnKeyType='done' value={text} placeholder={"오늘 말할 목표를 적어주세요"} />
                  :
                  <Pressable onPress={delData}>
                      <Text style={styles.infoText}>{text}</Text>
                  </Pressable>
                }
            </View>
            <View style={styles.header}>
            <Pressable onPress={handleHeaderNoGoal}>
                <Text style={{...styles.headerText, color: header === 'noGoal' ? "black" : "gray"}}>노 목표</Text>
            </Pressable>
            <Pressable onPress={handleHeaderGoal}>
                <Text style={{...styles.headerText, color: header === 'goal' ? "black" : "gray"}}>목표</Text>
            </Pressable>
            </View>
            {header === "noGoal" ? 
              <>
                  <View style={styles.counter}>
                    <Text style={styles.counterText}>{noGoalNow}</Text>
                  </View>
                  <View>
                  <TouchableOpacity style={styles.plus} onPress={handleNoGoalPlusPress}>
                      <Text style={styles.plusText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.minus} onPress={handleNoGoalMinusPress}>
                      <Text style={styles.minusText}>-</Text>
                  </TouchableOpacity>
                  </View>
              </>
              :
              isSuccess ?
                <View style={styles.success}>
                  <Text>Today is success</Text>
                </View>
                :
                <>
                    <View style={styles.counter}>
                      <Text style={styles.counterText}>{goalNow}</Text>
                      <Text style={styles.goalText}>/</Text>
                      {isInputMode ? 
                        <TextInput style={styles.goalText} onSubmitEditing={addData} inputMode='numeric' returnKeyType='done' onChangeText={handleGoal} value={goal} placeholder='목표' />
                        :
                        <Pressable onPress={handleInputMode}>
                          <Text style={styles.goalText}>{goal}</Text>
                        </Pressable>
                      }
                    </View>
                    <View>
                    <TouchableOpacity style={styles.plus} onPress={handleGoalPlusPress}>
                        <Text style={styles.plusText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.minus} onPress={handleGoalMinusPress}>
                        <Text style={styles.minusText}>-</Text>
                    </TouchableOpacity>
                    </View>
                </>
            }
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
    info: {
        width: 350,
        flexDirection: 'col',
        alignItems: 'center',
        paddingBottom : 20,
    },
    infoDay: {
        fontSize: 10,
        paddingBottom : 20,
    },
    infoText: {
        width: 350,
        fontSize: 20,
        textAlign: 'center',
    },
    header : {
      width: 350,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    headerText: {
      fontSize: 30,
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
      height: 350,
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
      borderRadius: 20,
      backgroundColor: '#e1f7d5',
    },
    minusText: {
      fontSize: 50,
      textAlign: 'center',
    },
    success: {
      width: 350,
      height: 525,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }
});

export default Counter;