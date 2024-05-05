import { Injectable } from '@angular/core';
import { pokerClient } from "../rest/poker-rest-client";
import { User } from "./user-models";

@Injectable({
  providedIn: 'root'
})
class UserService {

  private currentUser: User | null = null;

  login(loginId: string, password: string) : User | null {
    pokerClient.login(loginId, password)
    .then((response) => {
      this.currentUser = {...response.data.user, token: response.data.token};
      return this.currentUser;
    })
    return null;
  }

  registerUser(registeredUser: {user: User, serverPasscode: string}) : User | null {
    pokerClient.registerUser(registeredUser)
    .then((response) => {
      this.currentUser = {...response.data.user, token: response.data.token};
      return this.currentUser;
    })
    return null;
  }

  getCurrentUser() : User | null {
    return this.currentUser;
  }

}

export const userService = new UserService();

