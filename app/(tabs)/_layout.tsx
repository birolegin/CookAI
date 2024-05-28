import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import theme from "../../custom-theme.json";


const Page = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Ana sayfa",
          tabBarLabel: "Ana sayfa",
          tabBarIcon: () => {
            return <Ionicons name={"home-outline"} size={24}></Ionicons>;
          },
          tabBarStyle: {
            backgroundColor: theme["color-basic-400"],
          },
          headerStyle: {
            backgroundColor: theme["color-basic-400"],
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarLabel: "AI",
          tabBarIcon: () => {
            return <Ionicons name={"camera-outline"} size={24}></Ionicons>;
          },
          tabBarStyle: {
            backgroundColor: theme["color-basic-400"],
          },
          headerStyle: {
            backgroundColor: theme["color-basic-400"],
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
          tabBarIcon: () => {
            return <Ionicons name={"person-outline"} size={24}></Ionicons>;
          },
          tabBarStyle: {
            backgroundColor: "#FFE7AF"
          },
          headerStyle: {
            backgroundColor: "#FFE7AF"
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
