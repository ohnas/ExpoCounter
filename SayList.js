import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, Button, Alert } from 'react-native';
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

function SayList() {
    const [text, setText] = useState("");
    const [goalNum, setGoalNum] = useState("");
    const [numberStorageKey, setNumberStarageKey] = useState([]);
    const [storageData, setStorageData] = useState([]);
    const [isEmptyStorage, setIsEmptyStorage] = useState(true);
    function handleChangeText(value) {
        setText(value);
    }
    function handleChangeGoalNum(value) {
        setGoalNum(value);
    }
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
                "data" : jsonData,
            });
        }
        setStorageData(storageDataArry);
        setIsEmptyStorage(false);
    }
    async function storeData(data) {
        if(numberStorageKey.length === 0) {
            const jsonData = JSON.stringify(data)
            await AsyncStorage.setItem(STRING_STORAGE_KEY, jsonData)
            setNumberStarageKey([...numberStorageKey, Number(STRING_STORAGE_KEY)])
            setStorageData([...storageData, {"key" : Number(STRING_STORAGE_KEY), "data" : data}])
            setIsEmptyStorage(false);
        } else {
            let max = Math.max(...numberStorageKey);
            let stringStorageKey = String(max + 1);
            const jsonData = JSON.stringify(data)
            await AsyncStorage.setItem(stringStorageKey, jsonData)
            setNumberStarageKey([...numberStorageKey, Number(stringStorageKey)])
            setStorageData([...storageData, {"key" : Number(stringStorageKey), "data" : data}])
            setIsEmptyStorage(false);
        }
    }
    async function addData() {
        if(text === '') {
            Alert.alert(
                "알림" , "오늘 말할 목표를 적어주세요"
            );
            return;
        } else if(goalNum === '') {
            Alert.alert(
                "알림" , "목표 수를 적어주세요"
            );
            return;
        } else {
            let data = {
                "text" : text,
                "currentNum" : 0,
                "goalNum" : Number(goalNum),
                "success" : false,
            };
            await storeData(data);
            setText('');
            setGoalNum('');
        }
    }
    useEffect(() => {
        getTodayKeys();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.infoDay}>{todayValue}</Text>
                <TextInput style={styles.infoText} onChangeText={handleChangeText} returnKeyType='done' value={text} placeholder={"오늘 말할 목표를 적어주세요"} />
                <TextInput style={styles.infoText} onChangeText={handleChangeGoalNum} inputMode='numeric' returnKeyType='done' value={goalNum} placeholder={"목표 수를 적어주세요"} />
                <Button title="등록" onPress={addData} />
            </View>
            <ScrollView showsVerticalScrollIndicator={true} style={styles.scroll}>
                {isEmptyStorage ?
                    <View style={styles.dataView}>
                        <Text style={styles.scrollText}>No data.</Text>
                    </View>
                    :
                    <View style={styles.dataView}>
                        {storageData.map((d) =>
                            <View style={styles.dataViewInner} key={d.key}>
                                <Text style={styles.dataViewInnerText}>{d.data.text}</Text>
                                <View style={styles.dataViewInnerNumber}>
                                    <Text style={styles.dataViewInnerText}>{d.data.currentNum}</Text>
                                    <Text style={styles.dataViewInnerText}>/</Text>
                                    <Text style={styles.dataViewInnerText}>{d.data.goalNum}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                }
            </ScrollView>
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
        marginTop: 50,
        marginBottom: 50,
        borderBottomWidth: 2,
        borderBottomColor: "gray",
        alignItems: 'center',
    },
    infoDay: {
        marginBottom: 30,
    },
    infoText: {
        fontSize: 25,
        marginBottom: 10,
    },
    scroll: {
        width: 350,
    },
    scrollText: {
        marginTop: 300,
        color: "gray",
    },
    dataView: {
        width: 350,
        alignItems: 'center',
    },
    dataViewInner: {
        flexDirection: 'row',
        width: 350,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#e1f7d5',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    dataViewInnerText: {
        fontSize: 30,
        paddingVertical: 15,
    },
    dataViewInnerNumber: {
        flexDirection: 'row',
    }
})

export default SayList;