import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { GlobalContext } from '../context/GlobalState';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native';
import Button from '../components/customButton';

interface Ingredient {
    name: string;
    image: string;
}

export interface RootState {
    ingredients: {
        selectedIngredients: string[],
    };
}

export default function IngredientsScreen() {
    const { width } = useWindowDimensions();
    const { state, dispatch } = useContext(GlobalContext);
    const selectedIngredients = state.selectedIngredients;
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIngredients = async () => {
            setIsLoading(true);
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, 'ingredients'));
            const ingredients: Ingredient[] = [];

            querySnapshot.forEach((doc) => {
                ingredients.push(doc.data() as Ingredient);
            });

            setIngredients(ingredients);
            setIsLoading(false);
        };

        fetchIngredients();
    }, []);

    const handleIngredientSelection = (name: string) => {
        dispatch({ type: 'TOGGLE_INGREDIENT', payload: name });
    };

    const renderIngredientItem = ({ item }: { item: Ingredient }) => {
        const isSelected = selectedIngredients.includes(item.name);

        return (
            <TouchableOpacity
                style={[styles.ingredientItem, isSelected && styles.selectedIngredientItem]}
                onPress={() => handleIngredientSelection(item.name)}
            >
                <View style={styles.ingredientImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.ingredientImage} />
                </View>
                <Text style={styles.ingredientName}>{item.name}</Text>
                {isSelected && <View style={styles.selectionIndicator} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { width }]}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#000000" />
            ) : (
                <FlatList
                    data={ingredients}
                    renderItem={renderIngredientItem}
                    numColumns={2}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        paddingBottom: 30,
                    }}
                />
            )}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ingredientItem: {
        flexDirection: 'column',
        padding: 10,
        borderBottomWidth: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 5,
        marginVertical: 5,
        width: '48%',
    },
    ingredientImageContainer: {
        width: '100%',
        aspectRatio: 1,
    },
    ingredientImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    ingredientName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
        margin: 5,
    },
    selectedIngredientItem: {
        backgroundColor: '#f5f5f5',
        borderColor: '#009688',
    },
    selectionIndicator: {
        width: 16,
        height: 16,
        backgroundColor: '#009688',
        borderRadius: 8,
        position: 'absolute',
        top: 10,
        right: 10,
    },
});