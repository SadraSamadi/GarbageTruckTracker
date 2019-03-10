import {registerSelf} from './ioc';
import {Location} from 'expo';
import {Subject} from 'rxjs';

@registerSelf()
export class Tracker {

	constructor() {
		this._watcher = null;
		this._onLocation = new Subject();
	}

	start() {
		this._watcher = Location.watchPositionAsync({
			accuracy: Location.Accuracy.Highest
		}, ::this._change);
		return Promise.resolve();
	}

	_change(location) {
		this._onLocation.next(location);
	}

	stop() {
		this._watcher?.remove();
		return Promise.resolve();
	}

	onLocation() {
		return this._onLocation.asObservable();
	}

}
