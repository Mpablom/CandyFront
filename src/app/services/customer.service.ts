import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Customer, CustomerRequestDto, CustomerResponseDto } from "../models/customer.model";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }
  createCustomer(customer: CustomerRequestDto): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customer);
  }
  updateCustomer(id: number, customer: CustomerRequestDto): Observable<CustomerResponseDto> {
    return this.http.put<CustomerResponseDto>(`${this.apiUrl}/${id}`, customer);
  }
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
