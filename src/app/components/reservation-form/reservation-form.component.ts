import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { Reservation } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {
  reservationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    this.reservationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      reservationDate: ['', Validators.required],
      deposit: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      return;
    }

    const formValue = this.reservationForm.value;

    const reservationDate = new Date(formValue.reservationDate);
    const currentDate = new Date();

    if (reservationDate < currentDate) {
      this.snackBar.open('La fecha de reserva no puede ser menor que la fecha actual.', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const customer: Customer = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
    };

    this.customerService.createCustomer(customer).subscribe({
      next: (createdCustomer: Customer) => {
        const reservation: Reservation = {
          reservationDate: formValue.reservationDate,
          deposit: formValue.deposit,
          customerId: createdCustomer.id!
        };

        this.reservationService.createReservation(reservation).subscribe({
          next: (response: any) => {
            console.log('Reservation created successfully:', response);
            this.router.navigate(['/reservations']);
          },
          error: (error: any) => {
            console.error('Error creating reservation:', error);
            this.snackBar.open('Error al crear la reserva: ' + error.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      },
      error: (error: any) => {
        console.error('Error creating customer:', error);
        this.snackBar.open('Error al crear el cliente: ' + error.message, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['']);
  }
}
