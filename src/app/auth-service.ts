import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RefreshService } from './refresh-service';

@Injectable({
  providedIn: 'root'

})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api'; // your Laravel API

  constructor(private refreshService: RefreshService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  getUser(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }
   logoutFunction(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/logout`, { headers });
  }
  getDashboardSummary(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/dashboard`, { headers });
  }
  saveCashBank(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/addcashbank`, data, { headers }).pipe(
    tap(() => {
      // push new account into RefreshService dynamically
      this.refreshService.pushItem('cashbank', data);
    })
  );
}

// getcashbank(token: string) {
//   const headers = { Authorization: `Bearer ${token}` };
//   return this.http.get(`${this.apiUrl}/cashbank`, { headers }).pipe(
//     tap((res: any) => {
//       this.refreshService.update('cashbank', res.accounts); // populate BehaviorSubject
//     })
//   );
// }
getcashbank(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/cashbank`, { headers }).pipe(
    tap((res: any) => {
      // push the array inside "accountdetails" into the BehaviorSubject
      this.refreshService.update('cashbank', res.accountdetails);
    })
  );
}
updateAccount(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.put(`${this.apiUrl}/account-update`, data, { headers }).pipe(
    tap(() => {
      // refresh from backend after update
      this.getcashbank(token).subscribe();
    })
  );
}
deleteAccount(id: number) {
  return this.http.delete<any>(`${this.apiUrl}/accounts/${id}`);
}
// getExpensesList(data:any,token: string) {
//   const headers = { Authorization: `Bearer ${token}` };
//   return this.http.get(`${this.apiUrl}/get-payment-list`, { headers }).pipe(
//     tap((res: any) => {
//       // push the array inside "accountdetails" into the BehaviorSubject
//       this.refreshService.update('expenses', res.data);
//     })
//   );
// }
getIncomeAndExpenses(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };

  // Convert `data` object into HttpParams
  let params = new HttpParams();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      params = params.set(key, data[key]);
    }
  });

  return this.http.get(`${this.apiUrl}/get-payment-list`, { headers, params }).pipe(
    tap((res: any) => {
      // push the array inside "accountdetails" into the BehaviorSubject
      this.refreshService.update('expenses', res.data);
    })
  );
}


getExpnsesAccounts(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/get-expenses-account-list`, { headers }).pipe(
    tap((res: any) => {
      // push the array inside "accountdetails" into the BehaviorSubject
      this.refreshService.update('expensesaccounts', res.accounts);
    })
  );
}
getIncomeAccounts(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/get-income-account-list`, { headers }).pipe(
    tap((res: any) => {
      // push the array inside "accountdetails" into the BehaviorSubject
      this.refreshService.update('incomeaccounts', res.accounts);
    })
  );
}
 createExpenses(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/createpayments`, data, { headers }).pipe(
    tap(() => {
      // push new account into RefreshService dynamically
      this.refreshService.pushItem('expenses', data);
    })
  );
}
exportDemoTemplate(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/Export-Payments`, { 
    headers, 
    responseType: 'blob' // important for Excel
  });
}
uploadExpenses(formData: FormData, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/importPayments`, formData, { headers });
}
deleteExpense(token: any, id: number) {
    const headers = { Authorization: `Bearer ${token}` };

  return this.http.delete<any>(`${this.apiUrl}/deleteExpenses/${id}`,{headers});
}
getExpenseById(id: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/updatepayments/${id}`, { headers });
}
UpdateExpenses(id: any,data:any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.put(`${this.apiUrl}/updateExpenses/${id}`,data, { headers });
}
 createIncomes(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/createincome`, data, { headers }).pipe(
    tap(() => {
      // push new account into RefreshService dynamically
      this.refreshService.pushItem('incomes', data);
    })
  );
}
uploadIncomes(formData: FormData, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/importIncomes`, formData, { headers });
}


getSalesInvoice(token: string) {
  const headers = { Authorization: `Bearer ${token}` };


  return this.http.get(`${this.apiUrl}/get-sales-invoice-list`,{ headers}).pipe(
    tap((res: any) => {
      // push the array inside "accountdetails" into the BehaviorSubject
      this.refreshService.update('invoices', res.data);
    })
  );
}
 getCustomers(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/get-customers-list`,{ headers}).pipe(
    tap((res: any) => {
       this.refreshService.update('customers', res.data);
    })
  );
}
 createSalesInvoice(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/create-sales-invoice`, data, { headers });
}
viewSalesInvoices(id: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/get-sales-invoice-details/${id}`, { headers });
}
// create-company-profile
createCompanyProfile(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/create-company-profile`, data, { headers });
}
 getcompanydetails(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/get-company-details`,{ headers}).pipe(
    tap((res: any) => {
       this.refreshService.update('companydetails', res.data);
    })
  );
}

// create-company-profile
createCustomer(data: any, token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/create-customers`, data, { headers }).pipe(
    tap(() => {
      // push new account into RefreshService dynamically
      this.refreshService.pushItem('customers', data);
    })
  );;
}
makePayments(data: any, token: any){
    const headers = { Authorization: `Bearer ${token}` };
return this.http.post(`${this.apiUrl}/makepayments`, data, { headers }).pipe(
    tap(() => {
      // push new account into RefreshService dynamically
      this.refreshService.pushItem('invoice', data);
    })
  );
}
}



 