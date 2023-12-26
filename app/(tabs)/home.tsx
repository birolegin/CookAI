import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const Page = () => {
    const route = useRouter()
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ana Sayfa</Text>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        paddingBottom: 16,
        fontWeight: 'bold'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff"
    },
})