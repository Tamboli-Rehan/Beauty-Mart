import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { auth, db } from "../../../firebaseConfigue";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnpj8tpmi/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "Beauty-Mart-Upload";

export default function ProductScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  // const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingImageId, setLoadingImageId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const currentUser = auth.currentUser;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([
    { label: "Bath & Body", value: "Bath & Body" },
    { label: "Fragrance", value: "Fragrance" },
    { label: "Hair Care", value: "Hair Care" },
    { label: "Make-up", value: "Make-up" },
    { label: "Menicure & Pedicure", value: "Menicure & Pedicure" },
  ]);
  useEffect(() => {
    if (!currentUser) return;

    // Realtime listener for user's products
    const q = query(
      collection(db, "products"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userProducts = [];
      querySnapshot.forEach((doc) => {
        userProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(userProducts);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied to access gallery!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied to access camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      navigation.navigate("CropScreen", {
        imageUri: result.assets[0].uri,
      });
    }
  };

  const uploadProduct = async () => {
    if (!name || !quantity || !description || !imageUri) {
      alert("Please fill all fields and select an image");
      return;
    }

    setLoading(true);

    try {
      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "product.jpg",
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Upload image to Cloudinary
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      } else {
        setLoading(false);
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error("Image upload failed");
      }

      const imageUrl = data.secure_url;
      const publicId = data.public_id;

      // Save product info in Firestore
      try {
        const docRef = await addDoc(collection(db, "products"), {
          name,
          quantity: Number(quantity),
          description,
          category: dropdownValue,
          imageUrl,
          publicId,
          userId: currentUser.uid,
          createdAt: new Date(),
        });

        Toast.show({
          type: "success",
          text1: "Product added successfully",
          text2: "Your product has been added to the inventory.",
        });

        setName("");
        setQuantity("");
        setDescription("");
        setImageUri(null);
      } catch (err) {
        console.error("Error adding product:", err);
        alert("Failed to add product");
      }
    } catch (err) {
      console.error("Error uploading image or saving product:", err);
      alert("Failed to add product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeleteLoading(true);
      await deleteDoc(doc(db, "products", productId));
      Toast.show({
        type: "success",
        text1: "Product deleted successfully",
        text2: "Your product has been removed from the inventory.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.croppedImageUri) {
      setImageUri(route.params.croppedImageUri);
      // Clear the param to prevent unwanted reuse if the screen re-focuses
      navigation.setParams({ croppedImageUri: null });
    }
  }, [route.params?.croppedImageUri]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.header} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
          <Text style={styles.headerText}>Customize Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text>Select Image from Gallery</Text>
          )}
        </TouchableOpacity>

        <Button title="Take Photo" onPress={takePhoto} />

        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          editable={!loading}
          placeholderTextColor="black"
        />
        <TextInput
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
          editable={!loading}
          placeholderTextColor="black"
        />
        {/* <TextInput
          placeholder="Category"
          onChangeText={setCategory}
          style={styles.input}
          editable={!loading}
        /> */}
        <View style={{ zIndex: 1000 }}>
          <DropDownPicker
            open={dropdownOpen}
            value={dropdownValue}
            items={dropdownItems}
            setOpen={setDropdownOpen}
            setValue={setDropdownValue}
            setItems={setDropdownItems}
            placeholder="Select Category"
            style={[styles.dropdown, { marginVertical: 12 }]}
          />
        </View>
        <TextInput
          placeholder="Description: must add weight and dimensions too"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, { height: 80 }]}
          editable={!loading}
          placeholderTextColor="black"
        />

        <Button
          title={loading ? "Saving..." : "Save Product"}
          onPress={uploadProduct}
          disabled={loading}
        />

        <Text style={styles.subtitle}>Your Products</Text>

        {products.length === 0 ? (
          <Text>No products added yet.</Text>
        ) : (
          <FlatList
            data={products}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 6 }}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <View
                  style={{
                    position: "relative",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {deleteLoading === item.id && (
                    <ActivityIndicator
                      style={styles.imageLoader && { color: "red" }}
                      size="small"
                      color="#999"
                    />
                  )}
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.productImage}
                    onLoadStart={() => setLoadingImageId(item.id)}
                    onLoadEnd={() => setLoadingImageId(null)}
                  />
                  {loadingImageId === item.id && (
                    <ActivityIndicator
                      style={styles.imageLoader}
                      size="small"
                      color="#999"
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => handleDeleteProduct(item.id)}
                    style={{ padding: 8 }}
                  >
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Qty: {item.quantity}
                  </Text>
                  <Text numberOfLines={3} ellipsizeMode="tail">
                    {item.description}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 0,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 24,
    fontWeight: "bold",
    // marginTop: 30,
    // marginLeft: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
    marginLeft: 12,
  },
  image: { width: "100%", height: "100%", borderRadius: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 12,
    padding: 8,
    borderRadius: 6,
  },
  subtitle: { fontSize: 20, marginTop: 24, marginBottom: 8, fontWeight: "600" },
  productImage: { width: 60, height: 60, borderRadius: 8 },
  productCard: {
    width: 180,
    backgroundColor: "#fdfdfd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: { fontWeight: "bold", fontSize: 18, marginBottom: 4 },
  imageLoader: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
  },
});
