import React from "react";
import { Tabs } from "expo-router";


const Page = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Ana sayfa",
          tabBarLabel: "Ana sayfa",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
        }}
      />
    </Tabs>
  );
};

export default Page;
