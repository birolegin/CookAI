import { View, KeyboardAvoidingView, TextInput, StyleSheet, Alert } from 'react-native'
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { FIREBASE_AUTH } from '../firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const Page = () => {
    const route = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH

    const signUp = async () => {
        setLoading(true);
        try {
            const response = createUserWithEmailAndPassword(auth, email, password);
            console.log((await response).user);
            Alert.alert("Kayıt başarılı.")
            route.replace("/home")
        } catch (error: any) {
            console.log(error);
            Alert.alert("Kullanıcı kaydı yapılamadı: " + error.message)
        } finally {
            setLoading(false);
        }
    }

    const goBack = () => {
        route.replace("/")
    }
    return (
        <Layout style={{ flex: 1, padding: 10, justifyContent: 'center', backgroundColor: '#FFE7AF' }}>
            <KeyboardAvoidingView behavior='padding'>
                <Text category='h3' style={{ padding: 10 }}>CookAI</Text>

                <Text category='h4' style={{ padding: 10 }}>Hesabını oluştur.</Text>

                <Input
                    style={{ padding: 10 }}
                    value={email}
                    placeholder='E-posta adresi'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                />

                <Input
                    style={{ padding: 10 }}
                    secureTextEntry={true}
                    value={password}
                    placeholder='Şifre'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                />


                <Layout style={styles.buttonContainer}>
                    <Button style={{ marginVertical: 10, backgroundColor: "black" }} onPress={signUp}>Kayıt Ol</Button>
                    <Button style={{ marginVertical: 10, backgroundColor: "black" }} onPress={goBack}>Geri dön.</Button>
                </Layout>
            </KeyboardAvoidingView>

        </Layout>

    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        marginHorizontal: 40,
        backgroundColor: "#FFE7AF"

    },
    title: {
        fontSize: 36,
        paddingBottom: 16,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 24,
        paddingBottom: 16,
        fontWeight: 'bold'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff"
    },
})