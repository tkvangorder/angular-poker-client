import { Component, Input } from '@angular/core';
import { ModalComponent } from "../../shared/components/modal/modal.component";

@Component({
    selector: 'app-register-user',
    standalone: true,
    templateUrl: './register-user-form.component.html',
    styleUrl: './register-user-form.component.css',
    imports: [ModalComponent]
})
export class RegisterUserFormComponent {

  @Input()
  onCloseHandler: () => void = () => {};

  @Input()
  onSubmitHandler: (event: any) => void = (event) => {};

}
