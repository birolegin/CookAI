
import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
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
    </Stack>
  );
};

export default Layout;
