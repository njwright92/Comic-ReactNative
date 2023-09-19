import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { auth} from '../firebase/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, query, where, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const ComicBot = () => {
    const navigation = useNavigation();
    const [allConversations, setAllConversations] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [userUID, setUserUID] = useState(auth.currentUser ? auth.currentUser.uid : null);

    const askComicbot = async (prompt) => {
        try {
            const res = await axios.post('http://localhost:3001/ask-comicbot/', { prompt });
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

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
        const fetchConvos = async () => {
            if (userUID) {
                const convoQuery = query(collection(db, "conversations"), where("uid", "==", userUID));
                const querySnapshot = await getDocs(convoQuery);
                const fetchedConvos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    messages: doc.data().messages
                }));
                setAllConversations(fetchedConvos);
            }
        };
        fetchConvos();
    }, [userUID]);

    const saveConversation = async () => {
        if (userUID) {
            try {
                const convoCollection = collection(db, "conversations");
                await addDoc(convoCollection, {
                    uid: userUID,
                    messages: conversation,
                });
                setAllConversations([...allConversations, conversation]);
                setConversation([]);
            } catch (error) {
                console.error("Error saving conversation: ", error);
            }
        }
    };

    const deleteConversation = async (docID) => {
        try {
            await deleteDoc(doc(db, "conversations", docID));
            setAllConversations(allConversations.filter(convo => convo.id !== docID));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleInputChange = (text) => {
        setUserInput(text);
    };

    const handleSend = async () => {
        setIsSaved(false);
        setConversation([...conversation, { from: 'user', text: userInput }]);
        setUserInput('');

        try {
            const botResponses = await askComicbot(userInput);
            const botResponse = botResponses.generated_text;
            setConversation(prevConversation => [...prevConversation, { from: 'bot', text: botResponse }]);
        } catch (error) {
            console.error(error);
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
        <View style={{ flex: 1, padding: 10 }}>
            <Navbar navigation={navigation} />
            <Text style={{ fontSize: 30, textAlign: 'center', marginVertical: 20 }}>ComicBot!</Text>
            <Pressable onPress={handleSignOut} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>Sign Out</Text>
            </Pressable>
            <TextInput
                value={userInput}
                onChangeText={handleInputChange}
                placeholder="Ask me anything.."
                multiline
                numberOfLines={2}
                style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 20 }}
            />
            <Pressable onPress={handleSend} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>Send</Text>
            </Pressable>
            <ScrollView>
                {conversation.map((message, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginVertical: 5 }}>
                        <Text>{message.from === 'bot' ? 'ComicBot: ' : 'You: '}</Text>
                        <Text>{message.text}</Text>
                    </View>
                ))}
            </ScrollView>
            <Pressable onPress={saveConversation} disabled={isSaved} style={{ backgroundColor: isSaved ? 'gray' : 'green', padding: 10, borderRadius: 5, marginVertical: 20 }}>
                <Text style={{ color: 'white' }}>{isSaved ? 'Conversation Saved' : 'Save Conversation'}</Text>
            </Pressable>
            <Footer />
        </View>
    );
};

export default ComicBot;
