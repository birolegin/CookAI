import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { GlobalContext } from '../context/GlobalState';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native';
import { Avatar, Card, Input, Layout, List, ListItem } from '@ui-kitten/components';
import { Dimensions } from 'react-native';


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
    const [searchTerm, setSearchTerm] = useState('');
    const windowWidth = Dimensions.get('window').width;

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
            </TouchableOpacity>
        );
    };

    return (
        <Layout style={{ flex: 1, padding: 10 }}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FFE7AF" />
            ) : (
                <Layout style={{ flex: 1 }}>
                    <Input
                        style={{ marginVertical: 10 }}
                        placeholder="Malzeme Ara"
                        value={searchTerm}
                        onChangeText={text => setSearchTerm(text)}
                    />
                    <List
                        data={ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                        renderItem={renderIngredientItem}
                        keyExtractor={(item) => item.name}
                        numColumns={2}
                    />
                </Layout>
            )}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ingredientItem: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    ingredientImageContainer: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: 10,
    },
    ingredientImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    ingredientName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selectedIngredientItem: {
        backgroundColor: '#FFE7AF',
    },
    listContent: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        justifyContent: 'space-evenly',
    },
});