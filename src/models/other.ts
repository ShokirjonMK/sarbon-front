

export interface ISimple {
  id: number,
  name: string,
  description?: string,
  status: number,
}


export interface ICountry {
  id: number;
  name: string;
  ISO: string;
  ISO3: string;
  num_code: number;
  phone_code: number;
}

export interface IRegion {
  id: number;
  name: string;
  country_id: number;
  lat: null | number;
  long: null | number;
  name_kirill: string | null;
  parent_id: null | number;
  postcode: null | number;
  slug: null | number;
  status: number;
  type: number;
}

export interface IArea {
  id: number;
  lat: null | number;
  long: null | number;
  name: string;
  postcode: null | number;
  region_id: number;
  sort: number;
  status: number;
  type: number;
}