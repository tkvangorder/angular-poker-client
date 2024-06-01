import { Injectable } from '@angular/core';
import { RegisterUserRequest, User } from "./user-models";
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PokerRestClient } from '../rest/poker-rest-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private pokerClient : PokerRestClient, private router: Router) { }

  private currentUser$ = new BehaviorSubject<User | null>(null);

  login(loginId: string, password: string) : Observable<User> {
    return this.pokerClient.login(loginId, password).pipe(
      map((response) => {
        const newUser = {...response.user, token: response.token};
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUser$.next(newUser);
        return newUser;
      })
    );
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser$.next(null);
    this.router.navigate(['/']);
  }

  registerUser(registeredUser: RegisterUserRequest) : Observable<User> {
    return this.pokerClient.registerUser(registeredUser).pipe(
      map((response) => {
        const newUser = {...response.user, token: response.token};
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUser$.next(newUser);
        return newUser;
      })
    );
  }

  isLoggedIn() : boolean {
    return this.currentUser$.getValue() !== null;
  }

  getCurrentUser() : User | null {
    let user = this.currentUser$.getValue();
    if (!user) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    }
    return user;
  }

  observeCurrentUser() : Observable<User | null> {
    if (!this.currentUser$.getValue()) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser$.next(JSON.parse(storedUser));
      }
    }

    return this.currentUser$.asObservable();
  }

}