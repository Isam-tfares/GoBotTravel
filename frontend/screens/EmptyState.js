import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../themes/ThemeProvider';

const EmptyState = ({ onStartNewConversation }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
            <Image
                source={require('../assets/images/no-message.png')} // Replace with an appropriate image in your assets
                style={styles.emptyImage}
                resizeMode="contain"
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Conversations Yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Start a new conversation to see it listed here.
            </Text>
            <TouchableOpacity
                style={[styles.startButton, { backgroundColor: colors.primary }]}
                onPress={onStartNewConversation}>
                <Text style={[styles.startButtonText, { color: colors.white }]}>
                    Start New Conversation
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    startButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 3,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default EmptyState;
