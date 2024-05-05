export interface RegisterUserRequest {
  user: RestUser,
  serverPasscode: string
}

export interface AuthenticatedUserReponse {
  user: RestUser,
  token: string
}

export interface RestUser {
  loginId: string,
  password: string,
  email: string,
  alias?: string,
  name: string,
  phone: string,
  roles: string[]
}

