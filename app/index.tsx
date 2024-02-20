import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { router, useRouter } from 'expo-router'
import { User, onAuthStateChanged, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'
import { FIREBASE_AUTH } from '../FirebaseConfig'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { Layout, Text, Input, Button, Card } from '@ui-kitten/components';


const Page = () => {
    const route = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH

    useEffect(() => {
        GoogleSignin.configure({
            "webClientId": "1044771271544-4ca2qoibgu9tu3hjqlppj73bush8k41h.apps.googleusercontent.com",
            offlineAccess: true
        })

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                route.replace('/home');
            }
        });

        return () => unsubscribe();
    }, []);


    const signIn = async () => {
        setLoading(true);
        try {
            const response = signInWithEmailAndPassword(auth, email, password);
            console.log((await response).user);
            Alert.alert("Hoşgeldin", "Giriş başarılı!")
            route.replace('/home');
        } catch (error: any) {
            console.log(error);
            Alert.alert("Hata", "Giriş yapılamadı: " + error.message)
        } finally {
            setLoading(false);
        }
    }

    const signInGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const googleUser: any = await GoogleSignin.signIn();
            const googleCredential = GoogleAuthProvider.credential(googleUser.idToken);
            const firebaseUser = await signInWithCredential(auth, googleCredential);
            console.log(firebaseUser);
            route.replace('/home');
        } catch (error: any) {
            console.error(error);
        }
    }

    return (
        <Layout style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <KeyboardAvoidingView behavior='padding'>
                <Text category='h1'>CookAI</Text>

                <Input
                    value={email}
                    placeholder='E-posta adresi'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                    style={{ marginTop: 16 }}
                />

                <Input
                    value={password}
                    placeholder='Şifre'
                    autoCapitalize='none'
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    style={{ marginTop: 16 }}
                />

                <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={signInGoogle} style={{ marginTop: 16 }} />

                <Button onPress={signIn} style={{ marginTop: 16 }}>
                    Giriş yap
                </Button>

                <Button onPress={() => route.replace("/register")} style={{ marginTop: 16 }}>
                    Hesabın yok mu? Kayıt ol
                </Button>
            </KeyboardAvoidingView>
        </Layout>
    )
}

export default Page