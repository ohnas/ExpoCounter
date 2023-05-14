import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CalendarScreen() {
    const [dayList, setDayList] = useState([]);
    const [marking, setMarking] = useState({});
    function currentMonthDayList() {
        let result = [];
        let day = new Date();
        let intialDate = 0; 
        while(intialDate !== 1) {
            intialDate = day.getDate();
            result.push(day.toISOString().split("T")[0]);
            day.setDate(day.getDate() - 1);
        }
        setDayList(result);
    }
    async function getData() {
        let markingDate = {};
        for (let day of dayList) {
            let value = await AsyncStorage.getItem(day)
            if(value !== null) {
                // let data = JSON.parse(value)
                markingDate[day] = {marked: true}
            }
        }
        setMarking(markingDate);
    }
    console.log(marking);
    useEffect(() => {
        currentMonthDayList();
    }, []);
    useEffect(() => {
        getData();
    }, []);
    return (
        <View style={styles.container}>
            <Calendar markedDates={marking} />
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
})

export default CalendarScreen;