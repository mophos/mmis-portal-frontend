import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ServiceService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resove, reject) => {
      this.authHttp.get(`${this.url}/service`)
      .map(res => res.json())
      .subscribe(data => {
        resove(data);
      }, error => {
        reject(error);
      });
    });
  }

  allBySystemID(systemId: string) {
    return new Promise((resove, reject) => {
      this.authHttp.get(`${this.url}/service/by-system/${systemId}`)
      .map(res => res.json())
      .subscribe(data => {
        resove(data);
      }, error => {
        reject(error);
      });
    });
  }

  save(data: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/service`, data)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(id: number, data: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/service/${id}`, data)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/service/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
