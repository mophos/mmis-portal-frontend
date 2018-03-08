import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class SystemService {

 constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resove, reject) => {
      this.authHttp.get(`${this.url}/system`)
      .map(res => res.json())
      .subscribe(data => {
        resove(data);
      }, error => {
        reject(error);
      });
    });
  }

  detail(id: string) {
    return new Promise((resove, reject) => {
      this.authHttp.get(`${this.url}/system/detail/${id}`)
      .map(res => res.json())
      .subscribe(data => {
        resove(data);
      }, error => {
        reject(error);
      });
    });
  }

}
