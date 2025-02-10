export interface CustomerRequestDto {
  firstName: string;
  lastName: string;
  phone: string;
}
export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
}
export interface CustomerResponseDto extends Customer {}
