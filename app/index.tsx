import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  ScrollView,
  Platform,
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
import { LogBox } from "react-native";

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

  LogBox.ignoreAllLogs(true);

  const { width } = Dimensions.get("window");

  return (
    <Layout style={styles.container}>
      <View style={styles.scrollViewContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust this value as needed
        >
          <ScrollView>
            <Image
              source={{
                uri: "https://cdn.pixabay.com/photo/2023/08/05/15/52/ai-generated-8171361_1280.png",
              }}
              style={[styles.image, { width: width * 0.9, height: width * 0.9 }]}
            />
            <Text category="h1" style={styles.title}>
              CookAI
            </Text>

            <Input
              value={email}
              placeholder="E-posta adresi"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />

            <Input
              value={password}
              placeholder="Şifre"
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
            />

            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={signInGoogle}
              style={styles.googleButton}
            />

            <Button onPress={signIn} style={styles.button}>
              Giriş yap
            </Button>

            <Button onPress={() => route.replace("/register")} style={styles.button}>
              Hesabın yok mu? Kayıt ol
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFE7AF",
  },
  scrollViewContent: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  image: {
    resizeMode: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    marginTop: 16,
  },
  googleButton: {
    marginTop: 16,
    alignSelf: "center",
  },
  button: {
    marginTop: 16,
    backgroundColor: "black",
  },
});

export default Page;
