import React, { useContext, useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { GlobalContext } from '../context/GlobalState';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Button, Card, Input, Layout, Text } from '@ui-kitten/components';


const RecipeDetailsScreen = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const { selectedRecipe } = state;
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const numberOfCommentsToShow = 5;

    if (!selectedRecipe) {
        return (
            <View style={styles.container}>
                <Text >Tarif seçmediniz</Text>
            </View>
        );
    }

    useEffect(() => {
        if (selectedRecipe && selectedRecipe.ratings) {
            const avgRating = selectedRecipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) / selectedRecipe.ratings.length;
            setAverageRating(avgRating);
        }
    }, [selectedRecipe]);

    useEffect(() => {
        const checkIfSaved = async () => {
            const db = getFirestore();
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                const savedRecipes = userDoc.data()?.savedRecipes || [];

                setIsSaved(!!savedRecipes.find((r: any) => r.id === selectedRecipe.id));
            }
        };

        checkIfSaved();
    }, [selectedRecipe]);

    const handleSubmit = async () => {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const ratingsRef = collection(db, 'recipes', selectedRecipe.id, 'ratings');
            const commentsRef = collection(db, 'recipes', selectedRecipe.id, 'comments');

            // Check if the user has already rated
            const userRatingSnapshot = await getDocs(query(ratingsRef, where('uid', '==', user.uid)));
            if (userRatingSnapshot.empty) {
                // Save the rating
                await addDoc(ratingsRef, { uid: user.uid, username: user.displayName, rating: userRating });
            } else {
                // Update the rating
                await updateDoc(doc(db, 'recipes', selectedRecipe.id, 'ratings', userRatingSnapshot.docs[0].id), { rating: userRating });
            }

            // Check if the user has already commented
            const userCommentSnapshot = await getDocs(query(commentsRef, where('uid', '==', user.uid)));
            if (userCommentSnapshot.empty) {
                // Save the comment
                await addDoc(commentsRef, { uid: user.uid, username: user.displayName, comment: userComment });
            } else {
                // Update the comment
                await updateDoc(doc(db, 'recipes', selectedRecipe.id, 'comments', userCommentSnapshot.docs[0].id), { comment: userComment });
            }

            alert('Your rating and comment have been saved.');
        } else {
            alert('You must be logged in to rate and comment on a recipe.');
        }
    };

    const saveRecipe = async () => {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            const savedRecipes = userDoc.data()?.savedRecipes || [];

            let updatedSavedRecipes;
            if (isSaved) {
                updatedSavedRecipes = savedRecipes.filter((r: any) => r.id !== selectedRecipe.id);
            } else {
                updatedSavedRecipes = [...savedRecipes, selectedRecipe];
            }

            await updateDoc(userRef, { savedRecipes: updatedSavedRecipes });
            setIsSaved(!isSaved);
        } else {
            alert('You must be logged in to save a recipe.');
        }
    };

    useEffect(() => {
        const db = getFirestore();
        const ratingsRef = collection(db, 'recipes', selectedRecipe.id, 'ratings');
        const commentsRef = collection(db, 'recipes', selectedRecipe.id, 'comments');

        const unsubscribeRatings = onSnapshot(ratingsRef, (snapshot) => {
            let ratings: any = [];
            snapshot.forEach((doc) => {
                ratings.push(doc.data());
            });

            // Update the state with the new ratings
            dispatch({ type: 'UPDATE_RATINGS', payload: ratings });
        });

        const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
            let comments: any = [];
            snapshot.forEach((doc) => {
                comments.push(doc.data());
            });

            // Update the state with the new comments
            dispatch({ type: 'UPDATE_COMMENTS', payload: comments });
        });

        return () => {
            unsubscribeRatings();
            unsubscribeComments();
        };
    }, [selectedRecipe.id]);

    return (
        <Layout style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.container}>
                    <Image source={{ uri: selectedRecipe.image }} style={{ width: '100%', height: 200, resizeMode: 'cover' }} />
                    <Layout style={{ padding: 15 }}>
                        <Text category='h3' style={{ marginBottom: 10 }}>{selectedRecipe.name}</Text>
                        
                        <Text style={{ marginBottom: 5 }}>Kalori: {selectedRecipe.calories}</Text>
                        <Text style={{ marginBottom: 20 }}>Pişirme süresi: {selectedRecipe.cookTime} dakika</Text>
                        <Button style={{ marginBottom: 10, backgroundColor: "black" }} onPress={saveRecipe}>{isSaved ? "Tarifi kaydedilenlerden kaldır" : "Tarifi kaydet"}</Button>
                        <Text category='h5' style={{ marginTop: 20, marginBottom: 10 }}>Adımlar</Text>
                        {selectedRecipe.steps && selectedRecipe.steps.map((instruction, index) => (
                            <Text key={index} style={{ marginBottom: 10 }}>{instruction}</Text>
                        ))}
                        <Text category='h5' style={{ marginTop: 20, marginBottom: 10 }}>Tarifi değerlendir</Text>
                        
                        <Input
                            style={{ marginVertical: 10 }}
                            value={userComment}
                            onChangeText={(text) => setUserComment(text)}
                            placeholder="Yorumunuz"
                        />
                        <Button style={{ marginBottom: 10, backgroundColor: "black" }} onPress={handleSubmit}>Yorumu gönder</Button>
                        <Text category='h5' style={{ marginTop: 20, marginBottom: 10 }}>Yorumlar</Text>
                        {selectedRecipe.comments && selectedRecipe.comments.slice(-numberOfCommentsToShow).map((comment, index) => (
                            <Layout key={index} style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10 }}>
                                <Text category='h6'>{comment.username}</Text>
                                <Text >{comment.comment}</Text>
                            </Layout>
                        ))}
                    </Layout>
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recipeImage: {
        width: '100%',
        height: 200,
    },
    detailsContainer: {
        padding: 15,
    },
    recipeName: {
        fontSize: 26, // make the font size larger
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    recipeCalories: {
        fontSize: 18, // make the font size larger
        color: '#666',
        marginBottom: 5, // reduce the bottom margin
    },
    recipeCookTime: {
        fontSize: 18, // make the font size larger
        color: '#666',
        marginBottom: 20, // increase the bottom margin to create more space before the next section
    },
    headerText: {
        fontSize: 22, // make the font size larger
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20, // increase the top margin to create more space from the previous section
        marginBottom: 5,
    },
    headerText2: {
        fontSize: 22, // make the font size larger
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10, // increase the top margin to create more space from the previous section
        marginBottom: 5,
    },
    commentContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    commentUsername: {
        fontWeight: 'bold',
        color: '#333',
    },
    commentText: {
        color: '#666',
    },
    inputField: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
});

export default RecipeDetailsScreen;
