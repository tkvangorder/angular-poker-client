import axios, { AxiosInstance } from "axios";
import { AuthenticatedUserReponse } from "./rest-client-models";
import { RegisterUserRequest } from "../user/user-models";

class PokerRestClient {

  restClient: AxiosInstance;

  constructor(baseUrl: string | null) {
    const url = baseUrl || "http://localhost:8080";
    this.restClient = axios.create({
      baseURL: url,
      headers: {
        "Content-Type": "application/json",
      },
    });  
  }

  login(loginId: string, password: string) {

    return this.restClient.post<AuthenticatedUserReponse>("/auth/login",
      {
          loginId: loginId,
          password: password,
      }
    );
  }

  registerUser(registerUserRequest: RegisterUserRequest) {
    return this.restClient.post<AuthenticatedUserReponse>("/auth/register", registerUserRequest);
  }

}

export const pokerClient = new PokerRestClient(null);

