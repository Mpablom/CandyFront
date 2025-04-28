import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry } from "rxjs";
import { Customer, CustomerRequestDto, CustomerResponseDto } from "../models/customer.model";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHttpOptions(): {
    timeout: number;
    responseType: 'json';
  } {
    return {
      timeout: 60000,
      responseType: 'json'
    };
  }

  getCustomers(): Observable<Customer[]> {
     return this.http.get<Customer[]>(
      `${this.apiUrl}/customers`,
      this.getHttpOptions()
    ).pipe(retry({ count: 3, delay: 2000 }));
  }
  createCustomer(customer: CustomerRequestDto): Observable<Customer> {
    return this.http.post<Customer>(
      `${this.apiUrl}/customers`,
      customer,
      this.getHttpOptions()
    ).pipe(retry({ count: 2, delay: 1000 }));
  }
  updateCustomer(id: number, customer: CustomerRequestDto): Observable<CustomerResponseDto> {
    return this.http.put<CustomerResponseDto>(
      `${this.apiUrl}/customers/${id}`,
      customer,
      this.getHttpOptions()
    ).pipe(retry({ count: 3, delay: 2000 }));
  }
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/customers/${id}`,
      this.getHttpOptions()
    ).pipe(retry({ count: 1, delay: 500 }));
  }
}
