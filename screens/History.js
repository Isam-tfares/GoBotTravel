import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';
import Feather from '@expo/vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons'


const History = () => {
    const { colors } = useTheme();

    // Placeholder data for history
    const [history, setHistory] = useState([
        { id: '1', title: 'Booked Flight to Paris', date: '2024-12-20' },
        { id: '2', title: 'Hotel Reservation in Tokyo', date: '2024-11-15' },
        { id: '3', title: 'Safari Tour in Kenya', date: '2024-10-10' },
        { id: '4', title: 'Cruise Booking in the Caribbean', date: '2024-09-25' },
        { id: '5', title: 'City Tour in New York', date: '2024-08-05' },
        { id: '6', title: 'Train Tickets to Venice', date: '2024-07-12' },
        { id: '7', title: 'Dinner Reservation in Dubai', date: '2024-06-30' },
    ]);

    useEffect(() => {
        // Fetch history data from API or database
        // Example:
        // fetch('https://api.example.com/history')
        //     .then(response => response.json())
        //     .then(data => setHistory(data))
        //     .catch(error => console.error(error));
    }, []);

    const renderHistoryItem = ({ item }) => (
        <View style={[styles.historyItem, { flexDirection: 'row', alignItems: 'center' }]}>
            {/* Left Icon */}
            <Ionicons name="chatbubble-ellipses-outline" size={24} style={styles.icon} />

            {/* Text Content */}
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
            </View>

            {/* Right Icon */}
            <Feather name="more-vertical" size={24} color={colors.text} />
        </View>
    );

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
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Vertically center items
    },
    icon: {
        marginRight: 12, // Space between the icon and text
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