import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EmptyState from './EmptyState';


const History = () => {
    const { colors } = useTheme();
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.user.user.token);
    const navigation = useNavigation();

    const fetchConversations = async () => {
        try {
            setIsLoading(true);

            const response = await fetch('http://192.168.8.104:5000/api/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch conversations');
            }

            const data = await response.json();
            setConversations(data.conversations);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchConversations();
        }, [token])
    );

    const onRefresh = async () => {
        try {
            setIsLoading(true);
            await fetchConversations();
        } catch (err) {
            console.error('Error refreshing:', err);
        } finally {
            setIsLoading(false);
        }
    };


    const handleDelete = async (id) => {
        try {
            Alert.alert(
                'Delete Conversation',
                'Are you sure you want to delete this conversation?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        onPress: async () => {
                            try {
                                const response = await fetch(`http://192.168.8.104:5000/api/conversation/${id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                });

                                if (!response.ok) {
                                    throw new Error('Failed to delete conversation');
                                }

                                setConversations((prevConversations) =>
                                    prevConversations.filter((conversation) => conversation.id !== id)
                                );

                                Alert.alert('Success', 'Conversation deleted successfully');
                            } catch (err) {
                                Alert.alert('Error', err.message);
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (err) {
            Alert.alert('Error', 'Something went wrong while deleting the conversation');
        }
    };

    const renderConversationItem = ({ item }) => {
        return (
            <>
                <TouchableOpacity
                    style={[styles.historyItem, { flexDirection: 'row', alignItems: 'center' }]}
                    onPress={() => navigation.navigate('Chat', { conversation: item })}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} style={styles.icon} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.title, { color: colors.text }]}>{item.title.replace(/"/g, '')}</Text>
                        <Text style={[styles.date, { color: colors.textSecondary }]}>{new Date(item.timestamp).toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <MaterialIcons name="delete-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </>
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={styles.header}>
                <Text style={[styles.headerText, { color: colors.text }]}>Conversations</Text>
            </View>
            {conversations.length > 0 ? (
                <FlatList
                    data={conversations}
                    renderItem={renderConversationItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                        />
                    }
                />

            ) : (
                <EmptyState
                    onStartNewConversation={() => navigation.navigate('Chat')}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 35,
        paddingBottom: 35,
    },
    header: {
        paddingLeft: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        paddingBottom: 16,
    },
    historyItem: {
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 32,
    },
});

export default History;
