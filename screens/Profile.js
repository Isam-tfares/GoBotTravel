import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants'; // Adjust the path based on your project structure
import { useTheme } from '../themes/ThemeProvider';

const Profile = ({ navigation }) => {
    const { colors } = useTheme();

    // Placeholder user data
    const user = {
        fullName: 'John Doe', // Replace this with dynamic data
        email: 'johndoe@example.com', // Replace this with dynamic data
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

                <View style={styles.infoBox}>
                    <Text style={[styles.label, { color: colors.text }]}>Full Name:</Text>
                    <Text style={[styles.value, { color: colors.text }]}>{user.fullName}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={[styles.label, { color: colors.text }]}>Email:</Text>
                    <Text style={[styles.value, { color: colors.text }]}>{user.email}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: COLORS.primary }]}
                    onPress={() => {
                        // Handle logout action
                        navigation.replace('Login'); // Navigate to login on logout
                    }}
                >
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.padding,
    },
    title: {
        ...FONTS.h2,
        marginBottom: SIZES.padding,
    },
    infoBox: {
        width: '100%',
        padding: SIZES.padding,
        marginVertical: SIZES.base,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.lightGray,
    },
    label: {
        ...FONTS.body3,
        fontWeight: 'bold',
    },
    value: {
        ...FONTS.body3,
        marginTop: SIZES.base / 2,
    },
    logoutButton: {
        marginTop: SIZES.padding * 2,
        padding: SIZES.base * 1.5,
        borderRadius: SIZES.radius,
        alignItems: 'center',
    },
    logoutButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
    },
});

export default Profile;
