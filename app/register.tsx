import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Button from "../components/customButton";

const Page = () => {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      const response = createUserWithEmailAndPassword(auth, email, password);
      console.log((await response).user);
      Alert.alert("Kayıt başarılı.");
      route.replace("/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Kullanıcı kaydı yapılamadı: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    route.replace("/");
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.title}>CookAI</Text>

        <Text style={styles.subtitle}>Hesabını oluştur.</Text>

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

          <Button onPress={signUp} title="Kayıt Ol" />

          <View style={{ width: 20, height: 20 }} />

          <Button onPress={goBack} title="Geri dön." />

          <View style={{ width: 20, height: 20 }} />
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
  subtitle: {
    fontSize: 24,
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
