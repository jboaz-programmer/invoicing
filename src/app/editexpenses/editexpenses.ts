import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { RefreshService } from '../refresh-service';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { LoadingService } from '../loading-service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-editexpenses',
  templateUrl: './editexpenses.html',
  imports: [...SHARED_IMPORTS],

  styleUrl: './editexpenses.css'
})
export class Editexpenses implements OnInit {
  expenseID: any
  token: any
  expenseForm: FormGroup;
  chataccounts$: Observable<any[]>; // Observable for table
  accounts$: Observable<any[]>; // Observable for table

  constructor(private toast: ToastService, private service: AuthService, private refreshService: RefreshService, private router: Router, private loadingService: LoadingService,
    private fb: FormBuilder,
  ) {
    this.chataccounts$ = this.refreshService.getObservable('expensesaccounts');
    this.accounts$ = this.refreshService.getObservable('cashbank');
    this.expenseForm = this.fb.group({
      descriptions: [''],
      paidfrom: [''],
      vrn: [''],
      receipt_no: [''],
      v_code: [''],
      supplier: [''],
      created_at: [''],
      exch_rate: [''],

      items: this.fb.array([]) // dynamic items
    });
  }
  get items(): FormArray {
    return this.expenseForm.get('items') as FormArray;
  }
  ngOnInit(): void {
    this.expenseID = history.state.expenseID;
    this.token = localStorage.getItem('auth_token');
    this.loadProfitAccounts();
    this.loadAccounts();

    if (this.token) {
      this.loadingService.show();
      this.service.getExpenseById(this.expenseID, this.token).subscribe({
        next: (res: any) => {
          console.log(res); // you see the data here
          this.populateForm(res); // <-- PATCH THE FORM HERE
          this.loadingService.hide();
        },
        error: (err) => {
          console.error(err);
          this.loadingService.hide();
        }
      });
    }
  }

  addItem() {
    this.items.push(this.fb.group({
      profit_account_id: [''],
      item: [''],
      Qty: [''],
      unit_amount: [''],
      prevAmount: ['']

    }));
  }
  removeItem(index: number) {
    this.items.removeAt(index);
  }
  populateForm(data: any) {
    this.expenseForm.patchValue({
      descriptions: data.expense.descriptions,
      paidfrom: data.expense.paidfrom,
      supplier: data.expense.payee,   // map payee -> supplier
      vrn: data.expense.vrn,
      v_code: data.expense.v_code,
      receipt_no: data.expense.receipt_no,
      unit_amount: data.expense.unit_amount,
      exch_rate: data.expense.exch_rate,
      // created_at: data.expense.created_at
      created_at: this.formatDateForInput(data.expense.created_at) // <-- convert here

    });

    // Clear previous items
    this.items.clear();

    data.expenseDetails.forEach((item: any) => {
      this.items.push(this.fb.group({
        profit_account_id: [item.profit_account_id],
        item: [item.item],
        Qty: [item.Qty],
        unit_amount: [item.unit_amount],
        total_amount: [item.total_amount],
        vat: [''],
        prevAmount:[item.unit_amount],
        id: [item.id]
      }));
    });
  }
  loadProfitAccounts() {
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.service.getExpnsesAccounts(this.token).subscribe({
        next: (res: any) => {
          console.log("Chart of Accounts:", res.accounts);
          // refreshService updates chataccounts$ internally
        },
        error: (err) => console.error("Error loading accounts:", err)
      });
    }
  }
  loadAccounts() {
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.service.getcashbank(this.token).subscribe({
        next: (res: any) => {
          // refreshService automatically populated inside service
        },
        error: (err) => console.error(err)
      });
    }
  }
  updateExpense() {
    console.log(this.expenseForm.value)
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.service.UpdateExpenses(this.expenseID, this.expenseForm.value, token).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toast.success('Expense updated successfully');
        // this.router.navigate(['/expensespage']);
      },
      error: (err) => console.error(err)
    });
  }
  // Helper function
formatDateForInput(dateStr: string) {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  return `${yyyy}-${mm}-${dd}`;
}
}
