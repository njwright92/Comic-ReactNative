import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from '../screens/homeScreen';
import Jokes from '../screens/jokeScreen';
import ComicBot from '../screens/comicBotScreen';
import SignIn from '../screens/signInScreen';
import SignUp from '../screens/signUpScreen';

const Stack = createStackNavigator();

const MainComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Jokes" component={Jokes} />
                    <Stack.Screen name="ComicBot" component={ComicBot} />
                </>
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignIn} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default MainComponent;
