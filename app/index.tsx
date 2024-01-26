import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import Button from "../components/customButton";

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
      offlineAccess: true,
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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.title}>CookAI</Text>

        <TextInput
          style={styles.input}
          value={email}
          placeholder="E-posta adresi"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
          placeholder="Şifre"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />

        <View style={styles.buttonContainer}>
          <View style={{ width: 20, height: 20 }} />

          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInGoogle}
          />

          <View style={{ width: 20, height: 20 }} />

          <Button onPress={signIn} title="Giriş yap" />

          <View style={{ width: 20, height: 20 }} />

          <Button
            onPress={() => route.replace("/register")}
            title="Hesabın yok mu? Kayıt ol"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    marginHorizontal: 40,
  },
  title: {
    fontSize: 36,
    paddingBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
