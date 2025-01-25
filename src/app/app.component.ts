import { Component } from '@angular/core';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';

@Component({
  selector: 'app-root',
  imports: [ReservationListComponent],
  template: `<app-reservation-list></app-reservation-list>`,
  styleUrl: './app.component.css'
})
export class AppComponent {

}
