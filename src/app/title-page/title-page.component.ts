import { Component } from '@angular/core';
import { ModalComponent } from "../shared/components/modal/modal.component";
import { UserService } from '../../user/user-service';
import { LoginFormComponent } from "./login-form/login-form.component";
import { RegisterUserFormComponent } from "./register-user-form/register-user-form.component";
import { ModalService } from '../shared/components/modal/modal.service';

@Component({
    selector: 'app-title-page',
    standalone: true,
    templateUrl: './title-page.component.html',
    styleUrl: './title-page.component.css',
    imports: [ModalComponent, LoginFormComponent, RegisterUserFormComponent]
})
export class TitlePageComponent {

  constructor(private userService: UserService, private modalService: ModalService) {
  }

  openLoginModal() {
    this.modalService.open('login');
  }
  openRegisterUserModal() {
    this.modalService.open('register-user');
  }


}
