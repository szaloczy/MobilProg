import { StyleSheet, Text, View, SafeAreaView, Pressable, TextInput, FlatList, ActivityIndicator } from 'react-native';
import ShoppingItem from './components/ShoppingItem';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { app, db, getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase/index";

export default function App() {
  const [title, setTitle] = useState(""); 
  const [price, setPrice] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const addShoppingItem = async () => {
    try {
        const docRef = await addDoc(collection(db, "shopping"), {
          title: title,
          price: parseFloat(price),
          isChecked: false,
        });
        console.log("Item added successfully: ", docRef.id);
       setTitle("");
       setPrice("");
       getShoppingList();
    } catch (e) {
      console.error("Error adding item: ",e);
    }
  }

  const getShoppingList = async () => {
    const querySnapshot = await getDocs(collection(db, "shopping"));
   
    setShoppingList(
      querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    )
  };

  const deleteShoppingList = async () => {
    const querySnapshot = await getDocs(collection(db, "shopping"));
    querySnapshot.docs.map((item) => deleteDoc(doc(db, "shopping", item.id)))
    getShoppingList();
  }

  const calculateTotalPrice = () => {
    return shoppingList.reduce((total, item) => total + (!item.isChecked ? item.price : 0), 0).toFixed(2);
  }

    useEffect(() => {
      getShoppingList();
    }, []);



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Shopping List</Text>
        <Text style={styles.noOfItems}>{shoppingList.length}</Text>

        <Pressable onPress={deleteShoppingList}>
          <MaterialIcons style={styles.bin} name="delete" size={30} color="black"></MaterialIcons>
        </Pressable>
      </View>

      { shoppingList.length > 0 ? (
      <FlatList 
      data={shoppingList}
      renderItem={({item}) => (
      <ShoppingItem 
        title={item.title} 
        price={item.price}
        isChecked={item.isChecked} 
        id={item.id}
        getShoppingList={getShoppingList}
        /> 
      )}
      keyExtractor={item=>item.id}
      /> 
      ) : (
      <ActivityIndicator/>
      )}

      <TextInput 
      placeholder="Enter shopping item" 
      style={styles.input} 
      value={title} 
      onChangeText={(text) => setTitle(text)}
      onSubmitEditing={addShoppingItem}
      />
       <TextInput
        placeholder="Enter price"
        style={styles.input}
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric" // Csak számok beviteléhez
      />
      <Pressable onPress={addShoppingItem} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </Pressable>

      <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice()}</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    padding: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: "500",
    flex: 1,
  },
  noOfItems: {
    fontSize: 30,
    fontWeight: "500",
    marginRight: 20,
  },
  input: {
    backgroundColor: "lightgray",
    padding: 10,
    fontSize: 17,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: "auto",
    marginBottom: 10,
  },
  bin: {
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 10,
  },
});
