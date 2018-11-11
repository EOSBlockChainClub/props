import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import {SidenavService} from '../sidenav/sidenav.service';
import {RouterModule} from '@angular/router';
import {NavbarService} from './navbar.service';
import { AuthModule } from '../auth/auth.module';
import {MatButtonModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    AuthModule
  ],
  providers : [ SidenavService, NavbarService ],
  declarations: [ NavbarComponent ],
  exports : [ NavbarComponent ]
})
export class NavbarModule { }
