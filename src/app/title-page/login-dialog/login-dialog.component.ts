import { Component, Input } from '@angular/core';
import { Modal, ModalComponent, ModalOptions } from "../../shared/components/modal/modal.component";
import { ModalService } from '../../shared/components/modal/modal.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../user/user-service';
import { Router } from '@angular/router';
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
    password: new FormControl('')
  });

  modalOptions: ModalOptions = {
    id: 'login',
    title: 'Login',
    buttons: [
      { label: 'Login', type: 'submit'},
      { label: 'Cancel', type: 'cancel' }
    ]
  };

  constructor(private modalService: ModalService, private router: Router, private userService: UserService) {
  }

  userLogin() {
    this.userService.login(
        this.loginForm.value.username ?? '',
        this.loginForm.value.password ?? ''
    ).subscribe(user => {
      console.log("User is now : " + JSON.stringify(this.userService.getCurrentUser()));      
      this.modalService.close(this);
      this.router.navigate(['/home']);
    });
  }

}
