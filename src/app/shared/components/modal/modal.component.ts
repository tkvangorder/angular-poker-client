import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalService } from './modal.service';


export class ModalButton {
    label: string = 'Button';
    type!: 'submit' | 'cancel' | 'other';
}

export class ModalOptions {
    title: string = 'Modal Title';
    buttons: ModalButton[] = [];
}

@Component({
    selector: 'app-modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit, OnDestroy {

    @Input()
    id? : string;

    @Input()
    public options: ModalOptions = new ModalOptions();

    // @Output()
    // public onSubmitModal: EventEmitter<any> = new EventEmitter<any>();

    private element: any;

    constructor(private modalService: ModalService, private elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
    }

    ngOnInit() {
        // add self (this modal instance) to the modal service so it can be opened from any component
        this.modalService.add(this);
        console.log("init modal");
    }

    ngOnDestroy() {
        // remove self from modal service
        console.log("destroy modal");
        this.modalService.remove(this);
    }

    public submit(event$: any) {
        console.log('yo yo yo');
        //this.onSubmitModal.emit(event$);
    }

    public openDialog() {
        console.log(this.element);
        this.element.style.display = 'block';
    }


    public closeDialog() {
        this.element.style.display = 'none';
    }

}
