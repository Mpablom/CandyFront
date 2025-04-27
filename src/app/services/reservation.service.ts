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

  getAllReservations(): Observable<ReservationResponseDto[]> {
    return this.http.get<ReservationResponseDto[]>(`${this.apiUrl}/reservations`);
  }

  createReservation(reservation: ReservationRequestDto): Observable<ReservationResponseDto> {
    return this.http.post<ReservationResponseDto>(`${this.apiUrl}/reservations`, reservation);
  }

  updateReservation(id: number, reservation: ReservationRequestDto): Observable<ReservationResponseDto> {
    return this.http.put<ReservationResponseDto>(`${this.apiUrl}/reservations/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${id}`);
  }

  recoverReservation(id: number): Observable<ReservationResponseDto> {
    return this.http.put<ReservationResponseDto>(`${this.apiUrl}/reservations/recover/${id}`, {});
  }

  deletePastReservationsAndCustomers(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reservations/past/all`);
  }

  getReservationById(id: number): Observable<ReservationResponseDto> {
    return this.http.get<ReservationResponseDto>(`${this.apiUrl}/reservations/${id}`);
  }

  getReservationsByDate(date: string): Observable<ReservationResponseDto[]> {
    return this.http.get<ReservationResponseDto[]>(`${this.apiUrl}/reservations/date/${date}`);
  }

  updateReservationWithCustomer(id: number, reservation: ReservationRequestDto, customer: CustomerRequestDto): Observable<ReservationResponseDto> {
    const payload = {
      ...reservation,
      customer: customer
    };
    return this.http.put<ReservationResponseDto>(
      `${this.apiUrl}/reservations/${id}/with-customer`,
      payload
    );
  }

  deletePastReservations(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/past`);
  }

  deleteCustomersWithPastReservations(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/past/customers`);
  }
}
