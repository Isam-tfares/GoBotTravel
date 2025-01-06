import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants'; // Adjust the path based on your project structure
import { useTheme } from '../themes/ThemeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'react-native';


const Profile = ({ navigation }) => {
    const { colors } = useTheme();
    const user = useSelector(state => state.user.user.user); // Get user data from Redux store
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={styles.imgC}>
                    <Image style={styles.img} source={require("../assets/images/profile.png")} />
                </View>

                <View style={styles.infoBox}>
                    <Text style={[styles.label, { color: colors.text }]}>Full Name:</Text>
                    <Text style={[styles.value, { color: colors.text }]}>{user.fullname}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={[styles.label, { color: colors.text }]}>Email:</Text>
                    <Text style={[styles.value, { color: colors.text }]}>{user.email}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: COLORS.primary }]}
                    onPress={() => {
                        handleLogout()
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
        width: '90%',
        paddingHorizontal: 20,
        paddingVertical: SIZES.base,
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
        width: '90%',
        padding: SIZES.base,
        borderRadius: SIZES.radius,
        marginTop: SIZES.padding,
        justifyContent: 'center',
        height: 60,
        alignItems: 'center',
    },
    logoutButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
    },
    img: {
        backgroundColor: 'white',
        borderRadius: 50,
        width: 90,
        height: 90,
        padding: 10,
    },
    imgC: {
        width: 100,
        height: 100,
        borderRadius: 200,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Profile;
