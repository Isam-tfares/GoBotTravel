import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, images } from '../constants';
import { useTheme } from '../themes/ThemeProvider';
import { Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Chat = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const { colors } = useTheme();

    const route = useRoute();
    const { firstMessage } = route.params;

    useEffect(() => {
        if (firstMessage) {
            setInputMessage(firstMessage);
            generateText();
        }
    }, []);
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const renderMessage = ({ currentMessage }) => {
        if (!currentMessage || !currentMessage.user) {
            return null; // Skip rendering if user data is missing
        }

        const isUser = currentMessage.user._id === 1; // Check if the message is from the user

        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: isUser ? 'flex-end' : 'flex-start', // Align user messages to the right
                    marginVertical: 8,
                }}
            >
                {!isUser && (
                    <Image
                        source={images.avatar} // Replace with your bot's avatar image
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            marginLeft: 8,
                        }}
                    />
                )}
                <View
                    style={{
                        maxWidth: '75%',
                        backgroundColor: isUser ? COLORS.primary : COLORS.secondaryWhite, // User: blue, Bot: white
                        borderRadius: 16,
                        padding: 12,
                        marginHorizontal: 8,
                    }}
                >
                    <Text
                        style={{
                            color: isUser ? COLORS.white : COLORS.black, // Text color: white for user, black for bot
                            fontSize: 16,
                        }}
                    >
                        {currentMessage.text}
                    </Text>
                </View>
            </View>
        );
    };



    const generateText = async () => {
        if (!inputMessage.trim()) return;
        const msg = inputMessage;
        setInputMessage('');

        setIsTyping(true);

        const userMessage = {
            _id: Math.random().toString(36).substring(7),
            text: msg,
            createdAt: new Date(),
            user: { _id: 1 },
        };

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [userMessage])
        );

        const chatHistory = messages.map((msg) => ({
            role: msg.user._id === 1 ? 'user' : 'bot',
            content: msg.text,
        }));

        try {
            const response = await fetch('http://192.168.8.104:5000/get_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_query: msg,
                    chat_history: chatHistory,
                }),
            });

            const data = await response.json();

            if (data.response) {
                const botMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: data.response.trim(),
                    createdAt: new Date(),
                    user: { _id: 2, name: 'ChatBot' },
                };

                setMessages((previousMessages) =>
                    GiftedChat.append(previousMessages, [botMessage])
                );
            } else if (data.error) {
                console.error('API Error:', data.error);
            }
        } catch (error) {
            console.error('Error fetching response:', error);
        } finally {
            setIsTyping(false);
        }

        setInputMessage('');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Header */}
                    <View
                        style={{
                            height: 60,
                            backgroundColor: colors.background,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 22,
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="keyboard-arrow-left" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Messages */}
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => renderMessage({ currentMessage: item })}
                        keyExtractor={(item) => item._id.toString()}
                        inverted={true} // Ensures the newest messages appear at the bottom
                        contentContainerStyle={{
                            paddingTop: 20, // Adds space at the top for better appearance
                            flexGrow: 1, // Ensures the list grows to accommodate messages
                        }}
                        style={{
                            flex: 1, // Ensures the FlatList takes up the available screen space
                        }}
                        showsVerticalScrollIndicator={false} // Optional: Hides the scroll indicator
                    />


                    {/* Input Field */}
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: colors.background,
                            padding: 8,
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.background,
                                borderWidth: 0.5,
                                borderColor: colors.text,
                                borderRadius: 12,
                                marginHorizontal: 12,
                                paddingHorizontal: 10,
                            }}
                        >
                            <TextInput
                                value={inputMessage}
                                onChangeText={setInputMessage}
                                placeholder="Enter your question"
                                placeholderTextColor={colors.text}
                                style={{
                                    flex: 1,
                                    color: colors.text,
                                }}
                            />
                            <TouchableOpacity onPress={generateText}>
                                <FontAwesome name="send-o" color={COLORS.primary} size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>

    );
};

export default Chat;
