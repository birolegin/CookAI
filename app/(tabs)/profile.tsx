import { View, Text, StyleSheet, Modal, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useRouter } from 'expo-router'
import Button from '../../components/customButton'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { getDoc, doc, updateDoc, onSnapshot, getFirestore, setDoc } from 'firebase/firestore';

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
    const [height, setHeight] = useState(userDetails?.height || '');
    const [weight, setWeight] = useState(userDetails?.weight || '');
    const [bmi, setBmi] = useState(userDetails?.bmi || '');
    const [dailyCalories, setDailyCalories] = useState(userDetails?.dailyCalories || '');

    useEffect(() => {
        if (user) {
            const db = getFirestore();
            const userRef = doc(db, 'users', user.uid);

            const unsubscribe = onSnapshot(userRef, (doc) => {
                setUserDetails(doc.data() as UserDetails | null);
            });

            return unsubscribe;
        }
    }, [user]);

    useEffect(() => {
        setHeight(userDetails?.height || '');
        setWeight(userDetails?.weight || '');
        setBmi(userDetails?.bmi || '');
        setDailyCalories(userDetails?.dailyCalories || '');
    }, [userDetails]);

    const classifyBmi = (bmi: string) => {
        const value = parseFloat(bmi);

        if (value < 18.5) {
            return 'Zayıf';
        } else if (value < 25) {
            return 'Normal';
        } else if (value < 30) {
            return 'Fazla Kilolu';
        } else {
            return 'Obez';
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
        const userRef = doc(db, 'users', user!.uid);

        const userDoc = await getDoc(userRef);

        const calculatedBmi = (parseInt(weight) / Math.pow(parseInt(height) / 100, 2)).toFixed(1);

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

        alert('User details updated!');
        closeDetailsModal();
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            GoogleSignin.revokeAccess();
            GoogleSignin.signOut()
            route.replace('/');
        } catch (error) {
            console.error(error);
        }
    };

    const sendPasswordReset = async () => {
        if (user?.email) {
            try {
                await sendPasswordResetEmail(auth, user.email);
                alert('Şifre sıfırlama e-postası gönderildi!');
            } catch (error) {
                console.error(error);
            }
        }
    }

    const updateDisplayName = async () => {
        if (!name) {
            alert('Kullanıcı adı girin!');
            return;
        }

        if (user) {
            try {
                await updateProfile(user, {
                    displayName: name,
                });
                setDisplayName(name);
                setName('');
                alert('Kullanıcı adı güncellendi!');
                closeModal();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: user?.photoURL || '' }} style={styles.profileImage} />
                <Text style={styles.welcomeText}>{displayName}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.sectionHeader}>Kullanıcı Bilgileri</Text>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>BOY</Text>
                    <Text style={styles.cardText}>{userDetails?.height} cm</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>KİLO</Text>
                    <Text style={styles.cardText}>{userDetails?.weight} kg</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>VKİ</Text>
                    <Text style={styles.cardText}>{userDetails?.bmi} ({classifyBmi(userDetails?.bmi || '0')})</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Günlük alması gereken kalori miktarı</Text>
                    <Text style={styles.cardText}>{userDetails?.dailyCalories} kalori</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Bilgileri güncelle" onPress={openDetailsModal} />
                </View>
            </View>

            <Modal
                animationType="slide"
                visible={isDetailsModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Bilgileri güncelle</Text>
                        <TextInput
                            style={styles.input}
                            value={height}
                            onChangeText={setHeight}
                            placeholder="Boy (cm)"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="Kilo (kg)"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={dailyCalories}
                            onChangeText={setDailyCalories}
                            placeholder="Günlük kalori ihtiyacı"
                            keyboardType="numeric"
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Güncelle" onPress={updateUserDetails} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Kapat" onPress={closeDetailsModal} />
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.buttonContainer}>
                <Button title="Kaydedilen tarifler" onPress={() => router.push("/savedRecipes")} />
                <View style={{ width: 20, height: 20 }} />
                <Button title="Kullanıcı adı değiştir" onPress={openModal} />
                <View style={{ width: 20, height: 20 }} />
                <Button title="Şifre sıfırlama e-postası gönder" onPress={sendPasswordReset} />
                <View style={{ width: 20, height: 20 }} />
                <Button onPress={logOut} title='Çıkış Yap' />
            </View>
            <Modal
                animationType="slide"
                visible={isModalVisible}
            >
                <View style={styles.modalOverlay} >
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
                                <Button title="Kullanıcı adı ayarla" onPress={updateDisplayName} />
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
}

export default Page

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    infoContainer: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        paddingBottom: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
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
        fontWeight: 'bold',
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
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
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
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
    },
    welcomeContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    profileContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        shadowColor: '#000',
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