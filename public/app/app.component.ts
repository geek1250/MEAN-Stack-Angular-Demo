import { Component } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  //template: '<router-outlet></router-outlet>',
  templateUrl: 'app/app.component.html' //if app.component.html, it will not find and it will cause an error :
  	/*
  Uncaught (in promise): Error: Error in app.component.html:7:2 caused by: Maximum call stack size exceeded
	RangeError: Maximum call stack size exceeded
	*/
  
})
export class AppComponent {
	user: any;
	constructor(public _authenticationService: AuthenticationService, private router: Router) {
		this.user = _authenticationService.user;
	}
}