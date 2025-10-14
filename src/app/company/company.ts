import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { ToastService } from '../toast-service';
import { Observable } from 'rxjs';
import { RefreshService } from '../refresh-service';

@Component({
  selector: 'app-company',
  imports: [...SHARED_IMPORTS],
  templateUrl: './company.html',
  styleUrl: './company.css'
})
export class Company implements OnInit{
companyForm: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  token: any
  result: any;
   company$: Observable<any[]>; // Observable for table
  companyDet: any
  constructor(private fb: FormBuilder,   private ngZone: NgZone,  private cdr: ChangeDetectorRef, private router: Router, private service: AuthService, private toast: ToastService, private refreshService: RefreshService) {
    this.companyForm = this.fb.group({
      company: [''],
      address: [''],
      bankname: [''],
      person: [''],
      tin: [''],
      vat: [''],
      email: [''],
      mobile_one: [''],
      bank_one: [''],
      bank_two: [''],
      accountname: [''],
      swiftcode: [''],
      logo: [null]
     });
        this.company$ = this.refreshService.getObservable('companydetails');
        // this.cdr.detectChanges();

  }
  getInitials(name: string | undefined): string {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase(); // single word: first 2 letters
  }
  return words.map(w => w[0]).join('').substring(0, 2).toUpperCase(); // multiple words
}
ngOnInit(): void {
  this.token = localStorage.getItem('auth_token');
  if (this.token) {
    this.service.getcompanydetails(this.token).subscribe({
      next: (res: any) => {
        this.companyDet = res.companydetails;
 
        // Patch all form values
        this.companyForm.patchValue({
          company: this.companyDet.company,
          address: this.companyDet.adress,
          bankname: this.companyDet.bankname,
          person: this.companyDet.person,
          tin: this.companyDet.tin,
          vat: this.companyDet.vat,
          email: this.companyDet.email,
          mobile_one: this.companyDet.mobile_one,
          bank_one: this.companyDet.bank_one,
          bank_two: this.companyDet.bank_two,
          accountname: this.companyDet.accountname,
          swiftcode: this.companyDet.swiftcode,
          logo: this.companyDet.logo || null
        });

        // Assign logo
        this.logoPreview = this.companyDet.logo_url ?? null;

        // ✅ Force Angular to update the view for <img>
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}
selectedLogoFile: File | null = null;

onLogoSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedLogoFile = file; // keep the actual file

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

removeLogo(): void {
  this.companyForm.patchValue({ logo: null });
  this.logoPreview = null;
  this.companyDet.logo_url = null; // clear backend logo preview too
}

onSubmit(): void {
  const formData = new FormData();

  // append other form fields
  Object.keys(this.companyForm.controls).forEach(key => {
    if (key !== 'logo') {   // skip logo here
      const controlValue = this.companyForm.get(key)?.value;
      formData.append(key, controlValue);
    }
  });

  // append logo file separately if exists
  if (this.selectedLogoFile) {
    formData.append('logo', this.selectedLogoFile);
  }

  this.token = localStorage.getItem('auth_token');
  console.log(formData);
  if (this.token) {
    this.service.createCompanyProfile(formData, this.token).subscribe(
      res => {
        this.result = res;
        this.toast.success(this.result.message);
      }
    );
  }

  console.log('Form submitted', this.companyForm.value);
}

}
