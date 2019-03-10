import {registerSelf} from './ioc';
import io from 'socket.io-client';
import {Subject} from 'rxjs';

@registerSelf()
export class Socket {

	constructor() {
		this._socket = null;
		this._onConnect = new Subject();
		this._onRegistered = new Subject();
		this._onUpdated = new Subject();
		this._onAdded = new Subject();
		this._onLeft = new Subject();
		this._onDisconnect = new Subject();
	}

	start(url) {
		this._socket = io(url);
		this._socket.on('connect', ::this._connect);
		return Promise.resolve();
	}

	register(name) {
		this._socket.emit('register', name);
		this._socket.on('registered', ::this._registered);
	}

	update(location) {
		this._socket.emit('update:location', location);
	}

	_connect() {
		this._socket.on('disconnect', ::this._disconnect);
		this._onConnect.next();
	}

	_registered(data) {
		this._socket.on('updated:location', ::this._updated);
		this._socket.on('added', ::this._added);
		this._socket.on('left', ::this._left);
		this._onRegistered.next(data);
	}

	_updated(data) {
		this._onUpdated.next(data);
	}

	_added(data) {
		this._onAdded.next(data);
	}

	_left(id) {
		this._onLeft.next(id);
	}

	_disconnect() {
		this._onDisconnect.next();
	}

	stop() {
		if (this._socket.connected)
			this._socket.close();
		return Promise.resolve();
	}

	onConnect() {
		return this._onConnect.asObservable();
	}

	onRegistered() {
		return this._onRegistered.asObservable();
	}

	onUpdated() {
		return this._onUpdated.asObservable();
	}

	onAdded() {
		return this._onAdded.asObservable();
	}

	onLeft() {
		return this._onLeft.asObservable();
	}

	onDisconnect() {
		return this._onDisconnect.asObservable();
	}

}
