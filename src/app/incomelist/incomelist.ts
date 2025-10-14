import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from '../toast-service';
import { RefreshService } from '../refresh-service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { LoadingService } from '../loading-service';
import Swal from 'sweetalert2';
import { SHARED_IMPORTS } from '../shared/shared-imports';
 declare var $: any;

@Component({
  selector: 'app-incomelist',
  imports: [...SHARED_IMPORTS],
  templateUrl: './incomelist.html',
  styleUrl: './incomelist.css'
})
export class Incomelist {
expenses$: Observable<any[]>;
  // expenses$: Observable<{ data: any[] }>;

  token: string | null = null;

  constructor(
    private service: AuthService,
    private refreshService: RefreshService, private toast: ToastService, private loadingService: LoadingService,
    private router: Router
  ) {
    this.expenses$ = this.refreshService.getObservable('expenses');

  }
  ngOnInit(): void {
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
          this.loadingService.show();
          let params = {status: "receipt"}
      this.service.getIncomeAndExpenses(params, this.token).subscribe({
        next: (res: any) => {
          this.loadingService.hide()
          // refreshService automatically populated inside service
          setTimeout(() => this.initDataTable(), 0); // Initialize DataTable after DOM update
        },
        error: (err) => console.error(err)
      });
    }
  }
  // initDataTable() {
  //   if ($.fn.DataTable.isDataTable('#tableExport')) {
  //     $('#tableExport').DataTable().clear().destroy();
  //   }
  //   $('#tableExport').DataTable();
  // }

  initDataTable() {
    if ($.fn.DataTable.isDataTable('#tableExport')) {
      $('#tableExport').DataTable().clear().destroy();
    }

    $('#tableExport').DataTable({
      dom: 'Bfrtip',  // ← Hii ni muhimu ili buttons zionekane
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      responsive: true
    });
  }
  EditFunc(data: any) {
     let navigationExtras : NavigationExtras = {
      state : {
        expenseID : data
      }
    }
    this.router.navigate(['/editincomepage'], navigationExtras);

   }
  deleteFunc(any: any) { }
  createExpenses() {
    console.log("clicked")
    this.router.navigate(['/createincome']);
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
            this.loadingService.show();

        // ✅ Only delete when user confirms
        this.service.deleteExpense(this.token,id).subscribe({
          next: (res) => {
                this.loadingService.hide();
            this.toast.success(res.message);

            // 🔄 Refresh accounts list after deletion
            if (this.token) {
              let params = {status:"receipt"}
              this.service.getIncomeAndExpenses(params, this.token).subscribe();
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

