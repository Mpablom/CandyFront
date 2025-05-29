import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { count, delay, Observable, retry } from 'rxjs';
import {
  Reservation,
  ReservationRequestDto,
  ReservationResponseDto,
} from '../models/reservation.model';
import { CustomerRequestDto } from '../models/customer.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHttpOptions(): {
    timeout: number;
    responseType: 'json';
  } {
    return {
      timeout: 60000,
      responseType: 'json',
    };
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http
      .get<Reservation[]>(`${this.apiUrl}/reservations`, this.getHttpOptions())
      .pipe(retry({ count: 3, delay: 2000 }));
  }

  createReservation(
    reservation: ReservationRequestDto,
  ): Observable<ReservationResponseDto> {
    const payload = {
      reservationDate: reservation.reservationDate,
      deposit: reservation.deposit,
      deleted: reservation.deleted,
      location: reservation.location,
      description: reservation.description,
      starTime: reservation.startTime,
      firstName: reservation.firstName,
      lastName: reservation.lastName,
      phone: reservation.phone,
    };

    return this.http
      .post<ReservationResponseDto>(
        `${this.apiUrl}/reservations`,
        payload,
        this.getHttpOptions(),
      )
      .pipe(retry({ count: 2, delay: 1000 }));
  }

  updateReservation(
    id: number,
    reservation: ReservationRequestDto,
  ): Observable<Reservation> {
    return this.http
      .put<Reservation>(
        `${this.apiUrl}/reservations/${id}`,
        reservation,
        this.getHttpOptions(),
      )
      .pipe(retry({ count: 3, delay: 2000 }));
  }

  deleteReservation(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/reservations/${id}`, this.getHttpOptions())
      .pipe(retry({ count: 1, delay: 500 }));
  }

  recoverReservation(id: number): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/reservations/recover/${id}`,
        {},
        this.getHttpOptions(),
      )
      .pipe(retry({ count: 2, delay: 1000 }));
  }

  deletePastReservationsAndCustomers(): Observable<{ message: string }> {
    return this.http
      .delete<{
        message: string;
      }>(`${this.apiUrl}/reservations/past/all`, this.getHttpOptions())
      .pipe(retry({ count: 1, delay: 1000 }));
  }
  getReservationById(id: number): Observable<ReservationResponseDto> {
    return this.http
      .get<ReservationResponseDto>(
        `${this.apiUrl}/reservations/${id}`,
        this.getHttpOptions(),
      )
      .pipe(retry({ count: 3, delay: 2000 }));
  }
  updateReservationWithCustomer(
    id: number,
    reservation: ReservationRequestDto,
    customer: CustomerRequestDto,
  ): Observable<Reservation> {
    const payload = { ...reservation, customer };
    return this.http
      .put<Reservation>(
        `${this.apiUrl}/reservations/${id}/with-customer`,
        payload,
        this.getHttpOptions(),
      )
      .pipe(retry({ count: 3, delay: 2000 }));
  }
}
