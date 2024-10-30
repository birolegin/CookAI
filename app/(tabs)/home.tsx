import React, { useContext, useEffect, useState } from "react";
import { RootState } from "../ingredients";
import { router, useRouter } from "expo-router";
import { GlobalContext, Recipe } from "../../context/GlobalState";
import { Layout, Text, Card, Button, List } from "@ui-kitten/components";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { Image, View, StyleSheet, ScrollView } from "react-native";

const Page = () => {
  const route = useRouter();
  const { state, dispatch } = useContext(GlobalContext);
  const selectedIngredients = state.selectedIngredients;
  const [recipeOfTheMonth, setRecipeOfTheMonth] = useState<Recipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  useEffect(() => {
    const fetchRecipeOfTheMonth = async () => {
      try {
        const db = getFirestore();
        const recipeOfTheMonthQuery = query(collection(db, "recipeofthemonth"));
        const querySnapshot = await getDocs(recipeOfTheMonthQuery);

        if (querySnapshot.empty) {
          console.error("No documents found!");
        } else {
          const recipeOfTheMonthDoc = querySnapshot.docs[0];
          const recipeId = recipeOfTheMonthDoc.data().recipeId;

          const recipeRef = doc(db, "recipes", recipeId);
          const recipeDoc = await getDoc(recipeRef);
          const recipeData = recipeDoc.data();

          if (recipeData) {
            setRecipeOfTheMonth({ id: recipeId, ...recipeData } as Recipe);
          } else {
            console.error("No data in document!");
          }
        }
      } catch (error) {
        console.error("Error fetching recipe of the month:", error);
      } finally {
        setLoadingRecipe(false);
      }
    };
    fetchRecipeOfTheMonth();
  }, []);

  const handleSelectRecipe = () => {
    if (recipeOfTheMonth) {
      dispatch({ type: "SELECT_RECIPE", payload: recipeOfTheMonth });
      router.push("/recipeDetails");
    } else {
      console.error("Recipe of the month is not available");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Layout style={styles.innerContainer}>
        <Text category="h1" style={styles.headerText}>
          Cook AI
        </Text>

        {loadingRecipe ? (
          <Text>Ayın tarifi yükleniyor...</Text>
        ) : (
          <Layout style={styles.recipeContainer}>
            {recipeOfTheMonth ? (
              <View style={styles.recipeCard}>
                <Text category="h5">Ayın Tarifi</Text>
                <Text category="h5" style={styles.recipeTitle}>
                  {recipeOfTheMonth.name}
                </Text>
                <Image
                  source={{
                    uri: "https://evdekilerle.com/img/Kad%C4%B1nbudu%20K%C3%B6fte.jpg",
                  }}
                  style={styles.recipeImage}
                />
                <Button style={styles.button} onPress={handleSelectRecipe}>
                  Tarife git
                </Button>
              </View>
            ) : (
              <Text>Ayın tarifi bulunamadı.</Text>
            )}
          </Layout>
        )}
      </Layout>

      <Layout style={styles.ingredientsContainer}>
        <View style={styles.ingredientsList}>
          {selectedIngredients.length > 0 ? (
            selectedIngredients.map((ingredient, index) => (
              <Text category="h6" key={index}>
                {ingredient}
              </Text>
            ))
          ) : (
            <Text category="h6">Malzeme seçmediniz.(En az 3 seçim.)</Text>
          )}
        </View>

        <Button
          style={styles.button}
          onPress={() => route.push("/ingredients")}
        >
          Malzemeleri seç
        </Button>

        {selectedIngredients.length > 0 ? (
          <Button style={styles.button} onPress={() => route.push("/recipes")}>
            Tarif bul
          </Button>
        ) : (
          <Button style={styles.disabledButton} disabled>
            Tarif bul
          </Button>
        )}

        <Button style={styles.button} onPress={handleClearAll}>
          Seçimleri temizle
        </Button>
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFE7AF",
    padding: 10,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFE7AF",
  },
  headerText: {
    padding: 10,
    textAlign: "center",
    fontSize: 24,
  },
  recipeContainer: {
    backgroundColor: "#FFE7AF",
  },
  recipeCard: {
    backgroundColor: "#FFE7AF",
    padding: 10,
    marginVertical: 10,
  },
  recipeTitle: {
    paddingVertical: 5,
  },
  recipeImage: {
    width: "80%",
    height: 200,
    resizeMode: "cover",
    marginVertical: 10,
  },
  ingredientsContainer: {
    flex: 2,
    justifyContent: "flex-end",
    backgroundColor: "#FFE7AF",
    maxHeight: 300,
  },
  ingredientsList: {
    minHeight: 100,
    marginVertical: 15,
    backgroundColor: "#FFE7AF",
  },
  button: {
    marginVertical: 5,
    backgroundColor: "black",
  },
  disabledButton: {
    marginVertical: 5,
    backgroundColor: "grey",
  },
});

export default Page;
