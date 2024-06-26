import { Routes } from '@angular/router';
import { TitlePageComponent } from './title-page/title-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { authenticationGuard, loggedInGuard } from './auth-guard.service';
export const routes: Routes = [
  {
    path: '',
    component: TitlePageComponent,
    title: 'Chico Degens Poker Club',
    canActivate: [loggedInGuard]
  },
  {
    path: 'home',
    component: HomePageComponent,
    title: 'Chico Degens Poker Club',
    canActivate: [authenticationGuard]
  }

];
