import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "react-native-web";

const categories = [
  {
    name: "Bath & Body",
    image:
      "https://m.media-amazon.com/images/W/MEDIAX_1215821-T2/images/G/31/img24/Beauty/march/summer/halos._SS300_QL85_.jpg",
  },
  {
    name: "Fragrance",
    image:
      "https://m.media-amazon.com/images/G/31/img24/Beauty/BAURevamp25/deos._SS300_QL85_FMpng_.png",
  },
  {
    name: "Hair Care",
    image:
      "https://m.media-amazon.com/images/G/31/img24/Beauty/BAURevamp25/hair._SS300_QL85_FMpng_.png",
  },
  {
    name: "Make-up",
    image:
      "https://m.media-amazon.com/images/G/31/img24/Beauty/BAURevamp25/makeup._SS300_QL85_FMpng_.png",
  },
  {
    name: "Menicure & Pedicure",
    image:
      "https://m.media-amazon.com/images/G/31/img24/Beauty/BAURevamp25/prof_beauty_store._SS300_QL85_FMpng_.png",
  },
  {
    name: "Salon & Spa",
    image:
      "https://m.media-amazon.com/images/G/31/img24/Beauty/BAURevamp25/devices._SS300_QL85_FMpng_.png",
  },
  {
    name: "Skin Care",
    image:
      "https://m.media-amazon.com/images/G/31/img24/Beauty/BAURevamp25/skin._SS300_QL85_FMpng_.png",
  },
  {
    name: "Tools & Accessories",
    image:
      "https://m.media-amazon.com/images/G/31/img24/Beauty/BAURevamp25/customers_most_loved._SS300_QL85_FMpng_.png",
  },
];

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;

const CategoryList = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.header} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
          <Text style={styles.headerText}>Category</Text>
        </TouchableOpacity>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: StatusBar.currentHeight || 0,
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    marginLeft: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    alignItems: "center",
    width: (screenWidth - 40) / numColumns,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
