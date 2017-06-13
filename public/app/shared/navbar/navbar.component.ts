import { Component } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';


/**
 * This class represents the navigation bar component.
 */
@Component({
  //moduleId: module.id,
  selector: 'kk-navbar',
  templateUrl: './app/shared/navbar/navbar.component.html',//if ./navbar.component.html, it cause app-root is not a known element
  styleUrls: ['./app/shared/navbar/navbar.component.css'],
})

export class NavbarComponent { 
	user: any;

	constructor (private _authenticationService: AuthenticationService) {
		this.user = _authenticationService.user;
	}
}