import { AuthenticatedUserReponse } from './rest-client-models';
import { RegisterUserRequest } from '../user/user-models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CashGameConfiguration, CashGameDetails } from '../game/game-models';

@Injectable({
  providedIn: 'root',
})
export class PokerRestClient {
  baseUrl: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient) {}

  login(loginId: string, password: string) {
    return this.httpClient.post<AuthenticatedUserReponse>(
      `${this.baseUrl}/auth/login`,
      {
        loginId: loginId,
        password: password,
      }
    );
  }

  registerUser(registerUserRequest: RegisterUserRequest) {
    return this.httpClient.post<AuthenticatedUserReponse>(
      `${this.baseUrl}/auth/register`,
      registerUserRequest
    );
  }

  createGame(cashGameConfiguration: CashGameConfiguration) {
    return this.httpClient.post<CashGameDetails>(
      `${this.baseUrl}/cash-games`,
      cashGameConfiguration
    );
  }
}
