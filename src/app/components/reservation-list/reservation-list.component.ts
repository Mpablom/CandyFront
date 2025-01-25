import { Component, OnInit } from "@angular/core";
import { Reservation } from "../../models/reservation.model";
import { ReservationService } from "../../services/reservation.service";
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule ],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
    });
  }

  editReservation(reservation: Reservation): void {
    console.log('Editar reserva:', reservation);
  }

  deleteReservation(id: number): void {
    this.reservationService.deleteReservation(id).subscribe(() => {
      this.reservations = this.reservations.filter(reservation => reservation.id !== id);
    });
  }
}
