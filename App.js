import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

// Screens
import MainTabs from "./BottomtabNavigators/MainTabs";
import LoginScreen from "./screens/LoginFlow/LoginScreen";
import RegistrationScreen from "./screens/LoginFlow/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Register"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Register" component={RegistrationScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </>
  );
}
