import { View, Text, Platform } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from '../constants'
import { Home, History, Profile } from '../screens'
import { useTheme } from '../themes/ThemeProvider'

const Tab = createBottomTabNavigator()


const BottomTabNavigation = () => {
    const { colors } = useTheme()
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                elevation: 0,
                height: 60,
                backgroundColor: colors.background
            }
        }}>

            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={24}
                                color={
                                    focused
                                        ? COLORS.primary
                                        : COLORS.secondaryBlack
                                }
                            />
                        )
                    },
                }}
            />

            <Tab.Screen
                name="History"
                component={History}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <FontAwesome5 name="history"
                                size={24}
                                color={
                                    focused
                                        ? COLORS.primary
                                        : COLORS.secondaryBlack
                                }

                            />
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <MaterialCommunityIcons name="account" size={24} color={
                                focused
                                    ? COLORS.primary
                                    : COLORS.secondaryBlack
                            } />
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
