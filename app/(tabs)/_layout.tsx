import React from "react";
import { Tabs } from "expo-router";
import theme from "../../custom-theme.json";

const Page = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Ana sayfa",
          tabBarLabel: "Ana sayfa",
          tabBarStyle: {
            backgroundColor: theme["color-primary-100"],
          },
          headerStyle: {
            backgroundColor: theme["color-primary-100"],
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          tabBarStyle: {
            backgroundColor: theme["color-basic-transparent-600"],
          },
          headerStyle: {
            backgroundColor: theme["color-basic-transparent-600"],
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Tabs>
  );
};

export default Page;
