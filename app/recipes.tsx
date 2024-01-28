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

export default function RecipesScreen() {
  const { state, dispatch } = useContext(GlobalContext);
  const selectedIngredients = state.selectedIngredients;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const recipe = doc.data() as Recipe;
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

        recipes.push(recipe);
      }

      console.log(recipes);

      setRecipes(recipes);
      setIsLoading(false);
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
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          numColumns={2}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  recipeItem: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
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
    color: "#666",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
