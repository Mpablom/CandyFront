import { Customer, CustomerResponseDto } from "./customer.model";

export interface Reservation {
  id: number;
  reservationDate: string;
  deposit: number;
  location?:string;
  customer: Customer;
  deleted?: boolean;
  expanded?: boolean;
}

export interface ReservationRequestDto {
  reservationDate: Date;
  deposit: number;
  location?: string;
  customerId: number;
}
export interface ReservationResponseDto {
  id: number;
  reservationDate: Date;
  deposit: number;
  deleted: boolean;
  location?: string;
  customer: CustomerResponseDto;
}
