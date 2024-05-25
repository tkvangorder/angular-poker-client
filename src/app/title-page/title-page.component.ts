import { Component } from '@angular/core';
import { ModalComponent } from "../shared/components/modal/modal.component";
import { UserService } from '../../user/user-service';
import { LoginFormComponent } from "./login-form/login-form.component";
import { RegisterUserFormComponent } from "./register-user-form/register-user-form.component";

@Component({
    selector: 'app-title-page',
    standalone: true,
    templateUrl: './title-page.component.html',
    styleUrl: './title-page.component.css',
    imports: [ModalComponent, LoginFormComponent, RegisterUserFormComponent]
})
export class TitlePageComponent {

  constructor(private userService: UserService) {    
  }

  showLogin = false;
  showRegisterUser = false;

  setShowLogin(showLogin: boolean) {  
    this.showLogin = showLogin;
  }

  setShowRegisterUser(showRegisterUser: boolean) {
    this.showRegisterUser = showRegisterUser;
  }
  onCloseLogin(): void {
    console.log("onCloseLogin");
    //this.setShowLogin(false);
  }
  onCloseRegisterUser(): void {
    console.log("onCloseRegisterUser");
//    this.setShowLogin(false);
  }

}
