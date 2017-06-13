import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

//add by Kevin to enable Production Mode
//if (process.env.NODE_ENV === 'production') {
	//enableProdMode(); 
//} 
platformBrowserDynamic().bootstrapModule(AppModule);