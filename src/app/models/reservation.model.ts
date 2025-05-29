import { Customer, CustomerResponseDto } from './customer.model';

export interface Reservation {
  id: number;
  reservationDate: string;
  deposit: number;
  location?: string;
  description: string;
  startTime: string;
  customerId: number;
  customer: Customer;
  deleted?: boolean;
  expanded?: boolean;
}

export interface ReservationRequestDto {
  reservationDate: string;
  deposit: number;
  location?: string;
  description: string;
  startTime: string;
  firstName: string;
  lastName: string;
  phone: string;
  deleted?: boolean;
}
export interface ReservationResponseDto {
  id: number;
  reservationDate: Date;
  deposit: number;
  deleted: boolean;
  location?: string;
  description: string;
  startTime: string;
  customer: CustomerResponseDto;
}
