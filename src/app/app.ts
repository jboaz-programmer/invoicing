import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './loading-service';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
   protected readonly title = signal('accounting_ng');
  private router = inject(Router);
  loadingService = inject(LoadingService); // 👈 now available in template
 
  ngOnInit(): void {
    // hide loader after navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadingService.hide();
      }
    });
  }
}
