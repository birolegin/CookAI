import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

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
        }}
      />
    </Tabs>
  );
};

export default Page;
