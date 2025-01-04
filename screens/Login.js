import { View, Text, Image, Alert } from 'react-native'
import React, { useCallback, useReducer, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { FONTS, SIZES, images } from '../constants'
import { COLORS } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
import { reducer } from '../utils/reducers/formReducers'
import { useDispatch } from 'react-redux';
import { setUserData } from '../utils/actions/formActions'
import { validateInput } from '../utils/actions/formActions'
import { useTheme } from '../themes/ThemeProvider'
import { useSelector } from 'react-redux'

const initialState = {
    inputValues: {
        email: '',
        password: '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const Login = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setErrorMessage] = useState(null)
    const { colors } = useTheme()
    const dispatch = useDispatch();  // Initialize dispatch from Redux
    // check if is logined in
    const isLogined = useSelector(state => state.user.user);
    useEffect(() => {
        if (isLogined) {
            navigation.navigate('BottomTabNavigation');
        }
    }, [isLogined, navigation]);


    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const loginHandler = async () => {

        const { email, password } = formState.inputValues;

        try {
            setIsLoading(true);
            const response = await fetch('http://192.168.8.104:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.token) {
                    console.log('Login successful');
                    // Save data in redux stor e
                    // Dispatch action to store user data in Redux store
                    dispatch(setUserData({
                        token: data.token,
                        user: {
                            user_id: data.user.user_id,
                            fullname: data.user.fullname,
                            email: data.user.email,
                        }
                    }));
                    // Navigate to the next screen and pass the token
                    navigation.navigate('BottomTabNavigation');
                }
            } else {
                // const errorData = await response.json();
                setErrorMessage('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
        finally {
            setIsLoading(false);
        }
    };

    // handle errors
    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred', error)
        }
    }, [error])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <PageContainer>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 22,
                    }}
                >
                    <Image
                        source={images.logo}
                        style={{
                            height: 120,
                            width: 120,
                            marginBottom: 22,
                        }}
                    />

                    <Text
                        style={{
                            ...FONTS.h4,
                            color: colors.text,
                            marginVertical: 8,
                        }}
                    >
                        Login to your account
                    </Text>

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        id="email"
                        placeholder="Enter your email"
                        placeholderTextColor={colors.text}
                    />

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        id="password"
                        placeholder="Enter your password"
                        placeholderTextColor={colors.text}
                        secureTextEntry
                    />

                    <Button
                        title="Login"
                        filled
                        isLoading={isLoading}
                        onPress={loginHandler}
                        style={{
                            width: SIZES.width - 44,
                            marginBottom: SIZES.padding,
                            marginVertical: 8,
                        }}
                    />
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Login