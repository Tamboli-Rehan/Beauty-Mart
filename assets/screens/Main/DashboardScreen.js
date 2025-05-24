// DashboardScreen.js
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseConfigue";

const DashboardScreen = () => {
  // const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    users: 0,
    lowStock: 0,
  });
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const loadStats = async () => {
  //     try {
  //       const stats = await getDashboardStats();
  //       setStats(stats); //  This now works because setStats is defined
  //     } catch (err) {
  //       console.error(" Failed to load dashboard stats:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadStats();
  // }, []);
  // if (loading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color="#6200ee" />
  //     </View>
  //   );
  // }

  useFocusEffect(
    React.useCallback(() => {
      const fetchDashboardData = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;

          // Fetch user products
          const q = query(
            collection(db, "products"),
            where("userId", "==", user.uid)
          );
          const productSnapshot = await getDocs(q);
          const userProducts = productSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fetch total registered users
          const userSnapshot = await getDocs(collection(db, "users"));
          const totalUsers = userSnapshot.size;

          // Set products and stats
          setProducts(userProducts);
          setStats((prev) => ({
            ...prev,
            products: userProducts.length,
            lowStock: userProducts.filter((p) => p.quantity <= 5).length,
            users: totalUsers,
          }));
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        }
      };

      fetchDashboardData();
    }, [])
  );

  const handleBannerNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const StatCard = ({ title, count, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCount}>{count}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📊 Dashboard Summary</Text>

        <View style={styles.cardContainer}>
          <StatCard
            title="Categories"
            count={stats.categories}
            onPress={() => handleBannerNavigate("Categories")}
          />
          <StatCard
            title="Products"
            count={stats.products}
            onPress={() => handleBannerNavigate("Product")}
          />
          <StatCard title="Users" count={stats.users} />
          <StatCard title="Low Stock" count={stats.lowStock} />
        </View>

        <Text style={styles.subHeader}>🛒 Recent Products</Text>

        {products.length === 0 ? (
          <Text style={styles.noProductsText}>No products added yet.</Text>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 20 }}
            data={products}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.productImage}
                />
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productText}>Qty: {item.quantity}</Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.productDescription}
                  >
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
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  noProductsText: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#888",
  },
  productItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 15,
    width: 180,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  productText: {
    fontSize: 12,
    color: "#666",
  },
  productDescription: {
    fontSize: 12,
    color: "#888",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: "#555",
  },
  cardCount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productItem: {
    flexDirection: "column",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productImage: { width: "100%", height: "80%", borderRadius: 8 },
  productName: { fontWeight: "bold", fontSize: 12, marginBottom: 4 },
});
export default DashboardScreen;
