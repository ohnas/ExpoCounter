import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View, Vibration, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

function Counter({ storageData, setStorageData, isEmptyStorage, selectedItem, setSelectedItem, isVibrationEnabled, isSoundEnabled }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [header, setHeader] = useState("noGoal");
  const [noGoalNow, setNoGoalNow] = useState(0);
  async function updateData() {
    if(selectedItem.currentNum === selectedItem.goalNum) {
      let data = {
        "text" : selectedItem.text,
        "currentNum" : selectedItem.currentNum,
        "goalNum" : selectedItem.goalNum,
        "success" : true,
      };
      await mergeData(data);  
      Alert.alert(
        "알림" , "🎉 달성하였습니다"
      );
    } else if(selectedItem.currentNum > selectedItem.goalNum) {
      setSelectedItem({
        ...selectedItem,
        currentNum : selectedItem.goalNum
      });
      return;
    } else if(selectedItem.currentNum < 0) {
      setSelectedItem({
        ...selectedItem,
        currentNum : 0
      });
      return;
    } else {
      let data = {
        "text" : selectedItem.text,
        "currentNum" : selectedItem.currentNum,
        "goalNum" : selectedItem.goalNum,
        "success" : selectedItem.success,
      };
      await mergeData(data);  
    }
  }
  async function mergeData(data) {
    const jsonData = JSON.stringify(data)
    await AsyncStorage.mergeItem(String(selectedItem.key), jsonData)
    let storageDataArray = [];
    storageData.forEach((d) => {
      if(d.key === selectedItem.key) {
        d.currentNum = data.currentNum;
        d.success = data.success;
        storageDataArray.push(d);
      } else {
        storageDataArray.push(d);
      }
    });
    setStorageData(storageDataArray);
  }
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('./assets/sound.mp3'));
    await sound.playAsync();
  }
  useEffect(() => {
    if(selectedItem !== null){
      updateData();
    }
  }, [selectedItem]);
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
                    {storageData.map((d) =>
                      <Pressable style={styles.modalViewInner} onPress={() => {
                        setSelectedItem(d);
                        setModalVisible(!modalVisible);
                        }} 
                        key={d.key}>
                          <Text>{d.text}</Text>
                          <View style={styles.modalViewInnerNumber}>
                              <Text>{d.currentNum}</Text>
                              <Text>/</Text>
                              <Text>{d.goalNum}</Text>
                          </View>
                      </Pressable>
                    )}
                    <Pressable onPress={() => setModalVisible(!modalVisible)}>
                      <Text>Hide Modal</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <Pressable onPress={() => setModalVisible(true)} style={styles.infoText}>
                <Text>문장 선택하기</Text>
              </Pressable>
            </View>
          }
          {selectedItem === null ? 
            null
            :
            <View style={styles.infoSelected}>
              <Text style={styles.infoSelectedText}>{selectedItem.text}</Text>
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
              <TouchableOpacity style={styles.plus} onPress={() => {
                setNoGoalNow((previous) => previous + 1)
                isVibrationEnabled ? Vibration.vibrate() : Vibration.cancel()
                isSoundEnabled ? playSound() : null
              }}>
                  <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.minus} onPress={() => {
                setNoGoalNow((previous) => previous - 1);
                if(noGoalNow <= 0) {
                  setNoGoalNow(0);
                  return;
                }
                isVibrationEnabled ? Vibration.vibrate() : Vibration.cancel()
                isSoundEnabled ? playSound() : null
                }}>
                  <Text style={styles.minusText}>-</Text>
              </TouchableOpacity>
            </View>
          </>
          :
          <>
            <View style={styles.counter}>
              <Text style={styles.counterText}>{selectedItem.currentNum}</Text>
              <Text style={styles.goalText}>/</Text>
              <Text style={styles.goalText}>{selectedItem.goalNum}</Text>
            </View>
            <View>
            <TouchableOpacity style={styles.plus} onPress={() => {
              setSelectedItem({
                ...selectedItem,
                currentNum : selectedItem.currentNum + 1
              });
              isVibrationEnabled ? Vibration.vibrate() : Vibration.cancel()
              isSoundEnabled ? playSound() : null
            }}>
                <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.minus} onPress={() =>{
              setSelectedItem({
                ...selectedItem,
                currentNum : selectedItem.currentNum - 1
              });
              isVibrationEnabled ? Vibration.vibrate() : Vibration.cancel()
              isSoundEnabled ? playSound() : null
            }}>
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
});

export default Counter;