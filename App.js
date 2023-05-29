import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SayList from './SayList';
import Counter from './Counter';
import CalendarScreen from './CalendarScreen';
import Setting from './Setting';

const Tab = createBottomTabNavigator();

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

export default function App() {
  const [numberStorageKey, setNumberStarageKey] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEmptyStorage, setIsEmptyStorage] = useState(true);
  const [successData, setSuccessData] = useState([]);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
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
        setNumberStarageKey(convertNumKeys);
        await getMultiData(convertNumKeys);
    }
  }
  async function getMultiData(convertNumKeys) {
      let storageDataArry = [];
      for(let key of convertNumKeys) {
          let data = await AsyncStorage.getItem(String(key))
          let jsonData = JSON.parse(data)
          storageDataArry.push({
              "key" : key,
              "text" : jsonData.text,
              "currentNum" : jsonData.currentNum,
              "goalNum" : jsonData.goalNum,
              "success" : jsonData.success,
          });
      }
      setStorageData(storageDataArry);
      setIsEmptyStorage(false);
  }
  async function handleSuccessData() {
    if(storageData.length !== 0) {
      isSuccessArray = [];
      storageData.forEach((data) => {
          isSuccessArray.push(data.success);
      });
      if(isSuccessArray.includes(false)) {
        return;
      } else {
        const data = {
          "success" : true
        }
        const jsonData = JSON.stringify(data)
        await AsyncStorage.setItem(todayValue, jsonData)
      }
    }
  }
  async function getSuccessData() {
    let keys = await AsyncStorage.getAllKeys()
    let successDatakeys = [];
    keys.forEach((key) => {
      if(key.includes("-")) {
        successDatakeys.push(key)
      }
    })
    for(let key of successDatakeys) {
      let data = await AsyncStorage.getItem(key)
      let jsonData = JSON.parse(data)
      setSuccessData([...successData, {
        "key" : key, 
        "success" : jsonData.success,
      }])
    }
  }
  useEffect(() => {
    getTodayKeys();
  }, []);
  useEffect(() => {
    handleSuccessData();
  }, [storageData]);
  useEffect(() => {
    getSuccessData();
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="List" children={() => <SayList 
          todayValue={todayValue}
          STRING_STORAGE_KEY={STRING_STORAGE_KEY}
          numberStorageKey={numberStorageKey}
          setNumberStarageKey={setNumberStarageKey}
          storageData={storageData}
          setStorageData={setStorageData}
          isEmptyStorage={isEmptyStorage}
          setIsEmptyStorage={setIsEmptyStorage}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          />} 
        />
        <Tab.Screen name="Counter" children={() => <Counter 
          storageData={storageData}
          setStorageData={setStorageData}
          isEmptyStorage={isEmptyStorage}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          isVibrationEnabled={isVibrationEnabled}
          isSoundEnabled={isSoundEnabled}
          />} 
        />
        <Tab.Screen name="Calendar" children={() => <CalendarScreen 
          successData={successData}
          />} 
        />
        <Tab.Screen name="Settings" children={() => <Setting 
          isVibrationEnabled={isVibrationEnabled}
          setIsVibrationEnabled={setIsVibrationEnabled}
          isSoundEnabled={isSoundEnabled}
          setIsSoundEnabled={setIsSoundEnabled}
          />} 
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
