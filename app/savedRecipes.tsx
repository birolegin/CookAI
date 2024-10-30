import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { GlobalContext, Recipe } from '../context/GlobalState';
import { getFirestore, doc, getDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Text } from '@ui-kitten/components';

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const SavedRecipesScreen = () => {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const { dispatch } = useContext(GlobalContext);
    const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);

    const handleRecipeSelection = (recipe: any) => {
        dispatch({ type: 'SELECT_RECIPE', payload: recipe });
        router.push('/recipeDetails')
    };

    const fetchRandomRecipes = async () => {
        const db = getFirestore();
        const recipesRef = collection(db, 'recipes');
        const querySnapshot = await getDocs(recipesRef);
        const allRecipes: Recipe[] = [];

        for (let doc of querySnapshot.docs) {
            allRecipes.push({
                id: doc.id,
                ...doc.data()
            } as Recipe);
        };

        shuffleArray(allRecipes);

        return allRecipes.slice(0, 3);
    };

    useEffect(() => {
        if (savedRecipes.length === 0) {
            fetchRandomRecipes().then(setRandomRecipes);
        }
    }, [savedRecipes]);

    useEffect(() => {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userRef = doc(db, 'users', user.uid);

            const unsubscribe = onSnapshot(userRef, (doc) => {
                setSavedRecipes(doc.data()?.savedRecipes || []);
            });

            return unsubscribe;
        }
    }, []);

    const renderSavedRecipeItem = ({ item }: any) => (
       <GestureHandlerRootView>
       <TouchableOpacity onPress={() => handleRecipeSelection(item)}>
            <View style={styles.recipeItem}>
                <Image source={{ uri: item.image }} style={styles.recipeImage} />
                <Text style={styles.recipeName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
        </GestureHandlerRootView>
    );
    return (
        <Layout style={{ flex: 1 }}>
            {savedRecipes.length > 0 ? (
                <FlatList
                    data={savedRecipes}
                    renderItem={renderSavedRecipeItem}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <>
                    <Text category='h6' style={{ textAlign: 'center', padding: 20 }}>Kaydedilen tarif bulunamadı.</Text>
                    <Text category='h4' style={{ padding: 10 }}>Önerilenler</Text>
                    <FlatList
                        data={randomRecipes}
                        renderItem={renderSavedRecipeItem}
                        keyExtractor={(item) => item.id}
                    />
                </>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    recipeItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    recipeImage: {
        width: '100%',
        height: 200,
    },
    recipeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    suggestionsText: {
        padding: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
    noRecipesText: {
        padding: 10,
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default SavedRecipesScreen;