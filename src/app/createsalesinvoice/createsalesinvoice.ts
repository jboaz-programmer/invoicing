import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { RefreshService } from '../refresh-service';
import { LoadingService } from '../loading-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createsalesinvoice',
  imports: [...SHARED_IMPORTS],
  templateUrl: './createsalesinvoice.html',
  styleUrl: './createsalesinvoice.css'
})
export class Createsalesinvoice implements OnInit {
  items: any[] = [];
  grandTotal: number = 0;
  invoice: any = {
    customer: '',
    paidFrom: '',
    currency: '',
    exchRate: 1,
    dueDate: '',
    description: '',
    exclusiveTotal: 0,   // sum without VAT
    vatTotal: 0,         // sum of VAT
    inclusiveTotal: 0    // sum with VAT
  };
  postData = {
    name: '',
    vrn: '',
    tin: '',
    address: '',
    bank: '',
    mobile: ''
  }
  token: any
  result: any
  customers$: Observable<any[]>; // Observable for table
  accounts$: Observable<any[]>; // Observable for table

  constructor(private service: AuthService, private toast: ToastService, private refreshService: RefreshService, private router: Router, private loadingService: LoadingService) {
    this.customers$ = this.refreshService.getObservable('customers');
    this.accounts$ = this.refreshService.getObservable('cashbank');

  }
  ngOnInit(): void {
    this.loadAccounts();

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

  addItem() {
    this.items.push({
      name: '',
      qty: 1,
      unit: 0,
      vatType: 'inclusive',
      exclusiveAmount: 0,
      vatAmount: 0,
      inclusiveAmount: 0,
      total: 0
    });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.calculateGrandTotal();
  }

  calculateTotal(index: number) {
    const item = this.items[index];
    const qty = item.qty || 0;
    const unit = item.unit || 0;
    const vatRate = 0.18; // 18% VAT

    if (item.vatType === 'inclusive') {
      item.inclusiveAmount = qty * unit;
      item.vatAmount = item.inclusiveAmount - (item.inclusiveAmount / (1 + vatRate));
      item.exclusiveAmount = item.inclusiveAmount - item.vatAmount;
      item.total = item.inclusiveAmount;
    } else {
      item.exclusiveAmount = qty * unit;
      item.vatAmount = item.exclusiveAmount * vatRate;
      item.inclusiveAmount = item.exclusiveAmount + item.vatAmount;
      item.total = item.inclusiveAmount;
    }

    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    this.invoice.exclusiveTotal = this.items.reduce((sum, i) => sum + (i.exclusiveAmount || 0), 0);
    this.invoice.vatTotal = this.items.reduce((sum, i) => sum + (i.vatAmount || 0), 0);
    this.invoice.inclusiveTotal = this.items.reduce((sum, i) => sum + (i.inclusiveAmount || 0), 0);
  }

  // ------------------------------
  // Submit Invoice
  // ------------------------------
  submitInvoice() {

    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      let params = { invoice: this.invoice, items: this.items }
      console.log(params);
      this.service.createSalesInvoice(params, this.token).subscribe(
        res => {
          this.result = res;
          this.toast.success(this.result.message);
          this.router.navigate(['/salesinvoice']);
        }
      )
    }
    // console.log("Line Items:", this.items);
  }
  createCustomer() { }


}
