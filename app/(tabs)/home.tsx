import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { Link, useRouter } from 'expo-router'
import Button from '../../components/customButton';
import { RootState } from '../ingredients'
import { GlobalContext } from '../../context/GlobalState';


const Page = () => {
    const route = useRouter()
    const { state, dispatch } = useContext(GlobalContext);
    const selectedIngredients = state.selectedIngredients;

    const handleClearAll = () => {
        dispatch({ type: 'CLEAR_ALL' });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ana Sayfa</Text>
       
            <Text style={styles.ingredients}>Seçilen Malzemeler: {selectedIngredients.join(", ")}</Text>

            <View style={{ width: 20, height: 20 }} />

            <Link href="/ingredients" asChild>
                <Button title="Malzemeleri seç" />
            </Link>

            <View style={{ width: 20, height: 20 }} />

            <Button title="Seçimleri temizle" onPress={handleClearAll} />

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
    ingredients: {
        fontSize: 16
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