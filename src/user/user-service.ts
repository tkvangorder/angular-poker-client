import { Injectable } from '@angular/core';
import { RegisterUserRequest, User } from "./user-models";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PokerRestClient } from '../rest/poker-rest-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private pokerClient : PokerRestClient) { }

  private currentUser: User | null = null;

  login(loginId: string, password: string) : Observable<User> {
    return this.pokerClient.login(loginId, password).pipe(
      map((response) => {
        const newUser = {...response.user, token: response.token};
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUser = newUser;
        return newUser;
      })
    );
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  registerUser(registeredUser: RegisterUserRequest) : Observable<User> {
    return this.pokerClient.registerUser(registeredUser).pipe(
      map((response) => {
        const newUser = {...response.user, token: response.token};
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUser = newUser;
        return newUser;
      })
    );
  }

  isLoggedIn() : boolean {
    return this.getCurrentUser() !== null;
  }
  
  getCurrentUser() : User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

}