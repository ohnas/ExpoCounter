import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function Counter() {
    const [today, setToday] = useState();
    const [text, setText] = useState();
    const [header, setHeader] = useState("noGoal");
    const [goal, setGoal] = useState("");
    const [now, setNow] = useState(0);
    function handleToday() {
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
        setToday(todayValue);
    }
    function onChangeText(payload) {
        setText(payload);
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
    function handleGoalPlusPress() {
      setNow((previous) => previous + 1);
      if(now === Number(goal)) {
        Alert.alert("알림", "🎉 축하합니다");
        setNow(0);
        return;
      }
    }
    function handleNoGoalPlusPress() {
      setNow((previous) => previous + 1);
    }
    function handleMinusPress() {
      setNow((previous) => previous - 1);
      if(now <= 0) {
        setNow(0);
        return;
      }
    }
    useEffect(() => {
        handleToday();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.infoDay}>{today}</Text>
                <TextInput style={styles.infoText} returnKeyType='done' onChangeText={onChangeText} value={text} placeholder="오늘 말할 목표를 적어주세요" />
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
                <Text style={styles.counterText}>{now}</Text>
                </View>
                <View>
                <TouchableOpacity style={styles.plus} onPress={handleNoGoalPlusPress}>
                    <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.minus} onPress={handleMinusPress}>
                    <Text style={styles.minusText}>-</Text>
                </TouchableOpacity>
                </View>
            </>
            :
            <>
                <View style={styles.counter}>
                <Text style={styles.counterText}>{now}</Text>
                <Text style={styles.goalText}>/</Text>
                <TextInput style={styles.goalText} inputMode='numeric' returnKeyType='done' onChangeText={handleGoal} value={goal} placeholder='목표' />
                </View>
                <View>
                <TouchableOpacity style={styles.plus} onPress={handleGoalPlusPress}>
                    <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.minus} onPress={handleMinusPress}>
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
});

export default Counter;