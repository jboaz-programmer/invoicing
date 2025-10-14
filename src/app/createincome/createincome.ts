import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-imports';
 import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { RefreshService } from '../refresh-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingService } from '../loading-service';
 
@Component({
  selector: 'app-createincome',
   imports: [...SHARED_IMPORTS],
  templateUrl: './createincome.html',
  styleUrl: './createincome.css'
})
export class Createincome {
 
incomeForm!: FormGroup;
  selectedImage: File | null = null;
  accountDetails: any[] = []; // from service
  profitAccounts: any[] = []; // from service
token: any
  accounts$: Observable<any[]>; // Observable for table
  chataccounts$: Observable<any[]>; // Observable for table
  result: any;
response: any
  constructor(private fb: FormBuilder, private service: AuthService, private toast: ToastService, private refreshService: RefreshService, private router: Router, private loadingService: LoadingService ) {
        this.accounts$ = this.refreshService.getObservable('cashbank');
        this.chataccounts$ = this.refreshService.getObservable('incomeaccounts');
  }
   
loadProfitAccounts() {
  this.token = localStorage.getItem('auth_token');
  if (this.token) {
    this.service.getIncomeAccounts(this.token).subscribe({
      next: (res: any) => {
         // refreshService updates chataccounts$ internally
      },
      error: (err) => console.error("Error loading accounts:", err)
    });
  }
}

  ngOnInit(): void {
    this.initForm();
    this.loadAccounts();
    this.loadProfitAccounts();
  }

  initForm() {
    this.incomeForm = this.fb.group({
      descriptions: ['', Validators.required],
      paidfrom: ['', Validators.required],
      exch_rate: [''],
      created_at: [''],
      supplier: [''],
      vrn: [''],
      v_code: [''],
      receipt_no: [''],
      items: this.fb.array([this.createItem()]), // dynamic items
      receipt: [null] // image
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      profit_account_id: ['', Validators.required],
      item: [''],
      Qty: [1],
      vat: [''],
      unit_amount: [0]
    });
  }

  get items(): FormArray {
    return this.incomeForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  submitForm() {
    // this.loadingService.show();
    // if (this.incomeForm.invalid) return;

    console.log(this.incomeForm.value);
    // const formData = new FormData();
    // Object.entries(this.incomeForm.value).forEach(([key, value]) => {
    //   if (key === 'items') {
    //     value.forEach((item: any, i: number) => {
    //       Object.entries(item).forEach(([k, v]) => {
    //         formData.append(`items[${i}][${k}]`, v);
    //       });
    //     });
    //   } else if (key === 'receipt' && this.selectedImage) {
    //     formData.append('receipt', this.selectedImage);
    //   } else {
    //     formData.append(key, value);
    //   }
    // });
 this.token = localStorage.getItem('auth_token');
    if (this.token) {
    this.service.createIncomes(this.incomeForm.value,this.token).subscribe(res => {
      this.result = res
      // this.loadingService.hide();
      this.toast.success(this.result.message);
      this.router.navigate(['/incomelist'])
     });
  }
  }

  // Example services to load accounts
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


exportExcel() {
  const token = localStorage.getItem('auth_token');
  if (!token) return;

  this.service.exportDemoTemplate(token).subscribe(
    (blob: Blob) => {
      // Create a link element
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Set the downloaded file name
      a.download = 'payments-template.xlsx';
      a.click();
      window.URL.revokeObjectURL(url); // Clean up
    },
    err => console.error('Error downloading Excel:', err)
  );
}
selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

uploadExcel() {
  this.loadingService.show();
  if (!this.selectedFile) {
    alert('Please select a file first.');
    return;
  }

  const token = localStorage.getItem('auth_token');
  if (!token) return;

  const formData = new FormData();
  formData.append('import_file', this.selectedFile);

  this.service.uploadIncomes(formData, token).subscribe({
    next: (res) => {
      this.response = res;
        this.loadingService.hide();

          this.toast.success(this.response.message);
      this.router.navigate(['/incomelist'])
    },
    error: (err) => {
      // console.error('Upload failed', err);
    }
  });
}


}
