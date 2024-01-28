import { View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Link, useRouter } from "expo-router";
import Button from "../../components/customButton";
import { GlobalContext } from "../../context/GlobalState";
import { Animated } from "react-native";
import {
  RectButton,
  ScrollView,
  Swipeable,
} from "react-native-gesture-handler";

const Page = () => {
  const route = useRouter();
  const { state, dispatch } = useContext(GlobalContext);
  const selectedIngredients = state.selectedIngredients;

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const handleRemoveIngredient = (index: any) => {
    dispatch({ type: "REMOVE_INGREDIENT", payload: index });
  };

  const SwipeableRow = ({ children, handleSwipe }: any) => {
    const renderRightActions = (progress: any, dragX: any) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });

      return (
        <RectButton style={styles.rightAction} onPress={handleSwipe}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ scale }],
              },
            ]}
          >
            Listeden kaldırmak için dokun.
          </Animated.Text>
        </RectButton>
      );
    };

    return (
      <Swipeable renderRightActions={renderRightActions}>{children}</Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana Sayfa</Text>

      <View style={styles.ingredientsCard}>
        <ScrollView>
          {selectedIngredients.length > 0 ? (
            selectedIngredients.map((ingredient, index) => (
              <SwipeableRow
                key={index}
                handleSwipe={() => handleRemoveIngredient(index)}
              >
                <Text style={styles.ingredients}>{ingredient}</Text>
              </SwipeableRow>
            ))
          ) : (
            <Text style={styles.ingredients}>Malzeme seçmediniz.</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/ingredients" asChild>
          <Button
            title="Malzemeleri seç"
            style={{ backgroundColor: "green" }}
          />
        </Link>
        <View style={{ width: 20, height: 20 }} />
        {selectedIngredients.length > 0 ? (
          <Link href={"/recipes"} asChild>
            <Button
              title="Tarif bul"
              disabled={selectedIngredients.length === 0}
              style={{ backgroundColor: "blue" }}
            />
          </Link>
        ) : (
          <Button
            title="Tarif bul"
            disabled={selectedIngredients.length === 0}
            disabledStyle={{ backgroundColor: "gray" }}
          />
        )}
        <View style={{ width: 20, height: 20 }} />
        <Button
          title="Seçimleri temizle"
          onPress={handleClearAll}
          style={{ backgroundColor: "red" }}
        />
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 36,
    paddingBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  ingredientsCard: {
    maxHeight: 250,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  ingredients: {
    fontSize: 16,
    textAlign: "left",
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginVertical: 5,
    borderRadius: 5,
  },
  rightAction: {
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    marginVertical: 5,
    borderRadius: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
