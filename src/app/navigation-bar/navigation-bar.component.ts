import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../user/user-service';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ToastDisplayComponent } from '../toaster/toast-display.component';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  templateUrl: './navigation-bar.component.html',
  imports: [AsyncPipe, ToastDisplayComponent],
})
export class NavigationBarComponent {
  @ViewChild('profileDropDown')
  profileDropDown!: ElementRef;

  constructor(public userService: UserService) {}

  userGreetings(): Observable<string> {
    return this.userService.observeCurrentUser().pipe(
      map((user) => {
        if (user) {
          return `Hello ${user.name}`;
        } else {
          return '';
        }
      })
    );
  }

  logout() {
    this.profileDropDown.nativeElement.open = false;
    this.userService.logout();
  }
}
