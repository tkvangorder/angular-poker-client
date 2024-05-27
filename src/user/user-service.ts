import { EventEmitter, Injectable, Output } from '@angular/core';
import { pokerClient } from "../rest/poker-rest-client";
import { RegisterUserRequest, User } from "./user-models";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User | null = null;

  async login(loginId: string, password: string) : Promise<User> {
    const newUser = await pokerClient.login(loginId, password)
    .then((response) => {

      return {...response.data.user, token: response.data.token};
    });

    this.currentUser = newUser;
    return newUser;    
  }

  async registerUser(registeredUser: RegisterUserRequest) : Promise<User | null> {
    pokerClient.registerUser(registeredUser)
    .then((response) => {
      this.currentUser = {...response.data.user, token: response.data.token};
    });
    return this.currentUser;
  }

  getCurrentUser() : User | null {
    return this.currentUser;
  }

}