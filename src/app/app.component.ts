import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(
    @Inject('API_URL') private url: string,
    private router: Router,
  ) {
    
  }

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['portal']);
    }
  }

}
