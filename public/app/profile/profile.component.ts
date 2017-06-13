import {Component} from '@angular/core';

import {Router} from '@angular/router';
import { AuthenticationService} from '../authentication/authentication.service';
import { ProfileService } from './profile.service';
@Component({
	selector: 'profile',
	templateUrl: './app/profile/profile.template.html'
	providers: [ProfileService]
})
export class ProfileComponent {
	user: any;
	constructor (private _authenticationService: AuthenticationService,
				 private _router: Router,
				 private _profileService: ProfileService) {
		this.user = _authenticationService.user;
	}
	updateUser() {
		this._profileService.update(this.user).subscribe(savedUser => this._router.navigate(['/']),
							 				  				 error =>  this.errorMessage = error);
	}
	
}