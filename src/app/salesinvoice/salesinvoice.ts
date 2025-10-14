import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { RefreshService } from '../refresh-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastService } from '../toast-service';
import { LoadingService } from '../loading-service';
declare var $: any;

@Component({
  selector: 'app-salesinvoice',
  imports: [...SHARED_IMPORTS],
  templateUrl: './salesinvoice.html',
  styleUrl: './salesinvoice.css'
})
export class Salesinvoice implements OnInit{
 //  token: any;
  invoices$: Observable<any[]>;
 
  token: string | null = null;
  result: any
  dashBoard: any;
  constructor(
    private service: AuthService,
    private refreshService: RefreshService, private toast: ToastService, private loadingService: LoadingService,
    private router: Router
  ) {
    this.invoices$ = this.refreshService.getObservable('invoices');

  }
 ngOnInit(): void {
  this.token = localStorage.getItem('auth_token');
  if (this.token) {
    this.loadingService.show();
    this.service.getSalesInvoice(this.token).subscribe({
      next: (res: any[]) => {
        this.result = res;
        this.dashBoard = this.result.summary;
        this.loadingService.hide();

        // Push the new data into refreshService
        this.refreshService.update('invoices', this.result.invoices);
      },
      error: (err) => {
        this.loadingService.hide();
        console.error(err);
      }
    });
  }
}
  viewInvoiceFunc(data: any){
     let navigationExtras : NavigationExtras = {
      state:{
        transID : data
      }
    }
      this.router.navigate(['/viewinvoice'],navigationExtras); // assuming data has an id

    // this.router.navigate(['/viewinvoice']);
  }
  createInvoice(){
    this.router.navigate(['/createsalesinvoice']);
  }
 deleteInvoice(id: any){
  console.log(id, 'clicked');
      this.token = localStorage.getItem('auth_token');
 Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
            this.loadingService.show();

        // ✅ Only delete when user confirms
        this.service.deleteExpense(this.token,id).subscribe({
          next: (res) => {
                this.loadingService.hide();
            this.toast.success(res.message);
          },
          error: (err) => {
            console.error(err);
            this.toast.error('Failed to delete account');
          }
        });
      }
    });
 }
  
 openAllInvoice(data:any){
  let navigationExtras : NavigationExtras = {
      state:{
        trans : data
      }
    }
   this.router.navigate(['invoicedetails'], navigationExtras);
 }


}
