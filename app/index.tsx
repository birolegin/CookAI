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
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import Button from "../components/customButton";

const Page = () => {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
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

        <View style={{ width: 20, height: 20 }} />

        <Button onPress={signIn} title="Giriş yap" />

        <View style={{ width: 20, height: 20 }} />

        <Button
          onPress={() => route.push("/register")}
          title="Hesabın yok mu? Kayıt ol"
        />
        <Button
          onPress={() => route.replace("/register")}
          title="Hesabın yok mu? Kayıt ol"
        />
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
