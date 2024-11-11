import { StyleSheet, View, Text, Pressable, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { db, doc, updateDoc, deleteDoc } from "../firebase/index"

const ShoppingItem = (prop) => {

    const [isChecked, setIsChecked] = useState(prop.isChecked);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(prop.title);
    const [price, setPrice] = useState(prop.price);

    const updateIsChecked = async () => {
        const shoppingRef = doc(db, "shopping", prop.id);

        await updateDoc(shoppingRef, {
            isChecked:isChecked,
        });
    }

    const confirmDelete = () => {
        Alert.alert(
            "Delete item",
            "Are you sure to delete this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: deleteShoppingItem
                }
            ]
        );
    };

    const deleteShoppingItem = async () => {
        await deleteDoc(doc(db, "shopping", prop.id))
        prop.getShoppingList();
    }

    const updateTitle = async () => {
        const shoppingRef = doc(db, "shopping", prop.id);
        await updateDoc(shoppingRef, {
            title: title,
            price: parseFloat(price),
        });
        setIsEditing(false); // kilép a szerkesztési módból mentés után
        prop.getShoppingList(); // frissíti a lista állapotot
    };

    useEffect(() => {
        updateIsChecked();
    }, [isChecked])

    return (
        <View style={styles.container}>
            <Pressable onPress={() => setIsChecked(!isChecked)}>
                {
                    isChecked ? ( 
                        <AntDesign name="checkcircle" size={24} color="black" />
                    ):(
                        <AntDesign name="checkcircleo" size={24} color="black" />
                )}
                
            </Pressable>

            {isEditing ? (
                <>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    onSubmitEditing={updateTitle}
                />
                <TextInput
                style={styles.input}
                value={String(price)}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
        </>
            ) : (
                <>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.price}>${price}</Text>
            </>
            )}

            {isEditing ? (
                <Pressable onPress={updateTitle}>
                    <MaterialIcons name="save" size={24} color="black" />
                </Pressable>
            ) : (
                <Pressable onPress={() => setIsEditing(true)}>
                    <MaterialIcons name="edit" size={24} color="black" />
                </Pressable>
            )}

           <Pressable onPress={confirmDelete}>
                <MaterialIcons name="delete" size={24} color="black" />
           </Pressable>
        </View>
    );
};

export default ShoppingItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "lightgray",
        justifyContent: "space-between",
        padding: 10,
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 10,
    },
    price: {
        fontSize: 17,
        marginLeft: 20,
        fontWeight: "500",
        padding: 5
    },
    title: {
        flex: 1,
        marginLeft: 10,
        fontSize: 17,
        fontWeight: "500",
    },
});