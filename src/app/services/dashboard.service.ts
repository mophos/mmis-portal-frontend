import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {
  tokenKey = sessionStorage.getItem('token');
  url = '';

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: Http,
    private authHttp: AuthHttp
  ) {
  }
  async orders_data() {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/showPurchase`).toPromise()
    return resp.json();
  }
  async generic_data() {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/showGeneric`).toPromise()
    return resp.json();
  }
  async inven_data(){
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/showInven`).toPromise()
    return resp.json();
  }
  async showInven_cost(){
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/showInven_cost`).toPromise()
    return resp.json();
  }
  // selectData(tableName, selectText, whereText, groupBy, orderText, limit = '1000') {
  //   return new Promise((resolve, reject) => {
  //     this.authHttp.post(`${this.url}/selectData`, {
  //       tableName: tableName,
  //       selectText: selectText,
  //       whereText: whereText,
  //       groupBy: groupBy,
  //       orderText: orderText,
  //       limit: limit,
  //       tokenKey: this.tokenKey
  //     })
  //       .map(res => res.json())
  //       .subscribe(res => {
  //         resolve(res);
  //       }, error => {
  //         reject(error);
  //       });
  //   });
  // }

}
