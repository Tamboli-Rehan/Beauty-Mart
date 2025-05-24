import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import CategoryScreen from "../screens/Main/Category/CategoryList";
import DashboardScreen from "../screens/Main/DashboardScreen";
import CropScreen from "../screens/Main/Product/ImageCropScreen";
import ProductScreen from "../screens/Main/Product/ProductScreen";

const Tab = createBottomTabNavigator();
const ProductStack = createNativeStackNavigator();

// ✅ Create a stack for Product + Crop
function ProductStackNavigator() {
  return (
    <ProductStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductStack.Screen name="Product" component={ProductScreen} />
      <ProductStack.Screen name="CropScreen" component={CropScreen} />
    </ProductStack.Navigator>
  );
}

// ✅ Main Tabs
export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "Categories") iconName = "grid";
          else if (route.name === "Product") iconName = "pricetags";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Categories" component={CategoryScreen} />
      <Tab.Screen name="Product" component={ProductStackNavigator} />
    </Tab.Navigator>
  );
}
