import {createAppContainer, createStackNavigator} from 'react-navigation';
import {RegisterScreen} from './RegisterScreen';
import {HomeScreen} from './HomeScreen';

const MainNavigator = createStackNavigator({
	Register: {
		screen: RegisterScreen,
		navigationOptions: {
			title: 'Register'
		}
	},
	Home: {
		screen: HomeScreen,
		navigationOptions: {
			title: 'Garbage Truck Tracker'
		}
	}
}, {
	defaultNavigationOptions: {
		headerStyle: {
			backgroundColor: '#f4511e'
		},
		headerTintColor: '#fff'
	}
});

export const App = createAppContainer(MainNavigator);
