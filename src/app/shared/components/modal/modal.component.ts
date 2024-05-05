import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginFormComponent } from "../../../title-page/login-form/login-form.component";

@Component({
    selector: 'app-modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css',
    imports: [LoginFormComponent]
})
export class ModalComponent {

    @Input()
    title: string = 'Modal Title';

    @Output()
    modalSubmitted: EventEmitter<any> = new EventEmitter();
    
    onSubmit(event: any) {
        this.modalSubmitted.emit(event);
    }
}
