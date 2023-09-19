import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';


const Navbar = ({ navigation }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            alert('Please Sign In or Sign Up.');
        } else {
            navigation.navigate(link);
        }
    };

    return (
        <View style={styles.navbar}>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.menuButton}>
                    <Text style={styles.menuText}>Menu</Text>
                </Pressable>
                {isOpen && (
                    <View style={styles.linkContainer}>
                        <Pressable onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.link}>Home</Text>
                        </Pressable>
                        <Pressable onPress={() => handleRedirect('ComicBot')}>
                            <Text style={styles.link}>ComicBot</Text>
                        </Pressable>
                        <Pressable onPress={() => handleRedirect('Jokes')}>
                            <Text style={styles.link}>JokePad</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: 'black',
        borderRadius: 15,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    menuButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    menuText: {
        color: 'white',
        fontSize: 16,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    link: {
        color: 'white',
        marginHorizontal: 10,
        fontSize: 16,
    },
});

export default Navbar;
