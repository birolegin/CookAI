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
import { ScrollView } from "react-native-gesture-handler";

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
    <Layout style={{ flex: 1, padding: 10 , backgroundColor: "#FFE7AF"}}>
      <Layout style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFE7AF"}}>
        <Text category="h1" style={{ padding: 10, textAlign: "center"}}>
          CookAI
        </Text>

        {loadingRecipe ? (
          <Text>Ayın tarifi yükleniyor...</Text>
        ) : (
          <Layout style={{backgroundColor: "#FFE7AF"}}>
            {recipeOfTheMonth ? (
              <Card header={<Text category="h5">Ayın Tarifi</Text>}>
                <Text category="h5" style={{ padding: 5 }}>
                  {recipeOfTheMonth.name}
                </Text>
                <Button onPress={handleSelectRecipe}>Tarife git</Button>
              </Card>
            ) : (
              <Text>Ayın tarifi bulunamadı.</Text>
            )}
          </Layout>
        )}
      </Layout>

      <Layout style={{ flex: 2, justifyContent: "flex-end", backgroundColor: "#FFE7AF"}}>
        <Card style={{ maxHeight: 250, marginVertical: 15, backgroundColor: "#FFE7AF", borderBlockColor:"black"}}>
          {selectedIngredients.length > 0 ? (
            selectedIngredients.map((ingredient, index) => (
              <Text category="h6" key={index}>
                {ingredient}
              </Text>
            ))
          ) : (
            <Text category="h6" style={{backgroundColor: "#FFE7AF"}}>Malzeme seçmediniz.</Text>
          )}
        </Card>

        <Button
          style={{ marginVertical: 5, backgroundColor: "black"}}
          onPress={() => route.push("/ingredients")}
        >
          Malzemeleri seç
        </Button>

        {selectedIngredients.length > 0 ? (
          <Button
            style={{ marginVertical: 5 , backgroundColor: "black"}}
            onPress={() => route.push("/recipes")}
          >
            Tarif bul
          </Button>
        ) : (
          <Button style={{ marginVertical: 5 }} disabled>
            Tarif bul
          </Button>
        )}

        <Button style={{ marginVertical: 5 , backgroundColor: "black"}} onPress={handleClearAll}>
          Seçimleri temizle
        </Button>
      </Layout>
    </Layout>
  );
};

export default Page;
