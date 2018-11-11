import {Routes, RouterModule} from '@angular/router';
import { SentPropsComponent } from './sent-props.component';

const ACCOUNT_SENT_PROPS_ROUTES: Routes = [{
  path: '', // lazy-loaded
  component: SentPropsComponent
}];


export const SentPropsRoutes = RouterModule.forChild(ACCOUNT_SENT_PROPS_ROUTES);
