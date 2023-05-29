import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

function CalendarScreen({ successData }) {
    const [marking, setMarking] = useState({});
    function handleMarking() {
        if(successData.length !==0) {
            successData.forEach((data) => {
                setMarking({
                    ...marking,
                    [data.key] : {marked : data.success}
                })
            });
        }
    }
    useEffect(() => {
        handleMarking();
    }, [successData]);
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