import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../user/user-service';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastDisplayComponent } from '../toaster/toast-display.component';
import { ModalService } from '../modal/modal.service';
import { AboutComponent } from './about/about/about.component';

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    imports: [AsyncPipe, RouterLink, ToastDisplayComponent]
})
export class NavigationBarComponent {
  @ViewChild('profileDropDown')
  profileDropDown!: ElementRef;

  @ViewChild('themeDropDown')
  themeDropDown!: ElementRef;

  constructor(
    public userService: UserService,
    private modalService: ModalService
  ) {}

  userGreetings(): Observable<string> {
    return this.userService.observeCurrentUser().pipe(
      map((user) => {
        if (user) {
          return user.alias || user.name || user.loginId || '';
        } else {
          return '';
        }
      })
    );
  }

  isAdmin$: Observable<boolean> = this.userService.observeCurrentUser().pipe(
    map((user) => user?.roles?.includes('ADMIN') ?? false)
  );

  closeThemeDropdown() {
    this.themeDropDown.nativeElement.open = false;
  }

  openAbout() {
    this.modalService.openDialog(AboutComponent);
  }

  logout() {
    this.profileDropDown.nativeElement.open = false;
    this.userService.logout();
  }
}
