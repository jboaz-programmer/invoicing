import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  
 canActivate(): boolean {
    // Only try to use localStorage in the browser
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        return true;
      }
    }

    // If no token (or running on server), redirect to login
    this.router.navigate(['/']);
    return false;
  }
}
