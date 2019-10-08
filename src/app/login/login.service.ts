import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('UM_LOGIN_URL') private umUrl: string,
    private http: Http) { }

  doLogin(username: string, password: string, userWarehouseId, deviceInfo) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.umUrl}/login`, { username: username, password: password, userWarehouseId: userWarehouseId, deviceInfo: deviceInfo })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
    // const rs: any = await this.http.post(`${this.umUrl}/login`, { username: username, password: password });
    // debugger;
    // return rs;
  }

  searchWarehouse(username: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.umUrl}/login/warehouse/search?username=${username}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  testLogin(username: string, password: string) {
    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === 'admin') {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcGxpdF90YWJsZSI6Il90b18iLCJmdWxsbmFtZSI6IuC4quC4luC4tOC4leC4ouC5jCDguYDguKPguLXguKLguJnguJ7guLTguKgiLCJ1c2VybmFtZSI6ImFkbWluIiwic3BsaXRfdHlwZSI6Il9fXyJ9.2fdq0lh0j-j6WCHzqkYk3S1Ni3Kd6r2C-QiacCIcMc0'
        resolve(token);
      } else {
        reject('Invalid username/password');
      }
    });
  }
  getVersion() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.url}/version`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getHospitalInfo() {
    const rs = await this.http.get(`${this.url}/login/hospital`).toPromise();
    return rs.json();
  }

  async getLastVersion() {
    const url = 'https://api.github.com/repos/mophos/mmis-docker-build/releases/latest';
    const resp = await this.http.get(`${url}`).toPromise();
    return resp.json();
  }
}
