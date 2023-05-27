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
  const [isEmptyStorage, setIsEmptyStorage] = useState(true);
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
  useEffect(() => {
    getTodayKeys();
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
          />} 
        />
        <Tab.Screen name="Counter" children={() => <Counter 
          storageData={storageData}
          setStorageData={setStorageData}
          isEmptyStorage={isEmptyStorage}
          />} 
        />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Settings" component={Setting} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
