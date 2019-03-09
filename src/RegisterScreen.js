import React, {Component} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {boundMethod} from 'autobind-decorator';
import {Location} from 'expo';
import config from './config';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: '35%',
		paddingHorizontal: '10%',
		backgroundColor: '#444'
	},
	box: {
		paddingVertical: 30,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderColor: '#555',
		borderRadius: 10,
		backgroundColor: '#333'
	},
	title: {
		color: '#fff'
	},
	input: {
		marginVertical: 20,
		padding: 10,
		borderWidth: 1,
		borderColor: '#777',
		borderRadius: 5,
		color: '#fff',
		backgroundColor: '#666'
	}
});

export class RegisterScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			url: config.defaultUrl,
			name: ''
		};
	}

	@boundMethod
	_onRegister() {
		Location.requestPermissionsAsync()
			.then(() => Location.hasServicesEnabledAsync())
			.then(enabled => {
				if (enabled)
					this.props.navigation.replace('Home', {
						name: this.state.name,
						url: this.state.url
					});
				else
					Alert.alert('Failed', 'Please enable your location service.');
			});
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<View style={styles.box}>
					<Text style={styles.title}>Server Url</Text>
					<TextInput style={styles.input}
										 value={this.state.url}
										 placeholder='Please enter the server url'
										 onChangeText={url => this.setState({url})}/>
					<Text style={styles.title}>Your Name</Text>
					<TextInput style={styles.input}
										 value={this.state.name}
										 placeholder='Please enter your name'
										 onChangeText={name => this.setState({name})}/>
					<Button disabled={!this.state.url || !this.state.name}
									title='Submit'
									onPress={this._onRegister}/>
				</View>
			</ScrollView>
		);
	}

}
