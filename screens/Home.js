import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeProvider';

const Home = ({ navigation }) => {
    const { dark, colors, setScheme } = useTheme();

    const ToggleTheme = () => {
        dark ? setScheme('light') : setScheme('dark');
    };

    // Array of travel ideas
    const travelIdeas = [
        "What are the best travel destinations in Europe?",
        "How to plan a budget-friendly vacation?",
        "What are the must-have items for a long road trip?"
    ];

    return (
        <SafeAreaView
            style={[
                styles.areaStyle,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <View style={styles.center}>
                <TouchableOpacity onPress={ToggleTheme}>
                    <Ionicons
                        name={dark ? 'sunny-outline' : "partly-sunny-sharp"}
                        size={32}
                        color={dark ? COLORS.white : COLORS.black}
                    />
                </TouchableOpacity>

                <Text
                    style={[
                        styles.subTitle,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                    Travel Ideas
                </Text>

                {/* Render travel ideas dynamically */}
                {travelIdeas.map((idea, index) => (
                    <View
                        key={index}
                        style={[
                            styles.box,
                            {
                                backgroundColor: colors.background,
                                borderColor: colors.text,
                                borderWidth: 1,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Chat', { firstMessage_suggested: idea })}
                        >
                            <Text style={[styles.boxText, { color: colors.text }]}>
                                {idea}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => navigation.navigate('Chat', { firstMessage_suggested: '' })}
                >
                    <AntDesign name="plus" size={24} color={COLORS.white} />
                    <Text style={styles.btnText}>New Chat</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    areaStyle: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subTitle: {
        ...FONTS.h4,
        marginVertical: 22,
    },
    box: {
        width: 300,
        paddingVertical: 18,
        marginVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxText: {
        ...FONTS.body4,
        textAlign: 'center',
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        width: 300,
        paddingVertical: SIZES.padding * 2,
    },
    btnText: {
        ...FONTS.body3,
        color: COLORS.white,
        marginLeft: 8,
    },
});

export default Home;
