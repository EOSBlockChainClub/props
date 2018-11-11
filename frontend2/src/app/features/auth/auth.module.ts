import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from './auth.service';
import {AuthGuardLogin} from './auth-guard-login.service';
import {AuthUserService} from './auth-user.service';
import {AuthGuard} from './auth.guard';
// import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {JwtModule} from '@auth0/angular-jwt';

export function JwtModuleConfigFactory() {
  if (typeof window === 'undefined') { return; }
  return localStorage.getItem('access_token') || undefined;
}

// Were going to use this for YouTube login, decided not to
@NgModule({
  imports: [
    CommonModule,
    // Ng2UiAuthModule.forRoot({
    //   providers: authProviders
    // }),
    JwtModule.forRoot({
      config : {
        tokenGetter : JwtModuleConfigFactory
      }
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
    AuthGuardLogin,
    AuthUserService,
    // Ng2UiAuthModule
  ],
  declarations: []
})
export class AuthModule { }
