import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Reservation, ReservationRequestDto, ReservationResponseDto } from "../models/reservation.model";
import { CustomerRequestDto } from "../models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/reservations';

  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }
  createReservation(reservation: ReservationRequestDto): Observable<ReservationResponseDto> {
    return this.http.post<ReservationResponseDto>(`${this.apiUrl}`, reservation);
  }
  updateReservation(id: number, reservation: ReservationRequestDto): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  recoverReservation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/recover/${id}`, {});
  }

  deletePastReservationsAndCustomers(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/past/all`);
  }
  getReservationById(id: number): Observable<ReservationResponseDto> {
    return this.http.get<ReservationResponseDto>(`${this.apiUrl}/${id}`);
  }
  updateReservationWithCustomer(id: number, reservation: ReservationRequestDto, customer: CustomerRequestDto): Observable<Reservation> {
    const payload = { ...reservation, customer };
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/with-customer`, payload);
  }
}
