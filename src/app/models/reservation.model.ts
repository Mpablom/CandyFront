export interface Reservation {
  id?: number;
  reservationDate: string;
  deposit: number;
  customerId: number;
  deleted?: boolean;
}
