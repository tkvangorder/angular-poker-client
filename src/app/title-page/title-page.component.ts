import { Component } from '@angular/core';
import { LoginFormComponent } from "./login-form/login-form.component";
import { RegisterUserFormComponent } from "./register-user-form/register-user-form.component";
import { ModalComponent } from "../shared/components/modal/modal.component";

@Component({
    selector: 'app-title-page',
    standalone: true,
    templateUrl: './title-page.component.html',
    styleUrl: './title-page.component.css',
    imports: [LoginFormComponent, RegisterUserFormComponent, ModalComponent]
})
export class TitlePageComponent {
  showLogin = false;
  showRegisterUser = false;

  userLogin(event: any) {
    console.log(event);
//    this.setShowLogin(false);
  }

  registerUser(event: any) {
    console.log(event);
  //  this.setShowRegisterUser(false);
  }

  setShowLogin(showLogin: boolean) {  
    this.showLogin = showLogin;
  }
  setShowRegisterUser(showRegisterUser: boolean) {
    this.showRegisterUser = showRegisterUser;
  }
}
