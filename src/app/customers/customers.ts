import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { RefreshService } from '../refresh-service';
import { LoadingService } from '../loading-service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-customers',
  imports: [...SHARED_IMPORTS],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})

export class Customers implements OnInit{
  customers$: Observable<any[]>; // Observable for table
  token: any
  result: any
 constructor(private service: AuthService, private toast: ToastService, private refreshService: RefreshService, private router: Router, private loadingService: LoadingService) {
    this.customers$ = this.refreshService.getObservable('customers');
  }
    postData = {
    name: '',
    vrn: '',
    tin: '',
    address: '',
    bank: '',
    mobile: ''
  }
  ngOnInit(): void {
     this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.service.getCustomers(this.token).subscribe({
        next: (res: any) => {
          this.result = res;
          this.refreshService.update('customers', this.result.customers);

          // refreshService updates chataccounts$ internally
        },
        error: (err) => console.error("Error loading accounts:", err)
      });
    }
  }
    createCustomer() { 
       this.token = localStorage.getItem('auth_token');
    if (this.token) {
    this.service.createCustomer(this.postData,this.token).subscribe(res => {
      this.result = res
      this.loadingService.hide();
      this.toast.success(this.result.success);
       console.log('cust:', res);
    });
  }
    }
deleteCustomer(data:any){}
openEditModal(data:any){}
}
