import React from "react";
import { Stack } from "expo-router";
import { GlobalProvider } from "../context/GlobalState";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
} from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";

const Layout = () => {
  return (
    <GlobalProvider>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Giriş Yap",
              headerStyle: {
                backgroundColor: theme["color-basic-400"],
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              title: "Kayıt Ol",
              headerStyle: {
                backgroundColor: theme["color-basic-400"],
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: "",
              headerStyle: {
                backgroundColor: theme["color-basic-400"],

              },
            }}
          />
          <Stack.Screen
            name="ingredients"
            options={{
              presentation: "modal",
              title: "Malzemeler",
              headerStyle: {
                backgroundColor: theme["color-basic-400"],
              },
            }}
          />
          <Stack.Screen
            name="recipes"
            options={{
              title: "Tarifler",
              headerStyle: {
                backgroundColor: theme["color-basic-400"],
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="recipeDetails"
            options={{
              presentation: "modal",
              title: "Tarif Detayları",
              headerStyle: {
                backgroundColor: theme["color-basic-400"],
              },
            }}
          />
          <Stack.Screen
            name="savedRecipes"
            options={{
              presentation: "modal",
              title: "Kaydedilen Tarifler",
              headerStyle: {
                backgroundColor: theme["color-basic-400"],
              },
            }}
          />
        </Stack>
      </ApplicationProvider>
    </GlobalProvider>
  );
};

export default Layout;
