import { ErrorHandler, inject } from '@angular/core';
import { ToasterService } from '../toaster/toaster.service';

export class GlobalErrorHandler implements ErrorHandler {
  private toastService = inject(ToasterService);

  handleError(error: any): void {
    this.toastService.displayToast({
      message: error,
      type: 'error',
    });

    console.log(error);
  }
}
