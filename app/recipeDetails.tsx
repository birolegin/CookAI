import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { GlobalContext } from "../context/GlobalState";
import StarRating from "react-native-star-rating";
import { TextInput } from "react-native-gesture-handler";
import Button from "../components/customButton";

const RecipeDetailsScreen = () => {
  const { state } = useContext(GlobalContext);
  const { selectedRecipe } = state;
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  if (!selectedRecipe) {
    return (
      <View style={styles.container}>
        <Text>Tarif seçmediniz</Text>
      </View>
    );
  }

  const averageRating = selectedRecipe.ratings
    ? selectedRecipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
      selectedRecipe.ratings.length
    : -1;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: selectedRecipe.image }}
        style={styles.recipeImage}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.recipeName}>{selectedRecipe.name}</Text>
        <Text style={styles.recipeCalories}>
          Kalori: {selectedRecipe.calories}
        </Text>
        <Text style={styles.recipeCookTime}>
          Pişirme süresi: {selectedRecipe.cookTime} dakika
        </Text>
        <Button title="Tarifi kaydet" onPress={() => {}} />
        <Text style={styles.headerText}>Derecelendirme</Text>
        <StarRating
          disabled={true}
          maxStars={5}
          rating={averageRating}
          starSize={20}
          fullStarColor={"gold"}
        />
        <Text style={styles.headerText}>Yorumlar</Text>
        {selectedRecipe.comments &&
          selectedRecipe.comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))}
        <Text style={styles.headerText}>Tarifi değerlendir</Text>
        <StarRating
          maxStars={5}
          rating={userRating}
          selectedStar={(rating: React.SetStateAction<number>) =>
            setUserRating(rating)
          }
          starSize={20}
          fullStarColor={"gold"}
        />
        <Text style={styles.headerText}>Bir yorum bırak</Text>
        <TextInput
          style={styles.inputField}
          value={userComment}
          onChangeText={(text) => setUserComment(text)}
          placeholder="Yorumunuz"
        />
        <Button title="Yorumu gönder" onPress={() => {}} />
      </View>
      <View style={{ width: 20, height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  recipeImage: {
    width: "100%",
    height: 200,
  },
  detailsContainer: {
    padding: 15,
  },
  recipeName: {
    fontSize: 26, // make the font size larger
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  recipeCalories: {
    fontSize: 18, // make the font size larger
    color: "#666",
    marginBottom: 5, // reduce the bottom margin
  },
  recipeCookTime: {
    fontSize: 18, // make the font size larger
    color: "#666",
    marginBottom: 20, // increase the bottom margin to create more space before the next section
  },
  headerText: {
    fontSize: 22, // make the font size larger
    fontWeight: "bold",
    color: "#333",
    marginTop: 20, // increase the top margin to create more space from the previous section
    marginBottom: 5,
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  commentUsername: {
    fontWeight: "bold",
    color: "#333",
  },
  commentText: {
    color: "#666",
  },
  inputField: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default RecipeDetailsScreen;
