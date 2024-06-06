import { Component } from '@angular/core';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { UserService } from '../../user/user-service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { RegisterUserFormComponent } from './register-user-dialog/register-user-dialog.component';
import { ModalService } from '../shared/components/modal/modal.service';

@Component({
  selector: 'app-title-page',
  standalone: true,
  templateUrl: './title-page.component.html',
  styleUrl: './title-page.component.css',
  imports: [ModalComponent, LoginDialogComponent, RegisterUserFormComponent],
})
export class TitlePageComponent {
  constructor(
    private userService: UserService,
    private modalService: ModalService
  ) {}

  openLoginModal() {
    this.modalService.openDialog(LoginDialogComponent);
    //this.modalService.open('login');
  }
  openRegisterUserModal() {
    this.modalService.openDialog(RegisterUserFormComponent);
  }
}
