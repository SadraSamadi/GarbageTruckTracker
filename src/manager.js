import {registerSelf} from './ioc';
import {BehaviorSubject} from 'rxjs';
import {Socket} from './socket';
import {Tracker} from './tracker';
import {List} from 'immutable';
import _ from 'lodash';

@registerSelf([Socket, Tracker])
export class Manager {

	constructor(socket, tracker) {
		this._socket = socket;
		this._tracker = tracker;
		this._connected = new BehaviorSubject(false);
		this._user = new BehaviorSubject(null);
		this._users = new BehaviorSubject(null);
	}

	start(url) {
		this._socket.onConnect()
			.subscribe(::this._connect);
		this._socket.onRegistered()
			.subscribe(::this._registered);
		this._socket.onUpdated()
			.subscribe(::this._updated);
		this._socket.onAdded()
			.subscribe(::this._added);
		this._socket.onLeft()
			.subscribe(::this._left);
		this._socket.onDisconnect()
			.subscribe(::this._disconnect);
		this._tracker.onLocation()
			.subscribe(::this._location);
		return this._socket.start(url);
	}

	register(name) {
		this._socket.register(name);
		this._user.next({name});
	}

	_connect() {
		this._connected.next(true);
	}

	_registered(data) {
		let user = _.assign(this._user.value, {id: data.id});
		this._user.next(user);
		let users = List(data.users);
		this._users.next(users);
		this._tracker.start();
	}

	_location(data) {
		let user = _.assign(this._user.value, {location: data});
		this._user.next(user);
		this._socket.update(data);
	}

	_updated(data) {
		let index = this._users.value.findIndex(u => u.id === data.id);
		let user = this._users.value.get(index);
		user = _.assign(user, {location: data.location});
		let users = this._users.value.set(index, user);
		this._users.next(users);
	}

	_added(user) {
		let users = this._users.value.push(user);
		this._users.next(users);
	}

	_left(id) {
		let index = this._users.value.findIndex(u => u.id === id);
		let users = this._users.value.delete(index);
		this._users.next(users);
	}

	_disconnect() {
		this._connected.next(false);
	}

	stop() {
		return this._tracker.stop()
			.then(::this._socket.stop);
	}

	connected() {
		return this._connected.asObservable();
	}

	user() {
		return this._user.asObservable();
	}

	users() {
		return this._users.asObservable();
	}

}
