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
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useTheme } from '../themes/ThemeProvider';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Chat = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [title, setTitle] = useState('New Conversation');
    const { colors } = useTheme();
    const route = useRoute();
    const { firstMessage_suggested } = route.params || {};
    const { conversation } = route.params || {};
    const token = useSelector((state) => state.user.user.token);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    useEffect(() => {
        if (firstMessage_suggested) {
            setInputMessage(firstMessage_suggested);
        }
    }, [firstMessage_suggested]);


    const renderMessage = ({ currentMessage }) => {
        if (!currentMessage || !currentMessage.user) return null;

        const isUser = currentMessage.user._id === 1;

        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    marginVertical: 8,
                }}
            >
                {!isUser && (
                    <Image
                        source={require('../assets/images/avatar.jpg')}
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
                        backgroundColor: isUser ? COLORS.primary : COLORS.secondaryWhite,
                        borderRadius: 16,
                        padding: 12,
                        marginHorizontal: 8,
                    }}
                >
                    <Text
                        style={{
                            color: isUser ? COLORS.white : COLORS.black,
                            fontSize: 16,
                        }}
                    >
                        {currentMessage.text.replace(/\*/g, '')}
                    </Text>
                </View>
            </View>
        );
    };

    const addMessage = () => {
        if (conversationId) {
            // send message to backend
            sendMessage();
            console.log('Send message to backend with converstaion Id existing');
        }
        else {
            // create new conversation and get response from backend
            startConversation();
            console.log('Create new conversation and get response from backend');
        }

    }

    const startConversation = async () => {
        // check if firstMessage_suggested is not empty
        if (!inputMessage) return;

        const userMessage = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1, name: 'You' },
        };

        setMessages((prevMessages) => [userMessage, ...prevMessages]); // add user message
        let qst = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await fetch('http://192.168.8.104:5000/api/conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    question: qst,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const botMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: data.bot_response,
                    createdAt: new Date(),
                    user: { _id: 2, name: 'ChatBot' },
                };

                setConversationId(data.conversation_id);
                setTitle(data.title);
                setMessages((prevMessages) => [botMessage, ...prevMessages]); // add bot message
            } else {
                console.error('API Error:', data.error || 'Failed to start conversation');
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        } finally {
            setIsTyping(false);
        }
    };


    const sendMessage = async () => {
        if (!inputMessage.trim() || !conversationId) return;

        const userMessage = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        };

        setMessages((prevMessages) => [userMessage, ...prevMessages]); // add user message
        setIsTyping(true);
        let msg = inputMessage;
        setInputMessage('');

        try {
            const response = await fetch('http://192.168.8.104:5000/api/conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    question: msg,
                    conversation_id: conversationId,
                }),
            });

            const data = await response.json();
            console.log('Data:', data);

            if (response.ok && data.bot_response) {
                const botResponse = data.bot_response;
                // Define the bot's response
                const botMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: botResponse,  // This is the bot's response
                    createdAt: new Date(),  // Replace with actual timestamp if available
                    user: { _id: 2, name: 'ChatBot' },
                };
                // Add the user and bot messages to the messages array
                setMessages((prevMessages) => [botMessage, ...prevMessages]);
            } else {
                console.error('API Error:', data.error || 'Failed to fetch response');
            }

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (conversation) {
            // Set the conversation ID and title
            setConversationId(conversation.id);
            setTitle(conversation.title);

            // Map the messages into the required format for rendering
            const formattedMessages = conversation.messages.map((msg) => ({
                _id: Math.random().toString(36).substring(7),
                text: msg.content,
                createdAt: new Date(msg.timestamp),
                user: {
                    _id: msg.is_bot ? 2 : 1,
                    name: msg.is_bot ? 'ChatBot' : 'You'
                },
            }));

            // Set the messages in state, reversing to show the latest message first
            setMessages(formattedMessages.reverse());
        }
    }, [conversation]);  // Only trigger when the `conversation` prop changes


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={{ alignItems: 'center', padding: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>{title.replace(/"/g, '')}</Text>
                    </View>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => renderMessage({ currentMessage: item })}
                        keyExtractor={(item) => item._id.toString()}
                        inverted
                        contentContainerStyle={{ paddingTop: 20, flexGrow: 1 }}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: 8,
                            alignItems: 'center',
                            backgroundColor: colors.background,
                        }}
                    >
                        <TextInput
                            value={inputMessage.replace(/"/g, '')}
                            onChangeText={setInputMessage}
                            placeholder='Type your message'
                            placeholderTextColor={colors.textSecondary}
                            style={{
                                flex: 1,
                                borderColor: colors.text,
                                borderWidth: 0.5,
                                borderRadius: 12,
                                paddingHorizontal: 10,
                                marginHorizontal: 12,
                                color: colors.text,
                            }}
                        />
                        <TouchableOpacity onPress={() => { addMessage(); }}>
                            <FontAwesome name='send-o' color={COLORS.primary} size={24} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default Chat;
