import { useState } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';

function Setting() {
    const [isEnabled, setIsEnabled] = useState(false);
    return (
        <View style={styles.container}>
            <View>
                <Text>진동 활성화</Text>
                <Switch />
            </View>
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

export default Setting;