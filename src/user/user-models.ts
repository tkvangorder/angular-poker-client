export interface User {
  token: string
  loginId: string,
  password: string,
  email: string,
  alias?: string,
  name: string,
  phone: string,
  roles: string[]
}
