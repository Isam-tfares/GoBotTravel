import { View, Text, Image, Alert } from 'react-native';
import React, { useCallback, useReducer, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import { FONTS, SIZES, images } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { reducer } from '../utils/reducers/formReducers';
import { useDispatch } from 'react-redux';
import { setUserData } from '../utils/actions/formActions';
import { validateInput } from '../utils/actions/formActions';
import { useTheme } from '../themes/ThemeProvider';
import { useSelector } from 'react-redux';

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
};

const Login = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setErrorMessage] = useState(null);
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const isLogined = useSelector((state) => state.user.user);

    useEffect(() => {
        if (isLogined) {
            navigation.navigate('BottomTabNavigation');
        }
    }, [isLogined, navigation]);

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue);
            dispatchFormState({ inputId, validationResult: result, inputValue });
        },
        [dispatchFormState]
    );

    const loginHandler = async () => {
        const { email, password } = formState.inputValues;

        try {
            setIsLoading(true);
            const response = await fetch('http://192.168.8.104:5000/api/login', {
                method: 'POST', // Updated URL for the login API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);

                if (data.access_token) {
                    dispatch(
                        setUserData({
                            token: data.access_token,
                            user: {
                                email: data.email,
                                username: data.username,
                            },
                        })
                    );

                    navigation.navigate('BottomTabNavigation'); // Navigate to main app
                }
            } else {
                setErrorMessage(data.error || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            Alert.alert('Login Failed', error);
        }
    }, [error]);

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
    );
};

export default Login;
