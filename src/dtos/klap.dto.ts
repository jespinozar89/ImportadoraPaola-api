export interface User {
  email: string;
  rut: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_line: string;
  address_city: string;
  address_state: string;
  country: string;
  postal_code: string;
}

export interface Item {
  name: string;
  code: string;
  price: number;
  unit_price: number;
  quantity: number;
}