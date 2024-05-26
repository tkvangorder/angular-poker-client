import { Component, Input } from '@angular/core';
import { ModalComponent, ModalOptions } from "../../shared/components/modal/modal.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../shared/components/modal/modal.service';
import { UserService } from '../../../user/user-service';

@Component({
    selector: 'app-register-user',
    standalone: true,
    templateUrl: './register-user-dialog.component.html',
    styleUrl: './register-user-dialog.component.css',
    imports: [ModalComponent, CommonModule, ReactiveFormsModule]
})
export class RegisterUserFormComponent {
  
  modalOptions: ModalOptions = {
    id: 'register-user',
    title: 'Register User',
    buttons: [
      { label: 'Register User', type: 'submit'},
      { label: 'Cancel', type: 'cancel' }
    ]
  };
  registerForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    passcode: new FormControl(''),
  });

  constructor(private modalService: ModalService, private userService: UserService) {
  }

  registerUser() {
    this.userService.registerUser(
      {        
        loginId: this.registerForm.value.username ?? undefined,
        password: this.registerForm.value.password ?? undefined,
        email: this.registerForm.value.email ?? undefined,
        name: this.registerForm.value.name ?? undefined,
        alias: this.registerForm.value.name ?? undefined,
        phone: this.registerForm.value.phone ?? undefined,
        serverPasscode: this.registerForm.value.passcode ?? undefined,
      }
    );
    console.log("User is now : " + this.userService.getCurrentUser());
    this.modalService.close(this);
  }

}