import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for ngIf, ngFor, etc.
// import { RouterModule } from '@angular/router';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,        // ⚡ make it standalone
  imports: [...SHARED_IMPORTS]  // import modules you need
})
export class Login {
  loginMessage: any;

  constructor(private router: Router, private auth: AuthService) {

  }
  postData = { email: '', password: '' }
  submitted = false;

loginFunction(form: any, event: Event) {
  event.preventDefault();  // stops the browser from submitting the form

  this.submitted = true;  // mark as submitted

  if (form.invalid) {
    return; // don’t call API if form invalid
  }

  this.auth.login(this.postData.email, this.postData.password).subscribe({
    next: (res: any) => {
      localStorage.setItem('auth_token', res.access_token);
      this.router.navigate(['/salesinvoice']);
    },
    error: () => {
      this.loginMessage = 'Invalid email or password';
    }
  });
}



}
