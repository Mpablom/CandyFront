import { Routes } from '@angular/router';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';

export const routes: Routes = [
  { path: 'reservations', component: ReservationListComponent },
  { path: 'reservations/new', component: ReservationFormComponent }
];
