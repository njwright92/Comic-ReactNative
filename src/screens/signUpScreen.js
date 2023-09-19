import React from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { auth } from '../firebase/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
    const navigation = useNavigation();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                Alert.alert('Successfully signed up with Google!');
                navigation.navigate('Home'); // Navigate to Home screen
            })
            .catch((error) => {
                Alert.alert(`Sign-up failed: ${error.message}`);
            });
    };

    const handleEmailPasswordSignUp = (email, password, confirmPassword) => {
        if (password !== confirmPassword) {
            Alert.alert('Passwords do not match.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                Alert.alert('Successfully signed up!');
                navigation.navigate('Home'); // Navigate to Home screen
            })
            .catch((error) => {
                Alert.alert(`Sign-up failed: ${error.message}`);
            });
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            
            <Text style={{ fontSize: 30, textAlign: 'center', marginVertical: 20 }}>Sign Up</Text>
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
                <Text>Confirm Password:</Text>
                <TextInput
                    placeholder="Confirm your password"
                    secureTextEntry
                    style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10 }}
                />
                <Pressable onPress={() => handleEmailPasswordSignUp(email, password, confirmPassword)} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginVertical: 10 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Sign Up</Text>
                </Pressable>
            </View>
            <Pressable onPress={handleGoogleSignIn} style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginVertical: 10 }}>
                <Text style={{ color: 'black', textAlign: 'center' }}>Sign Up with Google</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('SignIn')} style={{ marginVertical: 10 }}>
                <Text style={{ textAlign: 'center' }}>Already have an account? Sign In</Text>
            </Pressable>
            <Footer />
        </View>
    );
};

export default SignUp;
