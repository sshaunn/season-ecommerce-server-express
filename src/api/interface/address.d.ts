export interface AddressAU {
  id?: number | string;
  mobile?: number | string;
  name?: number | string;
  postcode: string;
  state: string;
  suburb: string;
  street: string;
  contact_name?: string;
  contact_number?: number | string;
  user_id?: string | number;
}
