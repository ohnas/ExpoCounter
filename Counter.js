import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Vibration, Modal } from 'react-native';
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
let STRING_STORAGE_KEY = `${todayValue}-00`
STRING_STORAGE_KEY = STRING_STORAGE_KEY.replace(/-/g,'');

function Counter() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEmptyStorage, setIsEmptyStorage] = useState(true);
  const [sayItems, setSayItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [header, setHeader] = useState("noGoal");
  const [noGoalNow, setNoGoalNow] = useState(0);
  const [goal, setGoal] = useState("");
  const [goalNow, setGoalNow] = useState(0);
  const [isInputMode, setIsInputMode] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  async function getTodayKeys() {
    let keys = await AsyncStorage.getAllKeys()
    let todayKeys = [];
    let todayString = todayValue.replace(/-/g,'');
    keys.forEach((key) => {
        if(key.includes(todayString)) {
            todayKeys.push(key)
        }
    })
    if(todayKeys.length === 0) {
        setIsEmptyStorage(true);
    } else {
        let convertNumKeys = [];
        todayKeys.forEach((todayKey) => 
            convertNumKeys.push(Number(todayKey))
        )
        convertNumKeys.sort();
        await getMultiData(convertNumKeys);
    }
  }
  async function getMultiData(convertNumKeys) {
    let itemsArray = [];
    for(let key of convertNumKeys) {
        let data = await AsyncStorage.getItem(String(key))
        let jsonData = JSON.parse(data)
        console.log(jsonData);
        itemsArray.push({
          "key" : key,
          "data" : jsonData,
        });
    }
    setSayItems(itemsArray);
    setIsEmptyStorage(false);
  }
  async function mergeData() {
    selectedItem.data.goalNum = Number(goal);
    await AsyncStorage.mergeItem(String(selectedItem.key), JSON.stringify(selectedItem.data))
    setIsInputMode(false);
  }
  // async function delData() {
  //     await AsyncStorage.removeItem(STORAGE_KEY)
  //     setIsEmptyStorage(true);
  //     setIsInputMode(true);
  //     setIsSuccess(false);
  //     setText('');
  //     setGoal('');
  //     setGoalNow(0);
  // }
  // function handleHeaderNoGoal() {
  //   if(header === 'goal') {
  //     setHeader('noGoal');
  //   }
  // }
  // function handleHeaderGoal() {
  //   if(header === 'noGoal') {
  //     setHeader('goal');
  //   }
  // }
  function handleGoal(value) {
    if(selectedItem === null) {
      Alert.alert(
        "알림" , "목표 문장을 먼저 선택해주세요"
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
  useEffect(() => {
    getTodayKeys();
  }, []);
  return (
      <View style={styles.container}>
        <View style={styles.info}>
          {isEmptyStorage ?
            <View>
              <Text>오늘 생성된 문장이 없습니다.</Text>
            </View>
            :
            <View>
              <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {sayItems.map((item) =>
                      <Pressable style={styles.modalViewInner} onPress={() => {
                        setSelectedItem(item);
                        setModalVisible(!modalVisible);
                        }} 
                        key={item.key}>
                          <Text>{item.data.text}</Text>
                          <View style={styles.modalViewInnerNumber}>
                              <Text>{item.data.currentNum}</Text>
                              <Text>/</Text>
                              <Text>{item.data.goalNum}</Text>
                          </View>
                      </Pressable>
                    )}
                    <Pressable onPress={() => setModalVisible(!modalVisible)}>
                      <Text>Hide Modal</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <Pressable onPress={() => {
                  setGoal('');
                  setModalVisible(true);
                }} style={styles.infoText}>
                <Text>문장 선택하기</Text>
              </Pressable>
            </View>
          }
          {selectedItem === null ? 
            null
            :
            <View style={styles.infoSelected}>
              <Text style={styles.infoSelectedText}>{selectedItem.data.text}</Text>
            </View>
          }
        </View>
        <View style={styles.header}>
          <Pressable onPress={() => setHeader('noGoal')}>
              <Text style={{...styles.headerText, color: header === 'noGoal' ? "black" : "gray"}}>노 목표</Text>
          </Pressable>
          <Pressable onPress={() => setHeader('goal')}>
              <Text style={{...styles.headerText, color: header === 'goal' ? "black" : "gray"}}>목표</Text>
          </Pressable>
        </View>
        {header === 'noGoal' ? 
          <>
            <View style={styles.counter}>
              <Text style={styles.counterText}>{noGoalNow}</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.plus} onPress={() => setNoGoalNow((previous) => previous + 1)}>
                  <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.minus} onPress={() => {
                setNoGoalNow((previous) => previous - 1);
                if(noGoalNow <= 0) {
                  setNoGoalNow(0);
                  return;
                }}}>
                  <Text style={styles.minusText}>-</Text>
              </TouchableOpacity>
            </View>
          </>
          :
          <>
            <View style={styles.counter}>
              <Text style={styles.counterText}>{goalNow}</Text>
              <Text style={styles.goalText}>/</Text>
              {isInputMode ? 
                <TextInput style={styles.goalText} onSubmitEditing={mergeData} inputMode='numeric' returnKeyType='done' onChangeText={handleGoal} value={goal} placeholder='목표' />
                :
                <Pressable onPress={() => setIsInputMode(true)}>
                 <Text style={styles.goalText}>{selectedItem.data.goalNum}</Text>
                </Pressable>
              }
            </View>
            <View>
            <TouchableOpacity style={styles.plus} onPress={async () => {
                if(goal === '') {
                  Alert.alert(
                    "알림" , "목표를 먼저 설정해주세요"
                  );
                } else {
                  setGoalNow((previous) => previous + 1);
                  selectedItem.data.currentNum = goalNow;
                  await AsyncStorage.mergeItem(String(selectedItem.key), JSON.stringify(selectedItem.data))
                }
              }}>
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
    alignItems: 'center',
    paddingBottom : 20,
  },
  infoText: {
    marginBottom: 20,
  },
  infoSelected: {
    width: 350,
    alignItems: 'center',
  },
  infoSelectedText: {
    fontSize: 30,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 300,
    paddingVertical: 30,
  },
  modalViewInner: {
    flexDirection: "row",
    width: 250,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#e1f7d5',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
  },
  modalViewInnerNumber: {
    flexDirection: "row",
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