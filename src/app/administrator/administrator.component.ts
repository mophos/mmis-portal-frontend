import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  fullname: string;
  
  constructor(private router: Router) {
    this.fullname = sessionStorage.getItem('fullname');
   }

  ngOnInit() {
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
    this.router.navigate(['login']);
  }

}
