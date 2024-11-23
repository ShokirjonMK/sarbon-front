export interface IAuth {
  access_token: string,
  expire_time: string,
  first_name: string,
  last_name: string,
  oferta: number
  is_changed: number
  permissions: string[],
  role: string[],
  active_role: string,
  user_id: number,
  username: string,
  avatar? :string,
  profile?: any
}