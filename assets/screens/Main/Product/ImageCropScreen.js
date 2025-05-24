import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import { useState } from "react";
import { Alert, Button, Image, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

const ImageCropScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params;
  const [croppedImage, setCroppedImage] = useState(null);

  const cropImage = async () => {
    try {
      // First, get image dimensions
      const imageInfo = await ImageManipulator.manipulateAsync(imageUri, [], {
        base64: false,
      });

      const originalWidth = imageInfo.width;
      const originalHeight = imageInfo.height;

      // Choose square size based on the smaller side
      const cropSize = Math.min(originalWidth, originalHeight);

      const originX = (originalWidth - cropSize) / 2;
      const originY = (originalHeight - cropSize) / 2;

      // Crop centered square
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropSize,
              height: cropSize,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      setCroppedImage(result.uri);

      // Go back and pass cropped image
      setTimeout(() => {
        navigation.replace("Product", {
          croppedImageUri: result.uri,
        });
      }, 2000);
      Toast.show({
        type: "success",
        text1: "Image Cropped Successfully",
        text2: "Navigating to the Product Screen.",
      });
    } catch (err) {
      Alert.alert("Crop Failed", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: croppedImage || imageUri }} style={styles.image} />
      <Button title="Crop Image" onPress={cropImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: 300, height: 400, resizeMode: "contain", marginBottom: 20 },
});

export default ImageCropScreen;
