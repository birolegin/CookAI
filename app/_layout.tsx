import React from "react";
import { Stack } from "expo-router";
import { GlobalProvider } from "../context/GlobalState";

const Layout = () => {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Giriş Yap",
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: "Kayıt Ol",
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ingredients"
          options={{
            presentation: "modal",
            title: "Malzemeler",
          }}
        />
        <Stack.Screen
          name="recipes"
          options={{
            title: "Tarifler",
          }}
        />
        <Stack.Screen
          name="recipeDetails"
          options={{
            presentation: "modal",
            title: "Tarif Detayları",
          }}
        />
      </Stack>
    </GlobalProvider>
  );
};

export default Layout;
