import React from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { auth } from '../firebase/firebase';
import { signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider  } from 'firebase/auth';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
    const navigation = useNavigation();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                Alert.alert('Successfully signed in with Google!');
                navigation.navigate('Home'); // Navigate to Home screen
            })
            .catch((error) => {
                Alert.alert(`Sign-in failed: ${error.message}`);
            });
    };

    const handleEmailPasswordSignIn = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                Alert.alert('Successfully signed in!');
                navigation.navigate('Home'); // Navigate to Home screen
            })
            .catch((error) => {
                Alert.alert(`Sign-in failed: ${error.message}`);
            });
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 30, textAlign: 'center', marginVertical: 20 }}>Sign In</Text>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                <Text>Email:</Text>
                <TextInput
                    placeholder="Enter your email"
                    style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10 }}
                />
                <Text>Password:</Text>
                <TextInput
                    placeholder="Enter your password"
                    secureTextEntry
                    style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10 }}
                />
                <Pressable onPress={() => handleEmailPasswordSignIn(email, password)} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginVertical: 10 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Sign In</Text>
                </Pressable>
            </View>
            <Pressable onPress={handleGoogleSignIn} style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginVertical: 10 }}>
                <Text style={{ color: 'black', textAlign: 'center' }}>Sign In with Google</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('SignUp')} style={{ marginVertical: 10 }}>
                <Text style={{ textAlign: 'center' }}>Need to Sign Up?</Text>
            </Pressable>
            <Footer />
        </View>
    );
};

export default SignIn;
