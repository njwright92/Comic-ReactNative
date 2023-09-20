import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, query, where, getDocs, updateDoc, collection, addDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const Jokes = () => {
    const navigation = useNavigation();
    const [jokes, setJokes] = useState([]);
    const [newJoke, setNewJoke] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [userUID, setUserUID] = useState(auth.currentUser ? auth.currentUser.uid : null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUID(user.uid);
            } else {
                setUserUID(null);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchJokes = async () => {
            if (userUID) {
                const jokeQuery = query(collection(db, "jokes"), where("uid", "==", userUID));
                const querySnapshot = await getDocs(jokeQuery);
                const fetchedJokes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    joke: doc.data().joke
                }));
                setJokes(fetchedJokes);
            }
        };
        fetchJokes();
    }, [userUID]);

    const handleInputChange = (text) => {
        setNewJoke(text);
    };

    const handleSubmit = async () => {
        if (userUID) {
            try {
                const jokeCollection = collection(db, "jokes");
                const docRef = await addDoc(jokeCollection, {
                    joke: newJoke,
                    uid: userUID
                });
                const newDocId = docRef.id;
                setJokes([{ id: newDocId, joke: newJoke }, ...jokes]);
                setNewJoke('');
            } catch (error) {
                console.error("Error adding joke: ", error);
            }
        }
    };

    const handleEditSubmit = async (index) => {
        const editedJoke = jokes[index];
        try {
            const jokeDoc = doc(db, "jokes", editedJoke.id);
            await updateDoc(jokeDoc, {
                joke: editedJoke.joke,
                uid: userUID
            });
            setEditingIndex(null);
        } catch (error) {
            console.error("Error updating joke: ", error);
        }
    };

    const handleDelete = async (index) => {
        try {
            const jokeDoc = doc(db, "jokes", jokes[index].id);
            await deleteDoc(jokeDoc);
            const newJokes = [...jokes];
            newJokes.splice(index, 1);
            setJokes(newJokes);
        } catch (error) {
            console.error("Error deleting joke: ", error);
        }
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                Alert.alert('Successfully signed out.');
                navigation.navigate('Home'); // Navigate to Home screen
            })
            .catch((error) => {
                Alert.alert(`An error occurred: ${error.message}`);
            });
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </Pressable>
            <Navbar navigation={navigation} />
            <Text style={styles.title}>JokePad!</Text>

            <TextInput
                value={newJoke}
                onChangeText={handleInputChange}
                placeholder="Write your bit.."
                multiline
                numberOfLines={4}
                style={styles.inputArea}
            />
            <Pressable onPress={handleSubmit} style={styles.addButton}>
                <Text style={styles.buttonText}>Add Joke</Text>
            </Pressable>
            <FlatList
                data={jokes}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.jokeItem}>
                        {editingIndex === index ? (
                            <TextInput
                                value={item.joke}
                                onChangeText={(text) => {
                                    const newJokes = [...jokes];
                                    newJokes[index].joke = text;
                                    setJokes(newJokes);
                                }}
                                multiline
                                numberOfLines={4}
                                style={{ flex: 1, borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        ) : (
                            <Text style={{ flex: 1 }}>{item.joke}</Text>
                        )}
                        {editingIndex === index ? (
                            <View style={{ flexDirection: 'row' }}>
                                <Pressable onPress={() => handleEditSubmit(index)} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10, marginHorizontal: 5 }}>
                                    <Text style={{ color: 'white' }}>Save</Text>
                                </Pressable>
                                <Pressable onPress={() => setEditingIndex(null)} style={{ backgroundColor: 'red', padding: 10, borderRadius: 10, marginHorizontal: 5 }}>
                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row' }}>
                                <Pressable onPress={() => setEditingIndex(index)} style={{ backgroundColor: 'gray', padding: 10, borderRadius: 10, marginHorizontal: 5 }}>
                                    <Text style={{ color: 'white' }}>Edit</Text>
                                </Pressable>
                                <Pressable onPress={() => handleDelete(index)} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginHorizontal: 5 }}>
                                    <Text style={{ color: 'white' }}>Delete</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
            />
            <Footer />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
    },
    signOutButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
    },
    inputArea: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 20,
        backgroundColor: 'white',
        width: '100%',
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
    },
    jokeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: 'white',
        width: '100%',
    },
    editInput: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
    },
});


export default Jokes;
