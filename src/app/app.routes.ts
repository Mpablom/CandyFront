import { Routes } from '@angular/router';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';

export const routes: Routes = [
  { path: 'reservations', component: ReservationListComponent },
  //{ path: 'reservations/new', component: ReservationFormComponent },
  { path: '', redirectTo: '/reservations', pathMatch: 'full' }
];
