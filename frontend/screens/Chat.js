import React, { useState, useEffect, useCallback } from 'react';
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
    Image,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants';
import { useTheme } from '../themes/ThemeProvider';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const MessageBubble = React.memo(({ currentMessage }) => {
    if (!currentMessage || !currentMessage.user) return null;

    const isUser = currentMessage.user._id === 1;

    return (
        <View
            style={[
                styles.messageContainer,
                { justifyContent: isUser ? 'flex-end' : 'flex-start' },
            ]}
        >
            {!isUser ? (
                <Image
                    source={require('../assets/images/avatar.png')}
                    style={styles.avatar}
                />
            ) :
                null
            }
            <View
                style={[
                    styles.bubble,
                    { backgroundColor: isUser ? COLORS.primary : COLORS.secondaryWhite },
                ]}
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
            {isUser ? (
                <Image
                    source={require('../assets/images/profile.png')}
                    style={styles.profile}
                />
            ) :
                null
            }
        </View>
    );
});

const Chat = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [title, setTitle] = useState('New Conversation');
    const { colors } = useTheme();
    const route = useRoute();
    const { firstMessage_suggested, conversation } = route.params || {};
    const token = useSelector((state) => state.user.user.token);

    const dismissKeyboard = useCallback(() => Keyboard.dismiss(), []);

    useEffect(() => {
        if (firstMessage_suggested) setInputMessage(firstMessage_suggested);
    }, [firstMessage_suggested]);

    useEffect(() => {
        if (conversation) {
            setConversationId(conversation.id);
            setTitle(conversation.title);

            const formattedMessages = conversation.messages.map((msg) => ({
                _id: Math.random().toString(36).substring(7),
                text: msg.content,
                createdAt: new Date(msg.timestamp),
                user: { _id: msg.is_bot ? 2 : 1, name: msg.is_bot ? 'ChatBot' : 'You' },
            }));
            setMessages(formattedMessages.reverse());
        }
    }, [conversation]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        };

        setMessages((prevMessages) => [userMessage, ...prevMessages]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const endpoint = 'http://192.168.8.104:5000/api/conversation';
            const body = conversationId
                ? { question: inputMessage, conversation_id: conversationId }
                : { question: inputMessage };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok && data.bot_response) {
                const botMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: data.bot_response,
                    createdAt: new Date(),
                    user: { _id: 2, name: 'ChatBot' },
                };

                setMessages((prevMessages) => [botMessage, ...prevMessages]);
                if (!conversationId) {
                    setConversationId(data.conversation_id);
                    setTitle(data.title);
                }
            } else {
                console.error('API Error:', data.error || 'Failed to fetch response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.iconView, {
                        height: 40,
                        width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }]}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={40}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
                <Text style={[styles.title, { color: COLORS.white }]}>{title.replace(/"/g, '')}</Text>
            </View>

            <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: 0 }]}>

                <FlatList
                    data={isTyping ? [{ _id: 'typing-indicator', text: 'Typing...', user: { _id: 2 } }, ...messages] : messages}
                    // data={messages}
                    renderItem={({ item }) => <MessageBubble currentMessage={item} />}
                    keyExtractor={(item) => item._id}
                    inverted
                    contentContainerStyle={styles.messageList}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="Type your message"
                        placeholderTextColor={colors.textSecondary}
                        style={[
                            styles.textInput,
                            {
                                borderColor: colors.text,
                                color: colors.text,
                            },
                        ]}
                    />
                    <TouchableOpacity onPress={handleSendMessage}>
                        <FontAwesome name="send-o" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0, // Ensure no padding is applied
    },

    header: {
        alignItems: 'center',
        paddingTop: 50,
        padding: 20,
        backgroundColor: "#008cf0",
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        position: "relative",
    },
    iconView: {
        position: "absolute",
        left: -6,
        top: 18,
        zIndex: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    messageList: {
        paddingTop: 20,
        flexGrow: 1,
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 8,
    },
    profile: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    bubble: {
        maxWidth: '75%',
        borderRadius: 16,
        padding: 12,
        marginHorizontal: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginHorizontal: 12,
    },
});

export default Chat;
