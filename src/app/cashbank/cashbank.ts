import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service';
import { RefreshService } from '../refresh-service';
import iziToast from 'izitoast';
import { ToastService } from '../toast-service';
import Swal from 'sweetalert2';
import { LoadingService } from '../loading-service';
declare var $: any;

@Component({
  selector: 'app-cashbank',
  imports: [...SHARED_IMPORTS],
  templateUrl: './cashbank.html',
  styleUrl: './cashbank.css'
})
export class Cashbank implements OnInit {
  response$!: Observable<any>;
  //  selectedAccount: any = null;  // will hold the clicked row's data
  selectedAccount: any = {
    id: null,
    name: '',
    currency: '',
    amount: 0
  };

  token: any
  accounts$: Observable<any[]>; // Observable for table

  constructor(private service: AuthService, private toast: ToastService, private refreshService: RefreshService, private loadingService: LoadingService 
  ) {
    this.accounts$ = this.refreshService.getObservable('cashbank');
  } 
  
  ngOnInit(): void {
        this.loadingService.show();

    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.service.getcashbank(this.token).subscribe({
        next: (res: any) => {
              this.loadingService.hide();

          // refreshService automatically populated inside service
          setTimeout(() => this.initDataTable(), 0); // Initialize DataTable after DOM update
        },
        error: (err) => console.error(err)
      });
    }
  }

  initDataTable() {
    if ($.fn.DataTable.isDataTable('#table-1')) {
      $('#table-1').DataTable().clear().destroy();
    }
    $('#table-1').DataTable();
  }

  postData = {
    name: "",
    amount: "",
    currency: "",
    bank: ""
  }


  Save() {
    this.loadingService.show();

    if (!this.token) return;

    this.service.saveCashBank(this.postData, this.token).subscribe({
      next: (res) => {
        this.toast.success('Account created successfully ✅');
        // reset form
        this.postData = { name: '', amount: '', bank: '', currency: '' };
            this.loadingService.hide();

      },
      error: (err) => {
        console.error('Save error:', err);
        this.toast.error('Failed to create account ❌');
      }
    });
  }

  update() {
        this.loadingService.show();

     this.service.updateAccount(this.selectedAccount, this.token).subscribe({
      next: (res: any) => this.toast.success(res.message),
      
      error: (err) => console.error('❌ Update failed:', err)
    });
    this.loadingService.hide();
  }

  openEditModal(account: any) {
    this.selectedAccount = { ...account }; // make a copy so changes don't affect the table until saved
  }

  deleteAccount(id: number) {
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
        // ✅ Only delete when user confirms
        this.service.deleteAccount(id).subscribe({
          next: (res) => {
            this.toast.success(res.message);

            // 🔄 Refresh accounts list after deletion
            if (this.token) {
              this.service.getcashbank(this.token).subscribe();
            }
          },
          error: (err) => {
            console.error(err);
            this.toast.error('Failed to delete account');
          }
        });
      }
    });
  }


}
