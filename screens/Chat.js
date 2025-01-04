import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, images } from '../constants';
import { useTheme } from '../themes/ThemeProvider';
import { Image } from 'react-native';

const Chat = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const { colors } = useTheme();

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const renderMessage = (props) => {
        const { currentMessage } = props;
        const isUser = currentMessage.user._id === 1;

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
            >
                {!isUser && (
                    <Image
                        source={images.avatar}
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            marginLeft: 8,
                        }}
                    />
                )}
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: COLORS.primary,
                            marginRight: 12,
                            marginVertical: 12,
                        },
                        left: {
                            backgroundColor: COLORS.secondaryWhite,
                            marginLeft: 12,
                        },
                    }}
                    textStyle={{
                        right: {
                            color: COLORS.white,
                        },
                        left: {
                            color: COLORS.black,
                        },
                    }}
                />
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
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <StatusBar style="auto" />
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View
                        style={{
                            height: 60,
                            backgroundColor: colors.background,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 22,
                            width: SIZES.width,
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="keyboard-arrow-left" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Use FlatList instead of ScrollView for better performance */}
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => renderMessage({ currentMessage: item })}
                        keyExtractor={(item) => item._id.toString()}
                        inverted={true}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 80,
                        }}
                    />

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
