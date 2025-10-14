import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { AuthGuard } from './auth-guard';
import { Cashbank } from './cashbank/cashbank';
import { Expensespage } from './expensespage/expensespage';
import { Createexpenses } from './createexpenses/createexpenses';
import { Editexpenses } from './editexpenses/editexpenses';
import { Incomelist } from './incomelist/incomelist';
import { Invoicelist } from './invoicelist/invoicelist';
import { Editincomepage } from './editincomepage/editincomepage';
import { Createincome } from './createincome/createincome';
import { Salesinvoice } from './salesinvoice/salesinvoice';
import { Viewinvoice } from './viewinvoice/viewinvoice';
import { Createsalesinvoice } from './createsalesinvoice/createsalesinvoice';
import { Company } from './company/company';
import { Suppliers } from './suppliers/suppliers';
import { Customers } from './customers/customers';
import { Invoicedetails } from './invoicedetails/invoicedetails';
  

 export const AppRoutes: Routes = [
  { path: '', component: Login },
  { path: 'signup', component: Signup },

  {
    path: '',
    component: DashboardLayout, // wrapper (sidebar/header/footer)
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },         // /dashboard
      { path: 'cashbank', component: Cashbank },           // /cashbank
      { path: 'expensespage', component: Expensespage },   // /expensespage
      { path: 'createexpenses', component: Createexpenses }, // /createexpenses
      { path: 'editexpenses', component: Editexpenses }, // /editexpenses
      { path: 'incomelist', component: Incomelist},
      { path: 'invoicelist', component: Invoicelist},
      { path: 'editincomepage', component: Editincomepage},
      { path: 'createincome', component: Createincome},
      { path: 'salesinvoice', component: Salesinvoice},
      {path: 'viewinvoice', component: Viewinvoice},
      {path: 'createsalesinvoice', component: Createsalesinvoice},
      {path: 'company', component: Company},
      {path: 'suppliers', component: Suppliers},
      {path: 'customers', component: Customers},
      {path: 'invoicedetails', component: Invoicedetails}





 
 
 
    ]
  },

  { path: '**', redirectTo: '' }
];
