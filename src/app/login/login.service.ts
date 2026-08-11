import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('UM_LOGIN_URL') private umUrl: string,
    private http: Http) { }

  doLogin(username: string, password: string, userWarehouseId, deviceInfo) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.umUrl}/login`, {
        username: username,
        password: password,
        userWarehouseId: userWarehouseId,
        deviceInfo: deviceInfo,
        // บอก backend ว่าหน้าจอนี้รองรับขั้นตอนเปลี่ยนรหัสผ่าน/2FA แล้ว
        // ถ้าไม่ส่งค่านี้ backend จะตอบ CLIENT_OUTDATED แทนที่จะส่ง preAuthToken มาให้
        supportLoginSteps: true
      }, { withCredentials: true })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  /**
   * ขั้นตอนหลัง login ทุกตัวใช้ preAuthToken แทน token จริง
   * preAuthToken มีอายุ 15 นาที และใช้เรียก API อื่นของระบบไม่ได้
   */
  private postWithPreAuth(path: string, preAuthToken: string, body: any = {}) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${preAuthToken}`
    });

    return new Promise((resolve, reject) => {
      // withCredentials ให้เบราว์เซอร์แนบ cookie ของการจดจำอุปกรณ์มาด้วย
      // บนเครื่องจริงเป็น same-origin อยู่แล้วจึงไม่มีผลอะไร แต่บนเครื่อง dev
      // ที่หน้าเว็บอยู่คนละ port กับ API ถ้าไม่ใส่ cookie จะไม่ถูกส่งเลย
      this.http.post(`${this.umUrl}${path}`, body, { headers: headers, withCredentials: true })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  changePassword(preAuthToken: string, password: string, confirmPassword: string) {
    return this.postWithPreAuth('/login/change-password', preAuthToken, {
      password: password,
      confirmPassword: confirmPassword
    });
  }

  setup2fa(preAuthToken: string) {
    return this.postWithPreAuth('/login/2fa/setup', preAuthToken);
  }

  confirm2fa(preAuthToken: string, code: string, rememberDevice: boolean) {
    return this.postWithPreAuth('/login/2fa/confirm', preAuthToken, {
      code: code,
      rememberDevice: rememberDevice === true
    });
  }

  verify2fa(preAuthToken: string, code: string, rememberDevice: boolean) {
    return this.postWithPreAuth('/login/2fa/verify', preAuthToken, {
      code: code,
      rememberDevice: rememberDevice === true
    });
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
