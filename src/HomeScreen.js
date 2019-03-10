import React, {Component} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {MapView} from 'expo';
import {container} from './ioc';
import {Manager} from './manager';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#444'
	},
	marker: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	markerTitle: {
		padding: 5,
		color: '#000',
		backgroundColor: '#fff',
		borderRadius: 5,
		fontSize: 10
	},
	markerImage: {
		width: 46,
		height: 46
	}
});

export class HomeScreen extends Component {

	constructor(props) {
		super(props);
		this._manager = container.get(Manager);
		this.state = {
			connected: false,
			user: null,
			users: null
		};
	}

	componentDidMount() {
		this._manager.connected()
			.subscribe(::this._connected);
		this._manager.user()
			.subscribe(::this._user);
		this._manager.users()
			.subscribe(::this._users);
		let url = this.props.navigation.getParam('url');
		this._manager.start(url);
	}

	_connected(connected) {
		this.setState({connected});
		if (connected)
			this._register();
	}

	_register() {
		let name = this.props.navigation.getParam('name');
		this._manager.register(name);
	}

	_user(user) {
		this.setState({user});
	}

	_users(users) {
		this.setState({users});
	}

	componentWillUnmount() {
		this._manager.stop();
	}

	render() {
		return this.state.connected ? (
			<MapView style={styles.container}
							 maxZoomLevel={16}
							 region={{
								 latitude: this.state.user?.location?.coords?.latitude || 0,
								 longitude: this.state.user?.location?.coords?.longitude || 0,
								 latitudeDelta: 0,
								 longitudeDelta: 0
							 }}>
				{this._renderMarker(this.state.user)}
				{this.state.users?.map(::this._renderMarker)}
			</MapView>
		) : (
			<View style={styles.container}>
				<ActivityIndicator size='large' color='#ddd'/>
				<Text style={{color: '#aaa'}}>Connecting...</Text>
			</View>
		);
	}

	_renderMarker(user) {
		let img = user?.id === this.state.user?.id ?
			require('../assets/truck-green.png') :
			require('../assets/truck-orange.png');
		return (
			<MapView.Marker key={user?.id}
											coordinate={{
												latitude: user?.location?.coords?.latitude || 0,
												longitude: user?.location?.coords?.longitude || 0
											}}>
				<View style={styles.marker}>
					<Text style={styles.markerTitle}>{user?.name}</Text>
					<Image style={styles.markerImage} source={img}/>
				</View>
			</MapView.Marker>
		);
	}

}
