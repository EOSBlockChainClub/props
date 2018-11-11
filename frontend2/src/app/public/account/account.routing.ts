import {Routes, RouterModule} from '@angular/router';
import {AccountComponent} from './account.component';
// import {AuthGuard} from '../../features/auth/auth.guard';
export const AccountRoutes: Routes = [
  {
    path: '', // lazy-loaded as 'account' from parent
    component : AccountComponent,
    children : [
      {
        path : 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path : 'sent-props',
        loadChildren: './sent-props/sent-props.module#SentPropsModule'
      }
    ]
  }];

export const AccountRouting = RouterModule.forChild(AccountRoutes);
