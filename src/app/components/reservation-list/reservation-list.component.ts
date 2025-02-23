import { Component, OnInit } from "@angular/core";
import { Reservation, ReservationRequestDto } from "../../models/reservation.model";
import { ReservationService } from "../../services/reservation.service";
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from "@angular/router";
import { Customer } from "../../models/customer.model";
import { CustomerService } from "../../services/customer.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  customers: Customer[] = [];
  deletedReservations: Reservation[] = [];
  showDeletedReservations = false;
  displayedColumns: string[] = ['reservationDate', 'deposit', 'location', 'customerName', 'customerPhone', 'actions'];

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data.filter(reservation => !reservation.deleted);
        this.deletedReservations = data.filter(reservation => reservation.deleted);
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.showErrorSnackbar('Error al cargar las reservas.');
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.showErrorSnackbar('Error al cargar los clientes.');
      }
    });
  }

  toggleDeletedReservations(): void {
    this.showDeletedReservations = !this.showDeletedReservations;
  }

  createReservation(): void {
    this.router.navigate(['/reservations/new']);
  }

  recoverReservation(id: number): void {
    this.reservationService.recoverReservation(id).subscribe({
      next: () => {
        this.showSuccessSnackbar('Reserva recuperada correctamente.');
        this.loadReservations();
        this.showDeletedReservations = false;
      },
      error: (error) => {
        console.error('Error recovering reservation:', error);
        this.showErrorSnackbar('Error al recuperar la reserva.');
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
    if (!reservation.customer?.id) {
      this.showErrorSnackbar('Error: ID de cliente no definido.');
      return;
    }
    this.router.navigate(['/reservations/edit', reservation.id]);
  }

  deleteReservation(id: number): void {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        const deletedReservation = this.reservations.find(reservation => reservation.id === id);
        if (deletedReservation) {
          this.reservations = this.reservations.filter(reservation => reservation.id !== id);
          this.deletedReservations.push(deletedReservation);
        }
        this.showSuccessSnackbar('Reserva eliminada correctamente.');
      },
      error: (error: any) => {
        console.error('Error deleting reservation:', error);
        this.showErrorSnackbar('Error al eliminar la reserva.');
      }
    });
  }

  deletePastReservationsAndCustomers(): void {
    this.reservationService.deletePastReservationsAndCustomers().subscribe({
      next: (response: { message: string }) => {
        this.showSuccessSnackbar(response.message);
        this.loadReservations();
        this.loadCustomers();
      },
      error: (error: any) => {
        console.error('Error eliminando reservas y clientes pasados:', error);
        this.showErrorSnackbar('Error al eliminar reservas y clientes pasados.');
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['']);
  }

  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}

