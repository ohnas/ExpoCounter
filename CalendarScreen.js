import { Text, View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
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

function CalendarScreen() {
    // async function getData() {
    //     const value = await AsyncStorage.getItem(STORAGE_KEY)
    //     if(value === null) {
    //         setIsEmptyStorage(true);
    //     } else {
    //         setIsEmptyStorage(false);
    //         setText(value);
    //     }
    // }
    return (
        <View style={styles.container}>
            <Calendar markedDates={{ [todayValue] : {marked: true, dotColor: 'red'}}} />
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
    calendar: {
        borderWidth: 1,
        borderColor: 'gray',
        height: 350,
    },
});

export default CalendarScreen;