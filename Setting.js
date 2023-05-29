import { Text, View, StyleSheet, Switch } from 'react-native';

function Setting({ isVibrationEnabled, setIsVibrationEnabled, isSoundEnabled, setIsSoundEnabled }) {
    const VibrationtoggleSwitch = () => setIsVibrationEnabled((previousState) => !previousState);
    const SoundtoggleSwitch = () => setIsSoundEnabled((previousState) => !previousState);
    return (
        <View style={styles.container}>
            <View>
                <Text>버튼 진동 활성화</Text>
                <Switch 
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isVibrationEnabled ? '#f5dd4b' : '#f4f3f4'}
                    onValueChange={VibrationtoggleSwitch}
                    value={isVibrationEnabled}
                />
            </View>
            <View>
                <Text>버튼 소리 활성화</Text>
                <Switch 
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isSoundEnabled ? '#f5dd4b' : '#f4f3f4'}
                    onValueChange={SoundtoggleSwitch}
                    value={isSoundEnabled}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
})

export default Setting;