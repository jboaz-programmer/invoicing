import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private iziToast: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      import('izitoast').then(module => {
        this.iziToast = module.default;
      });
    }
  }

  success(message: string) {
    if (this.iziToast) {
      this.iziToast.success({
        title: 'Success',
        message,
        position: 'topRight'
      });
    }
  }

  error(message: string) {
    if (this.iziToast) {
      this.iziToast.error({
        title: 'Error',
        message,
        position: 'topRight'
      });
    }
  }
}
