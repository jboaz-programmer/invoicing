import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { Observable } from 'rxjs';
import { LoadingService } from '../loading-service';

@Component({
  selector: 'app-dashboard',
  imports: [...SHARED_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  // response: any;
 response$!: Observable<any>;

  token:any
  constructor(private route: Router, private service: AuthService, private loadingService: LoadingService  ){
   }
ngOnInit(){
      this.DashboardSumary();
  }
  DashboardSumary(){
    this.loadingService.show();
    if (typeof localStorage !== 'undefined') {
    this.token = localStorage.getItem('auth_token');
      if(this.token){
      this.response$ = this.service.getDashboardSummary(this.token);
          this.loadingService.hide();

        // temporary console log
      // this.response$.subscribe(res => {
      //   console.log('Dashboard response:', res); // 👈 actual JSON here
      // });
    }
  }
  }
  
}
