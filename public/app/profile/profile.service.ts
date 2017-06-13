import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {Injectable} from '@angular/core';
import {Http, Headers, Request, RequestMethod, Response} from '@angular/http';


@Injectable()
export class ProfileService {
	private _baseURL = 'api/users';

	constructor (private _http: Http) {}

	update(user: any): Observable<any> {
		return this._http
			.put(`${this._baseURL}/${user._id}`, user)
			.map((res: Response) => res.json())
			.catch(this.handleError);
  	}

	private handleError(error: Response) {
		return Observable.throw(error.json().message || 'Server error');
	}
}