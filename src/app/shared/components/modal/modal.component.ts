import { Component, EventEmitter, Input, Output } from '@angular/core';


export class ModalOptions {
    title: string = 'Modal Title';
    onSubmitHandler: (event: any) => void = (event) => {};
}
@Component({
    selector: 'app-modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css',
})
export class ModalComponent {

    @Input()
    public options!: ModalOptions;

}
