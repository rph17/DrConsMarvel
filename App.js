import React from 'react'
import { StatusBar, Platform } from 'react-native'
import Favoritos from './src/pages/favoritos'
import Home from './src/pages/home'
import Description from './src/pages/descripton'
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator  
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

const RootStack = createBottomTabNavigator({
 
  Home: {
    screen: Home,
    path: '/',
    navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
            // const iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            const iconName = `ios-grid`;
            return <Ionicons name={iconName} size={25} color={tintColor} />;
        },
    },
  },
  Favoritos: {
    screen: Favoritos,
    path: './src/pages/favoritos',
    navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
            // const iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            const iconName = `ios-star-half`;
            return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
    },
  },
  Description: {
    screen: Description,
    path: '/',
    navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
            // const iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            const iconName = `ios-list`;
            return <Ionicons name={iconName} size={25} color={tintColor} />;
        },
    },
  },
}
// ,{
//   initialRouteName: 'Home',
//   activeTintColor: '#F44336',
//   inactiveColor: '#3e2465',
//   barStyle: { backgroundColor: '#694fad' },
// }
);

// export default App
const App = createAppContainer(RootStack);

export default App;
