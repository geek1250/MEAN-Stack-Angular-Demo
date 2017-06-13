import {Component} from '@angular/core';
import {AuthenticationService} from '../authentication/authentication.service';
import {ArticlesService} from '../articles/articles.service';

@Component({
	selector: 'home',
	templateUrl: './app/home/home.template.html',
	providers: [ArticlesService]
})
export class HomeComponent {
	user: any;
	articles: any;
	constructor (private _authenticationService: AuthenticationService,
				 private _articlesService: ArticlesService) {
		this.user = _authenticationService.user;
	}

	ngOnInit() {
		this._articlesService.list().subscribe(articles  => this.articles = articles);
	}
}