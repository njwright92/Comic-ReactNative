import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Footer = () => {
    return (
        <View style={styles.footer}>
            <Text style={styles.text}>
                &copy; {new Date().getFullYear()} Comedify. All rights reserved.
            </Text>
            <View style={styles.linkContainer}>
                <Pressable onPress={() => {/* Navigate to Terms & Conditions */ }}>
                    <Text style={styles.link}>Terms & Conditions</Text>
                </Pressable>
                <Text style={styles.separator}>|</Text>
                <Pressable onPress={() => {/* Navigate to Privacy Policy */ }}>
                    <Text style={styles.link}>Privacy Policy</Text>
                </Pressable>
                <Text style={styles.separator}>|</Text>
                <Pressable onPress={() => {/* Open email client */ }}>
                    <Text style={styles.link}>Email Us</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        backgroundColor: 'black',
        paddingVertical: 10,
        marginTop: 20,
    },
    text: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    link: {
        color: 'white',
        marginHorizontal: 5,
        textDecorationLine: 'underline',
    },
    separator: {
        color: 'white',
        marginHorizontal: 5,
    },
});

export default Footer;
