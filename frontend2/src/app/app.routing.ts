import {Routes, RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from './layouts/default-layout/default-layout.component';

const ROUTES: Routes = [
  {
    path : '',
    component : DefaultLayoutComponent,
    data : {
      title : 'Main Views'
    },
    children: [
      // Main homepage
      {
        path: '',
        loadChildren: './public/home/home.module#HomeModule'
      },
      // test
      {
        path: 'test',
        loadChildren: './public/account/account.module#AccountModule'
      }
    ]
  },
  // Account route
  {
    // canActivate: [MetaGuard],
    path : 'account',
    loadChildren: './public/account/account.module#AccountModule'
  },
];

export const appRouter = RouterModule.forRoot(ROUTES);
