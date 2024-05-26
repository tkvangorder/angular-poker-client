import { EventEmitter, Injectable, Output } from '@angular/core';
import { pokerClient } from "../rest/poker-rest-client";
import { RegisterUserRequest, User } from "./user-models";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User | null = null;

  login(loginId: string, password: string) : User | null {
    pokerClient.login(loginId, password)
    .then((response) => {
      this.currentUser = {...response.data.user, token: response.data.token};
      return this.currentUser;
    })
    return null;
  }

  async registerUser(registeredUser: RegisterUserRequest) : Promise<User | null> {
    await pokerClient.registerUser(registeredUser)
    .then((response) => {
      this.currentUser = {...response.data.user, token: response.data.token};
    });
    return this.currentUser;
  }

  getCurrentUser() : User | null {
    return this.currentUser;
  }

}