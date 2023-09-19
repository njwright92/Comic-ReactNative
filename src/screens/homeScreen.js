import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import this
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigation = useNavigation(); // Initialize this

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleRedirect = (link) => {
        if (!isAuthenticated) {
            Alert.alert('Please Sign In or Sign Up.');
        } else {
            navigation.navigate(link); // Navigate to the link
        }
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <Text style={styles.signInText}>Sign In or Sign Up for full access to all this app's features!</Text>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => navigation.navigate('SignIn')} style={styles.signInButton}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('SignUp')} style={styles.signUpButton}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
            </View>
            <Text style={styles.title}>Comedify!</Text>
            <Image
                source={require('../assets/Img/comicLogo.jpeg')}
                style={styles.logo}
                resizeMode="contain"
            />
            {/* ComicBot Section */}
            <View style={styles.card}>
                <Pressable onPress={() => handleRedirect('ComicBot')} style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>ComicBot</Text>
                </Pressable>
                <Text style={styles.cardText}>
                    Your personal comedy bit creation assistant. Sign up to get access!
                </Text>
                <Image
                    source={require('../assets/Img/comicBot.png')} // Adjust the path
                    style={styles.cardImage}
                    resizeMode="contain"
                />
            </View>
            {/* JokePad Section */}
            <View style={styles.card}>
                <Pressable onPress={() => handleRedirect('Jokes')} style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>JokePad</Text>
                </Pressable>
                <Text style={styles.cardText}>
                    Write and store your comedy bits securely. An organized comedian is a successful comedian!
                </Text>
                <Image
                    source={require('../assets/Img/jokes.png')} // Adjust the path
                    style={styles.cardImage}
                    resizeMode="contain"
                />
            </View>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    signInText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    signInButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
    },
    signUpButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    title: {
        fontSize: 36,
        color: 'white',
        marginBottom: 20,
    },
    logo: {
        width: 300,
        height: 300,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        alignItems: 'center',
    },
    cardButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    cardButtonText: {
        color: 'white',
        fontSize: 18,
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    cardImage: {
        width: 200,
        height: 200,
    },
});

export default Home;