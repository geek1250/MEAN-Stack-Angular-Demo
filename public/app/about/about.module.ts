import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AboutRoutes } from './about.routes';
import { AboutComponent } from './about.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AboutRoutes),
  ],
  declarations: [
    AboutComponent,
  ]
})
export class AboutModule {}