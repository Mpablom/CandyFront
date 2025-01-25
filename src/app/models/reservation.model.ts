import { Customer } from "./customer.model";

export interface Reservation {
  id?: number;
  reservationDate: string;
  deposit: number;
  customnerId: Customer;
  deleted?: boolean;
}
