export interface Reservation {
  id?: number;
  reservationDate: string;
  deposit: number;
  location:string;
  customerId: number;
  deleted?: boolean;
}
