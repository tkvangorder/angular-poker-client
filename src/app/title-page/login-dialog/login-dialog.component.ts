import { Component, Input } from '@angular/core';
import { Modal, ModalComponent, ModalOptions } from "../../shared/components/modal/modal.component";
import { ModalService } from '../../shared/components/modal/modal.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../user/user-service';
@Component({
    selector: 'app-login-form',
    standalone: true,
    templateUrl: './login-dialog.component.html',
    styleUrl: './login-dialog.component.css',
    imports: [ModalComponent, CommonModule, ReactiveFormsModule]
})
export class LoginDialogComponent implements Modal {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  modalOptions: ModalOptions = {
    id: 'login',
    title: 'Login',
    buttons: [
      { label: 'Login', type: 'submit'},
      { label: 'Cancel', type: 'cancel' }
    ]
  };

  constructor(private modalService: ModalService, private userService: UserService) {
  }

  userLogin() {
    console.log("this.loginForm.value" + this.loginForm.value);
    this.userService.login(
        this.loginForm.value.username ?? '',
        this.loginForm.value.password ?? ''
    );
    console.log("User is now : " + this.userService.getCurrentUser());
    this.modalService.close(this);
  }

}
