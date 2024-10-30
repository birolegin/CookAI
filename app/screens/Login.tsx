import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = signInWithEmailAndPassword(auth, email, password);
      console.log((await response).user);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Hata", "Giriş yapılamadı: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert("Kullancı kaydı yapılamadı: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CookAI</Text>

      <TextInput
        style={styles.input}
        value={email}
        placeholder="E-posta adresi"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        secureTextEntry={true}
        style={styles.input}
        value={password}
        placeholder="Şifre"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Giriş Yap" onPress={signIn} />
          <Button title="Yeni Hesap Oluştur" onPress={signUp} />
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    paddingBottom: 14,
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
