import { Component, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
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
import { MatCardModule } from '@angular/material/card';
import { animate, style, transition, trigger } from "@angular/animations";


@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css'],
  animations: [
    trigger('cardTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' }))
      ])
    ]),
    trigger('buttonsTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('800ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class ReservationListComponent implements OnInit, OnDestroy {
  @HostBinding('@cardTransition') cardState = 'in';
  reservations: Reservation[] = [];
  customers: Customer[] = [];
  deletedReservations: Reservation[] = [];
  showDeletedReservations = false;
  areButtonsVisible = false;
  isEditMode: boolean = false;
  shouldShowCreationForm = false;
  groupedReservations: { month: number; year: number; reservations: Reservation[] }[] = [];
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

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.areButtonsVisible = true;
    }, 100);
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data.filter(reservation => !reservation.deleted);
        this.deletedReservations = data.filter(reservation => reservation.deleted);

        this.groupReservationsByMonth();
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
    this.shouldShowCreationForm = true;
    this.isEditMode = false;
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
    this.isEditMode = true;
    this.shouldShowCreationForm = false;
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
          this.groupReservationsByMonth();
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

  groupReservationsByMonth(): void {
    const grouped = this.reservations.reduce((acc, reservation) => {
      let date: Date;

      if (typeof reservation.reservationDate === 'string' && reservation.reservationDate.includes('-')) {
        const [year, month, day] = reservation.reservationDate.split('-');
        date = new Date(+year, +month - 1, +day); // Meses 0-based
      }
      else if (typeof reservation.reservationDate === 'string' && reservation.reservationDate.includes('/')) {
        const [day, month, year] = reservation.reservationDate.split('/');
        date = new Date(+year, +month - 1, +day); // Meses 0-based
      }
      else {
        date = new Date(reservation.reservationDate);
      }

      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', reservation.reservationDate);
        return acc;
      }

      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const yearGroup = normalizedDate.getFullYear();
      const monthGroup = normalizedDate.getMonth();

      let group = acc.find(g => g.month === monthGroup && g.year === yearGroup);
      if (!group) {
        group = { month: monthGroup, year: yearGroup, reservations: [] };
        acc.push(group);
      }

      group.reservations.push(reservation);
      return acc;
    }, [] as { month: number; year: number; reservations: Reservation[] }[]);

    this.groupedReservations = grouped.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }

  // Añadir manejo de errores en getMonthName
  getMonthName(month: number): string {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[month] || 'Mes desconocido'; // Evita "NaN"
  }

  goToHome(): void {
    setTimeout(() => {
      this.router.navigate(['']);
    }, 300);
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

