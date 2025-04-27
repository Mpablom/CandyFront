import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Reservation, ReservationRequestDto, ReservationResponseDto } from "../models/reservation.model";
import { CustomerRequestDto } from "../models/customer.model";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  createReservation(reservation: ReservationRequestDto): Observable<ReservationResponseDto> {
    const payload = {
      reservationDate: reservation.reservationDate,
      deposit: reservation.deposit,
      deleted: reservation.deleted,
      location: reservation.location,
      firstName: reservation.firstName,
      lastName: reservation.lastName,
      phone: reservation.phone
    };

    return this.http.post<ReservationResponseDto>(`${this.apiUrl}/reservations`, payload);
  }

  updateReservation(id: number, reservation: ReservationRequestDto): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${id}`);
  }

  recoverReservation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservations/recover/${id}`, {});
  }

  deletePastReservationsAndCustomers(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reservations/past/all`);
  }
  getReservationById(id: number): Observable<ReservationResponseDto> {
    return this.http.get<ReservationResponseDto>(`${this.apiUrl}/reservations/${id}`);
  }
  updateReservationWithCustomer(id: number, reservation: ReservationRequestDto, customer: CustomerRequestDto): Observable<Reservation> {
    const payload = { ...reservation, customer };
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/${id}/with-customer`, payload);
  }
}
