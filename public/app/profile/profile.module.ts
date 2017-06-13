import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProfileRoutes } from './profile.routes';
import { ProfileComponent } from './profile.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ProfileRoutes),
  ],
  declarations: [
    ProfileComponent,
  ]
})
export class ProfileModule {}