import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationResponseDto } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  isEditMode = false;
  currentReservationId?: number;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.reservationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      reservationDate: ['', Validators.required],
      deposit: ['', [Validators.required, Validators.min(0)]],
      location: [''],
      customerId: ['']
    });
  }

  checkEditMode(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            this.isEditMode = true;
            this.currentReservationId = +params['id'];
            return this.reservationService.getReservationById(this.currentReservationId);
          } else {
            return [null];
          }
        }),
        take(1)
      )
      .subscribe({
        next: (reservation) => {
          if (reservation) {
            this.loadReservation(reservation);
          }
        },
        error: (error) => {
          this.showError('Error cargando la reserva: ' + error.message);
        }
      });
  }

  loadReservation(reservation: ReservationResponseDto): void {
    const formattedDate = new Date(reservation.reservationDate).toISOString().split('T')[0];
    this.reservationForm.patchValue({
      firstName: reservation.customer.firstName,
      lastName: reservation.customer.lastName,
      phone: reservation.customer.phone,
      reservationDate: formattedDate,
      deposit: reservation.deposit,
      location: reservation.location,
      customerId: reservation.customer.id
    });
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) return;

    const formValue = this.reservationForm.value;
    const reservationDate = new Date(formValue.reservationDate);

    if (reservationDate < new Date()) {
      this.showError('La fecha de reserva no puede ser pasada');
      return;
    }

    if (this.isEditMode && this.currentReservationId) {
      this.updateReservation(formValue);
    } else {
      this.createReservation(formValue);
    }
  }

  createReservation(formValue: any): void {
  const reservationRequest = {
    reservationDate: formValue.reservationDate,
    deposit: formValue.deposit,
    location: formValue.location,
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    phone: formValue.phone,
    deleted: false
  };

  this.reservationService.createReservation(reservationRequest).subscribe({
    next: () => {
      this.router.navigate(['/reservations']);
      this.showSuccess('Reserva creada correctamente');
    },
    error: (error) => {
      this.showError('Error al crear la reserva: ' + error.message);
    }
  });
}

updateReservation(formValue: any): void {
  if (!this.currentReservationId) return;

  const updatedReservationRequest = {
    reservationDate: formValue.reservationDate,
    deposit: formValue.deposit,
    location: formValue.location,
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    phone: formValue.phone,
    deleted: false,
  };

  this.reservationService.updateReservation(this.currentReservationId, updatedReservationRequest).subscribe({
    next: () => {
      this.router.navigate(['/reservations']);
      this.showSuccess('Reserva actualizada correctamente');
    },
    error: (error) => {
      this.showError('Error al actualizar la reserva: ' + error.message);
    }
  });
}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  onCancel(): void {
    this.router.navigate(['/reservations']);
  }

  goToHome(): void {
    this.router.navigate(['']);
  }
}

