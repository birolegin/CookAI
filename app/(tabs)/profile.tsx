import { View, Text, StyleSheet, Modal, Image } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Button from "../../components/customButton";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signOut, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Page = () => {
  const route = useRouter();
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.photoURL || "" }}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>{displayName}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>Kullanıcı Bilgileri</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BOY</Text>
          <Text style={styles.cardText}>180 cm</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>KİLO</Text>
          <Text style={styles.cardText}>70 kg</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>VKİ</Text>
          <Text style={styles.cardText}>21.6</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Günlük alması gereken kalori miktarı
          </Text>
          <Text style={styles.cardText}>2000 kalori</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Kaydedilen tarifler" onPress={() => {}} />
        <View style={{ width: 20, height: 20 }} />
        <Button title="Kullanıcı adı değiştir" onPress={openModal} />
        <View style={{ width: 20, height: 20 }} />
        <Button
          title="Şifre sıfırlama e-postası gönder"
          onPress={sendPasswordReset}
        />
        <View style={{ width: 20, height: 20 }} />
        <Button onPress={logOut} title="Çıkış Yap" />
      </View>
      <Modal animationType="slide" transparent visible={isModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Kullanıcı adı değiştir</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Kullanıcı adı girin."
              />
              <View style={styles.buttonContainer}>
                <Button
                  title="Kullanıcı adı ayarla"
                  onPress={updateDisplayName}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Kapat" onPress={closeModal} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    paddingBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black
  },
  welcomeContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  profileContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
});
