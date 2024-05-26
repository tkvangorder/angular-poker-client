import { Component, Input } from '@angular/core';
import { ModalComponent, ModalOptions } from "../../shared/components/modal/modal.component";
import { ModalService } from '../../shared/components/modal/modal.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
    selector: 'app-login-form',
    standalone: true,
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.css',
    imports: [ModalComponent, CommonModule, ReactiveFormsModule]
})
export class LoginFormComponent {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  modalOptions: ModalOptions = {
    title: 'Login',
    buttons: [
      { label: 'Login', type: 'submit'},
      { label: 'Cancel', type: 'cancel' }
    ]
  };

  constructor(private modalService: ModalService) {
  }

  userLogin() {
    console.log('Lets get that user logged in');
  }

}
