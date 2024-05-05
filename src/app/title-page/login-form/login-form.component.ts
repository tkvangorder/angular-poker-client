import { Component } from '@angular/core';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  onSubmit(event: any) {
    console.log(event);
  }
  onCancel() {
    console.log('cancelled');
  }
}
