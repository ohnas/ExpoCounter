import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, Button, Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SayList({ todayValue, STRING_STORAGE_KEY, numberStorageKey, setNumberStarageKey, storageData, setStorageData, isEmptyStorage, setIsEmptyStorage, selectedItem, setSelectedItem }) {
    const [text, setText] = useState("");
    const [goalNum, setGoalNum] = useState("");
    function handleChangeText(value) {
        setText(value);
    }
    function handleChangeGoalNum(value) {
        setGoalNum(value);
    }
    async function storeData(data) {
        if(numberStorageKey.length === 0) {
            const jsonData = JSON.stringify(data)
            await AsyncStorage.setItem(STRING_STORAGE_KEY, jsonData)
            setNumberStarageKey([...numberStorageKey, Number(STRING_STORAGE_KEY)])
            setStorageData([...storageData, {
                "key" : Number(STRING_STORAGE_KEY), 
                "text" : data.text,
                "currentNum" : data.currentNum,
                "goalNum" : data.goalNum,
                "success" : data.success,
            }])
            setIsEmptyStorage(false);
        } else {
            let max = Math.max(...numberStorageKey);
            let stringStorageKey = String(max + 1);
            const jsonData = JSON.stringify(data)
            await AsyncStorage.setItem(stringStorageKey, jsonData)
            setNumberStarageKey([...numberStorageKey, Number(stringStorageKey)])
            setStorageData([...storageData, {
                "key" : Number(stringStorageKey), 
                "text" : data.text,
                "currentNum" : data.currentNum,
                "goalNum" : data.goalNum,
                "success" : data.success,
            }])
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
                                <Text style={styles.dataViewInnerText}>{d.text}</Text>
                                <View style={styles.dataViewInnerNumber}>
                                    <Text style={styles.dataViewInnerText}>{d.currentNum}</Text>
                                    <Text style={styles.dataViewInnerText}>/</Text>
                                    <Text style={styles.dataViewInnerText}>{d.goalNum}</Text>
                                </View>
                                <Pressable onPress={async () => {
                                    await AsyncStorage.removeItem(String(d.key));
                                    setStorageData(storageData.filter((data) => data.key !== d.key));
                                    if(d.key === selectedItem.key) {
                                        setSelectedItem(null);
                                    }
                                }}>
                                    <Text>🗑</Text>
                                </Pressable>
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