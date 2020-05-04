import React, { useEffect } from "react";
import {
  Text,
  View,
  Platform,
  StatusBar,
  TouchableOpacity
} from "react-native";
import AddEntry from "./components/AddEntry";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";
import History from "./components/History";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { purple, white } from "./utils/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { createStackNavigator } from "@react-navigation/stack";
import EntryDetail from "./components/EntryDetail";
import Live from "./components/Live";
import { setLocalNotification } from "./utils/helper";

const store = createStore(reducer);

function CustomStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

// Config for TabNav
const RouteConfigs = {
  History: {
    name: "History",
    component: History,
    options: {
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
      ),
      title: "History"
    }
  },
  AddEntry: {
    component: AddEntry,
    name: "Add Entry",
    options: {
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name="plus-square" size={30} color={tintColor} />
      ),
      title: "Add Entry"
    }
  },
  Live: {
    name: "Live",
    component: Live,
    options: {
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-speedometer" size={30} color={tintColor} />
      ),
      title: "Live"
    }
  }
};

const TabNavigatorConfig = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
};

const Tab =
  Platform.OS === "ios"
    ? createBottomTabNavigator()
    : createMaterialTopTabNavigator();

const TabNav = () => (
  <Tab.Navigator {...TabNavigatorConfig}>
    <Tab.Screen {...RouteConfigs["History"]} />
    <Tab.Screen {...RouteConfigs["AddEntry"]} />
    <Tab.Screen {...RouteConfigs["Live"]} />
  </Tab.Navigator>
);

// Config for StackNav
const StackNavigatorConfig = {
  headerMode: "screen"
};
const StackConfig = {
  TabNav: {
    name: "Home",
    component: TabNav,
    options: { headerShown: false }
  },
  EntryDetail: {
    name: "EntryDetail",
    component: EntryDetail,
    options: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple
      },
      title: null
    }
  }
};
const Stack = createStackNavigator();
const MainNav = () => (
  <Stack.Navigator {...StackNavigatorConfig}>
    <Stack.Screen {...StackConfig["TabNav"]} />
    <Stack.Screen {...StackConfig["EntryDetail"]} />
  </Stack.Navigator>
);

export default function App() {
  useEffect(() => {
    setLocalNotification();
  }, []);

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <CustomStatusBar backgroundColor={purple} barStyle="ligth-content" />
        <NavigationContainer>
          <MainNav />
        </NavigationContainer>
      </View>
    </Provider>
  );
}
