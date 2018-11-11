import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';

const ACCOUNT_DASHBOARD_ROUTES: Routes = [{
  path: '', // lazy-loaded
  component: DashboardComponent
}];


export const DashboardRoutes = RouterModule.forChild(ACCOUNT_DASHBOARD_ROUTES);
