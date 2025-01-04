import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import Feather from '@expo/vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';

const History = () => {
    const { colors } = useTheme();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('http://192.168.8.104:5000/get_history'); // Replace with your Flask server's IP
                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }
                const data = await response.json();
                setHistory(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const renderHistoryItem = ({ item }) => (
        <View style={[styles.historyItem, { flexDirection: 'row', alignItems: 'center' }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} style={styles.icon} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
            </View>
            <Feather name="more-vertical" size={24} color={colors.text} />
        </View>
    );

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
            <Text style={[styles.header, { color: colors.text }]}>History</Text>
            {history.length > 0 ? (
                <FlatList
                    data={history}
                    renderItem={renderHistoryItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No history available
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 35,
    },
    header: {
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
