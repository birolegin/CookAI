import React, { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import {
  Layout,
  Text,
  Input,
  Button,
  Card,
  Avatar,
  Modal as KittenModal,
  Icon,
} from "@ui-kitten/components";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { signOut, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface UserDetails {
  height: string;
  weight: string;
  bmi: string;
  dailyCalories: string;
}

const Page = () => {
  const route = useRouter();
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [height, setHeight] = useState(userDetails?.height || "");
  const [weight, setWeight] = useState(userDetails?.weight || "");
  const [bmi, setBmi] = useState(userDetails?.bmi || "");
  const [dailyCalories, setDailyCalories] = useState(
    userDetails?.dailyCalories || ""
  );

  useEffect(() => {
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      const unsubscribe = onSnapshot(userRef, (doc) => {
        setUserDetails(doc.data() as UserDetails | null);
      });

      return unsubscribe;
    }
  }, [user]);

  useEffect(() => {
    setHeight(userDetails?.height || "");
    setWeight(userDetails?.weight || "");
    setBmi(userDetails?.bmi || "");
    setDailyCalories(userDetails?.dailyCalories || "");
  }, [userDetails]);

  const classifyBmi = (bmi: string) => {
    const value = parseFloat(bmi);

    if (value < 18.5) {
      return "Zayıf";
    } else if (value < 25) {
      return "Normal";
    } else if (value < 30) {
      return "Fazla Kilolu";
    } else {
      return "Obez";
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openDetailsModal = () => {
    setIsDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalVisible(false);
  };

  const updateUserDetails = async () => {
    const db = getFirestore();
    const userRef = doc(db, "users", user!.uid);

    const userDoc = await getDoc(userRef);

    const calculatedBmi = (
      parseInt(weight) / Math.pow(parseInt(height) / 100, 2)
    ).toFixed(1);

    const userDetails = {
      height: parseInt(height),
      weight: parseInt(weight),
      bmi: calculatedBmi,
      dailyCalories: parseInt(dailyCalories),
    };

    if (userDoc.exists()) {
      await updateDoc(userRef, userDetails);
    } else {
      await setDoc(userRef, userDetails);
    }

    alert("User details updated!");
    closeDetailsModal();
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      route.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  const sendPasswordReset = async () => {
    if (user?.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert("Şifre sıfırlama e-postası gönderildi!");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateDisplayName = async () => {
    if (!name) {
      alert("Kullanıcı adı girin!");
      return;
    }

    if (user) {
      try {
        await updateProfile(user, {
          displayName: name,
        });
        setDisplayName(name);
        setName("");
        alert("Kullanıcı adı güncellendi!");
        closeModal();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Layout style={{ flex: 1, padding: 10, backgroundColor: "#FFE7AF" }}>
      <GestureHandlerRootView>
        <ScrollView>
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              backgroundColor: "#FFE7AF",
            }}
          >
            <Avatar
              source={{ uri: user?.photoURL || "" }}
              style={{ width: 75, height: 75, marginRight: 10 }}
            />
            <Text category="h5" style={{ flex: 1 }}>
              {displayName}
            </Text>
          </Layout>

          <Layout style={{ padding: 20, backgroundColor: "#FFE7AF" }}>
            <Text category="h5" style={{ marginBottom: 10 }}>
              Kullanıcı Bilgileri
            </Text>
            <Card
              style={{
                marginBottom: 10,
                padding: 10,
                backgroundColor: "#FFE7AF",
              }}
            >
              <MaterialCommunityIcons
                name="human-male-height"
                size={32}
                color="black"
              />

              <Text category="h6">BOY</Text>

              <Text >{userDetails?.height || "-"} cm</Text>
            </Card>
            <Card
              style={{
                marginBottom: 10,
                padding: 10,
                backgroundColor: "#FFE7AF",
                borderTopColor: "black",
              }}
            >
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={32}
                color="black"
              />
              <Text category="h6">KİLO</Text>
              <Text >{userDetails?.weight || "-"} kg</Text>
            </Card>
            <Card
              style={{
                marginBottom: 10,
                padding: 10,
                backgroundColor: "#FFE7AF",
                borderTopColor: "black",
              }}
            >
              <MaterialCommunityIcons name="human" size={32} color="black" />
              <Text category="h6">VKİ</Text>
              <Text >
                {userDetails?.bmi || "-"} ({classifyBmi(userDetails?.bmi || "0")})
              </Text>
            </Card>
            <Card
              style={{
                marginBottom: 10,
                padding: 10,
                backgroundColor: "#FFE7AF",
                borderBlockColor: "black",
              }}
            >
              <MaterialCommunityIcons name="food" size={32} color="black" />
              <Text category="h6">Günlük alması gereken kalori miktarı</Text>
              <Text >{userDetails?.dailyCalories || "-"} kalori</Text>
            </Card>
          </Layout>

          <KittenModal
            visible={isDetailsModalVisible}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <Card disabled>
              <Text category="h6">Bilgileri güncelle</Text>
              <Input
                value={height}
                onChangeText={setHeight}
                placeholder="Boy (cm)"
                keyboardType="numeric"
              />
              <Input
                value={weight}
                onChangeText={setWeight}
                placeholder="Kilo (kg)"
                keyboardType="numeric"
              />
              <Input
                value={dailyCalories}
                onChangeText={setDailyCalories}
                placeholder="Günlük kalori ihtiyacı"
                keyboardType="numeric"
              />
              <Button
                style={{ backgroundColor: "black" }}
                onPress={updateUserDetails}
              >
                Güncelle
              </Button>
              <Button
                style={{ backgroundColor: "black" }}
                onPress={closeDetailsModal}
              >
                Kapat
              </Button>
            </Card>
          </KittenModal>

          <Layout
            style={{
              padding: 20,
              marginVertical: 10,
              backgroundColor: "#FFE7AF",
            }}
          >
            <Button
              style={{ marginVertical: 5, backgroundColor: "black" }}
              onPress={openDetailsModal}
            >
              Bilgileri güncelle
            </Button>
            <Button
              style={{ marginVertical: 5, backgroundColor: "black" }}
              onPress={() => route.push("/savedRecipes")}
            >
              Kaydedilen tarifler
            </Button>
            <Button
              style={{ marginVertical: 5, backgroundColor: "black" }}
              onPress={openModal}
            >
              Kullanıcı adı değiştir
            </Button>
            <Button
              style={{ marginVertical: 5, backgroundColor: "black" }}
              onPress={sendPasswordReset}
            >
              Şifre sıfırlama e-postası gönder
            </Button>
            <Button
              style={{ marginVertical: 5, backgroundColor: "black" }}
              onPress={logOut}
            >
              Çıkış Yap
            </Button>
          </Layout>

          <KittenModal
            visible={isModalVisible}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <Card disabled>
              <Layout style={{ padding: 10, marginVertical: 10 }}>
                <Text category="h6">Kullanıcı adı değiştir</Text>
                <Layout style={{ marginVertical: 5 }}></Layout>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Kullanıcı adı girin."
                />
                <Layout style={{ marginVertical: 5 }}></Layout>
                <Button
                  style={{ backgroundColor: "black" }}
                  onPress={updateDisplayName}
                >
                  Kullanıcı adı ayarla
                </Button>
                <Layout style={{ marginVertical: 5 }}></Layout>
                <Button style={{ backgroundColor: "black" }} onPress={closeModal}>
                  Kapat
                </Button>
              </Layout>
            </Card>
          </KittenModal>
        </ScrollView>
      </GestureHandlerRootView>
    </Layout>
  );
};

export default Page;
