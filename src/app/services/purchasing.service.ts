import { Injectable,Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class PurchasingService {

  constructor(
    @Inject('API_URL') private url: String,
    private authHttp: AuthHttp
  ) { }

  async getSubtype() {
    const res = await this.authHttp.get(`${this.url}/purchasing/list-subtype/`).toPromise();
    return res.json();
  }
}
