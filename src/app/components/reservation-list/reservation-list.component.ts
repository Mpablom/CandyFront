import { Component, OnInit } from "@angular/core";
import { Reservation } from "../../models/reservation.model";
import { ReservationService } from "../../services/reservation.service";
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from "@angular/router";
import { Customer } from "../../models/customer.model";
import { CustomerService } from "../../services/customer.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  customers: Customer[] = [];
  deletedReservations: Reservation[] = [];
  showDeletedReservations: boolean = false;
  displayedColumns: string[] = ['reservationDate', 'deposit', 'customerName', 'customerPhone', 'actions'];

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private customerService: CustomerService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data.filter(reservation => !reservation.deleted);
        this.deletedReservations = data.filter(reservation => reservation.deleted);
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.snackBar.open('Error al cargar las reservas.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }
  toggleDeletedReservations(): void {
    this.showDeletedReservations = !this.showDeletedReservations;
  }

  recoverReservation(id: number): void {
    this.reservationService.recoverReservation(id).subscribe({
      next: () => {
        this.snackBar.open('Reserva recuperada correctamente.', 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar']
  });
        this.loadReservations();
        this.showDeletedReservations = false;
      },
      error: (error) => {
        console.error('Error recovering reservation:', error);
        this.snackBar.open('Error al recuperar la reserva.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Cliente no encontrado';
  }

  getCustomerPhone(customerId: number): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? customer.phone : 'Teléfono no encontrado';
  }
  editReservation(reservation: Reservation): void {
    console.log('Editar reserva:', reservation);
  }
  deleteReservation(id: number): void {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        const deletedReservation = this.reservations.find(reservation => reservation.id === id);
        if (deletedReservation) {
          this.reservations = this.reservations.filter(reservation => reservation.id !== id);
          this.deletedReservations.push(deletedReservation);
        }
        this.snackBar.open('Reserva eliminada correctamente.', 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error deleting reservation:', error);
        if (error.status !== 204) {
          this.snackBar.open('Error al eliminar la reserva.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else {
          const deletedReservation = this.reservations.find(reservation => reservation.id === id);

          if (deletedReservation) {
            this.reservations = this.reservations.filter(reservation => reservation.id !== id);
            this.deletedReservations.push(deletedReservation);
          }

          this.snackBar.open('Reserva eliminada correctamente.', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        }
      }
    });
  }
  goToHome(): void {
    this.router.navigate(['']);
  }

}
