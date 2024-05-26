import { Component, Input } from '@angular/core';
import { ModalComponent, ModalOptions } from "../../shared/components/modal/modal.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  registerUser() {
    console.log('Lets get that user registered');
  }

}
