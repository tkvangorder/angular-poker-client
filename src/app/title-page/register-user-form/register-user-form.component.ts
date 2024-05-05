import { Component } from '@angular/core';

@Component({
  selector: 'app-register-user-form',
  standalone: true,
  imports: [],
  templateUrl: './register-user-form.component.html',
  styleUrl: './register-user-form.component.css'
})
export class RegisterUserFormComponent {
  onSubmit(event: any) {
    console.log(event);
  }
  onCancel() {
    console.log('cancelled');
  }
}
