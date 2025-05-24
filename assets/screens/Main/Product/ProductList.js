// ProductList.js
import { FlatList } from "react-native";
import Card from "../../../components/AtomicComponents/Card";

const data = [
  {
    id: "1",
    imageUri: "https://picsum.photos/seed/pic1/600/400",
    title: "Product 1",
    description: "This is the first product description.",
  },
  {
    id: "2",
    imageUri: "https://picsum.photos/seed/pic2/600/400",
    title: "Product 2",
    description: "This is the second product description.",
  },
  {
    id: "3",
    imageUri: "https://picsum.photos/seed/pic3/600/400",
    title: "Product 3",
    description: "This is the third product description.",
  },
];

const ProductList = () => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card
          imageUri={item.imageUri}
          title={item.title}
          description={item.description}
        />
      )}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ProductList;
