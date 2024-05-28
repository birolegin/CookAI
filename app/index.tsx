import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { Layout, Text, Input, Button, Card } from "@ui-kitten/components";
import { LogBox } from "react-native"

const Page = () => {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "892809679715-fenqeqgeco7297fiaphpejpon1j16s0a.apps.googleusercontent.com",
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        route.replace("/home");
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = signInWithEmailAndPassword(auth, email, password);
      console.log((await response).user);
      Alert.alert("Hoşgeldin", "Giriş başarılı!");
      route.replace("/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Hata", "Giriş yapılamadı: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const googleUser: any = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(
        googleUser.idToken
      );
      const firebaseUser = await signInWithCredential(auth, googleCredential);
      console.log(firebaseUser);
      route.replace("/home");
    } catch (error: any) {
      console.error(error);
    }
  };

  LogBox.ignoreAllLogs(true)

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#FFE7AF",
      }}
    >
      <KeyboardAvoidingView behavior="padding">
        <Image
          source={{
            uri: "https://cdn.pixabay.com/photo/2023/08/05/15/52/ai-generated-8171361_1280.png",
          }}
          style={{
            width: 370,
            height: 370,
            resizeMode: "center",
            alignItems: "center",
          }}
        />
        <Text category="h1" style={{ textAlign: "center" }}>
          CookAI
        </Text>

        <Input
          value={email}
          placeholder="E-posta adresi"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          style={{ marginTop: 16 }}
        />

        <Input
          value={password}
          placeholder="Şifre"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          style={{ marginTop: 16 }}
        />

        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={signInGoogle}
          style={{
            marginTop: 16,
            alignSelf: "center",
            backgroundColor: "black",
          }}
        />

        <Button
          onPress={signIn}
          style={{ marginTop: 16, backgroundColor: "black" }}
        >
          Giriş yap
        </Button>

        <Button
          onPress={() => route.replace("/register")}
          style={{ marginTop: 16, backgroundColor: "black" }}
        >
          Hesabın yok mu? Kayıt ol
        </Button>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default Page;
