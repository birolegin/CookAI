import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GlobalContext, Recipe } from "../context/GlobalState";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Layout } from "@ui-kitten/components";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

export default function RecipesScreen() {
  const { state, dispatch } = useContext(GlobalContext);
  const selectedIngredients = state.selectedIngredients;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noRecipesFound, setNoRecipesFound] = useState(false); // State to track if no recipes are found

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      const db = getFirestore();
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("ingredients", "array-contains-any", selectedIngredients)
      );
      const querySnapshot = await getDocs(q);
      const recipes: Recipe[] = [];

      for (let doc of querySnapshot.docs) {
        const recipe = {
          id: doc.id,
          ...doc.data(),
        } as Recipe;
        recipe.matchedIngredients = recipe.ingredients.filter((ingredient) =>
          selectedIngredients.includes(ingredient)
        ).length;
        const ratings: any = [];
        const ratingsSnapshot = await getDocs(collection(doc.ref, "ratings"));
        ratingsSnapshot.forEach((doc) => {
          ratings.push(doc.data());
        });
        recipe.ratings = ratings;

        const comments: any = [];
        const commentsSnapshot = await getDocs(collection(doc.ref, "comments"));
        commentsSnapshot.forEach((doc) => {
          comments.push(doc.data());
        });
        recipe.comments = comments;

        if (recipe.matchedIngredients >= 3) {
          recipes.push(recipe);
        }
      }
      recipes.sort((a, b) => b.matchedIngredients - a.matchedIngredients);
      console.log(recipes);

      setRecipes(recipes);
      setIsLoading(false);

      // Check if no recipes are found
      if (recipes.length === 0) {
        setNoRecipesFound(true);
      } else {
        setNoRecipesFound(false);
      }
    };

    fetchRecipes();
  }, [selectedIngredients]);

  const handleRecipeSelection = (recipe: Recipe) => {
    dispatch({ type: "SELECT_RECIPE", payload: recipe });
    router.push("/recipeDetails");
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => {
    return (
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() => handleRecipeSelection(item)}
      >
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.recipeDetails}>Kalori: {item.calories}</Text>
          <Text style={styles.recipeDetails}>
            Pişirme Süresi: {item.cookTime} dakika
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView contentContainerStyle={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFAC7C" />
          ) : noRecipesFound ? (
            <Text style={styles.noRecipesText}>
              Tarif bulunamadı. Yeniden deneyin.
            </Text>
          ) : (
            <FlatList
              data={recipes}
              renderItem={renderRecipeItem}
              numColumns={2}
              keyExtractor={(item) => item.name}
              contentContainerStyle={styles.listContent}
            />
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  recipeItem: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  recipeImage: {
    width: "100%",
    height: 150,
  },
  recipeInfo: {
    padding: 10,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recipeDetails: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  noRecipesText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
