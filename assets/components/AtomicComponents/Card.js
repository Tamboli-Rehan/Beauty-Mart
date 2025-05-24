import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Card = () => {
  return (
    <View style={styles.card}>
      {/* Discount Tag */}
      <View style={styles.discountTag}>
        <Text style={styles.discountText}>20%</Text>
      </View>

      {/* Product Image */}
      <Image
        source={{ uri: "https://via.placeholder.com/160x108" }}
        style={styles.image}
      />

      {/* Title + Pack Tag */}
      <View style={styles.rowBetween}>
        <Text style={styles.productId}>Product ID</Text>
        <Text style={styles.packTag}>PACK</Text>
      </View>

      {/* Product Description */}
      <Text style={styles.description} numberOfLines={1}>
        Sample Product Detail
      </Text>

      {/* Prices */}
      <View style={styles.priceBlock}>
        <Text style={styles.price}>₹999.00</Text>
        <Text style={styles.mrp}>MRP ₹1,199.00</Text>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
  },
  discountTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#E53935",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productId: {
    fontSize: 14,
    fontWeight: "600",
  },
  packTag: {
    backgroundColor: "#FFA000",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginVertical: 6,
  },
  priceBlock: {
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#388E3C",
  },
  mrp: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Card;
