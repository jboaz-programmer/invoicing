import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../auth-service';
import { ToastService } from '../../toast-service';
import { TranslateService  } from '@ngx-translate/core';

declare const feather: any;

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [...SHARED_IMPORTS, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayout {
  token: any;
  dropdownOpen = false; // language dropdown toggle
  currentLang = 'en';

  private translate = inject(TranslateService);

  constructor(
    private router: Router,
    private service: AuthService,
    private toast: ToastService
  ) {
    this.currentLang = this.translate.currentLang || 'en';

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (feather) feather.replace(); 
      });
  }

  // -----------------------------
  // Language Dropdown
  // -----------------------------
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
      localStorage.setItem('lang', lang);  // save selection

    this.dropdownOpen = false; // close dropdown
  }

  // -----------------------------
  // Logout
  // -----------------------------
  logoutFunc() {
    this.token = localStorage.getItem('auth_token');
    this.service.logoutFunction(this.token).subscribe(res => {
      this.toast.success('Logged Out...');
      this.router.navigate(['/']);
    });
  }

  // -----------------------------
  // Get translation programmatically
  // -----------------------------
  getTranslation(key: string) {
    return this.translate.instant(key);
  }
}
