import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { Asset, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: Array<{ type: string; text?: string; image_url?: string }>;
};

export default function AI() {
    const apiKey = "";
    const endpoint = "";

    const [message, setMessage] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const selectImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: true
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset: Asset = response.assets[0];
                if (asset.uri) {
                    setSelectedImage(asset.uri);
                } else {
                    console.error('No URI found in asset');
                }
            }
        });
    };

    const takePhoto = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: true
        };
        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled taking photo');
            } else if (response.errorMessage) {
                console.log('Camera Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset: Asset = response.assets[0];
                if (asset.uri) {
                    setSelectedImage(asset.uri);
                } else {
                    console.error('No URI found in asset');
                }
            }
        });
    };

    const handleSend = async () => {
        if (message.trim() === '' && !selectedImage) return;
        setLoading(true);

        const userMessage: Message = {
            role: "user",
            content: []
        };

        if (selectedImage) {
            // Convert the selected image to base64 inline
            const base64Image = await new Promise<string>((resolve, reject) => {
                fetch(selectedImage)
                    .then(response => response.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64data = reader.result?.toString().split(',')[1];
                            if (base64data) {
                                resolve(base64data);
                            } else {
                                reject(new Error('Failed to convert image to base64'));
                            }
                        };
                        reader.readAsDataURL(blob);
                    })
                    .catch(error => {
                        console.error('Error converting image to base64:', error);
                        reject(error);
                    });
            });

            userMessage.content.push({
                type: "image_url",
                image_url: `data:image/jpeg;base64,${base64Image}`
            });
        }

        if (message.trim() !== '') {
            userMessage.content.push({ type: "text", text: message });
        }

        const newChatHistory = [...chatHistory, userMessage];

        try {
            const payload = {
                messages: [
                    {
                        role: "system",
                        content: [
                            {
                                type: "text",
                                text: "You're an AI assistant that helps people find recipes from given images. List the recipes with their ingredients, and if the user requests to explain one of the recipes they select, guide them through the steps. Prefer Turkish unless specified."
                            }
                        ]
                    },
                    ...newChatHistory.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ],
                temperature: 0.7,
                top_p: 0.95,
                max_tokens: 800
            };

            // Logging payload for debugging
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const headers = {
                "Content-Type": "application/json",
                "api-key": apiKey,
            };

            const response = await axios.post(endpoint, payload, { headers });

            const botMessage: Message = { role: "assistant", content: [{ type: "text", text: response.data.choices[0].message.content.trim() }] };
            setChatHistory([...newChatHistory, botMessage]);
        } catch (error) {
            console.error('Error getting chat response:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
            }
            const errorMessage: Message = { role: "assistant", content: [{ type: "text", text: 'Error getting response from AI.' }] };
            setChatHistory([...newChatHistory, errorMessage]);
        } finally {
            setLoading(false);
            setMessage('');
            setSelectedImage(undefined);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust if necessary
        >
            <ScrollView style={styles.chatContainer}>
                {chatHistory.map((chat, index) => (
                    <View key={index} style={chat.role === 'user' ? styles.userMessage : styles.botMessage}>
                        {chat.content.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {item.type === 'text' && (
                                    <Markdown>{item.text}</Markdown>
                                )}
                                {item.type === 'image_url' && item.image_url && (
                                    <Image key={item.image_url} source={{ uri: item.image_url }} style={{ width: 200, height: 200 }} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imagePickerButton} onPress={selectImage}>
                    <Ionicons name="image" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
                    <Ionicons name="camera" size={24} color="white" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                />
                <TouchableOpacity style={styles.button} onPress={handleSend} disabled={loading}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator key="activity-indicator" size="large" color="#007AFF" />
                    {selectedImage && (
                        <Image key={selectedImage} source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />
                    )}
                    <Text style={styles.loadingText}>Yanıt bekleniyor...</Text>
                </View>
            )}
            {selectedImage && (
                <View style={styles.indicatorContainer}>
                    <Text style={styles.indicatorText}>Resim seçildi.</Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFE7AF',
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#111',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#111',
        borderRadius: 20,
        marginRight: 10,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10,
    },
    imagePickerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        marginRight: 10,
    },
    buttonText: {
        color: '#111',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 231, 175, 0.8)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#444',
    },
    indicatorContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 122, 255, 0.8)',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    indicatorText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
