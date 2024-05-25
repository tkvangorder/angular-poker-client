import { Component, Input } from '@angular/core';
import { ModalComponent } from "../../shared/components/modal/modal.component";

@Component({
    selector: 'app-login-form',
    standalone: true,
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.css',
    imports: [ModalComponent]
})
export class LoginFormComponent {

  @Input()
  onCloseHandler: () => void = () => {};

  @Input()
  onSubmitHandler: (event: any) => void = (event) => {};


}
