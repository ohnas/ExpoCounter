import { Text, View, StyleSheet } from 'react-native';

function SayList() {
    return (
        <View style={styles.container}>
            <Text>Hello SayList</Text>
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

export default SayList;