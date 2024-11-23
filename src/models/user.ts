import { IBasic } from "./base";

export default interface IUsers {
  id: number
  avatar: string
  email: string | null
  first_name: string
  last_name: string
  middle_name?: string,
  role: Array<string>
  status: number
  username: string
  profile?: IProfile
}


export interface IUserField {
  id: number
  avatar: string
  email: string | null
  first_name: string
  last_name: string
  middle_name?: string,
  role: Array<string>
  status: number
  username: string
  profile?: IProfile
}


export interface IProfile extends IBasic {
  academic_degree_id: number
  address: string | null
  area_id: number
  birthday: string
  citizenship_id: null | number
  country_id: number | null
  degree_id: number | null
  degree_info_id: null | number
  description: string | null
  diploma_type_id: number | null
  first_name: string
  gender: number
  image: string
  is_deleted: number
  is_foreign: null | number
  last_name: string
  middle_name: string | null
  nationality_id: number | null
  order: number
  partiya_id: number | null
  passport_file: string | null
  passport_given_by: string
  passport_given_date: string
  passport_issued_date: string
  passport_number: string
  passport_pin: string
  passport_seria: string
  passport_serial: string
  permanent_address: string | null
  permanent_area_id: number | null
  permanent_country_id: number | null
  permanent_countries_id: number | null
  permanent_region_id: number | null
  phone: string
  phone_secondary: string | null
  region_id: number | null
  countries_id: number | null
  status: number
  telegram_chat_id: number | null
  user_id: number
}