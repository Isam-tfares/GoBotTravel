import { View, Text, Image, Alert } from 'react-native';
import React, { useCallback, useReducer, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import { FONTS, SIZES, images } from '../constants';
import { COLORS } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { useTheme } from '../themes/ThemeProvider';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const initialState = {
    inputValues: {
        username: '',
        email: '',
        password: '',
    },
    inputValidities: {
        username: false,
        email: false,
        password: false,
    },
    formIsValid: false,
};

const Register = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const isLogined = useSelector(state => state.user.user);

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

    const authHandler = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('http://192.168.8.104:5000/api/signup', { // Updated to use the signup API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formState.inputValues.username, // Updated to match the signup API
                    email: formState.inputValues.email,
                    password: formState.inputValues.password,
                }),
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (response.ok) {
                // Handle successful registration (optional: navigate or show success message)
                Alert.alert('Success', 'User registered successfully!');
                navigation.navigate('Login'); // Redirect to login screen after registration
            } else {
                setError(data.error || 'Something went wrong!');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('An error occurred!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred', error);
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
                        Create an account
                    </Text>

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['username']}
                        id="username"
                        placeholder="Enter your username"
                        placeholderTextColor={colors.text}
                    />

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
                        title="Register"
                        onPress={authHandler}
                        isLoading={isLoading}
                        filled
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

export default Register;
