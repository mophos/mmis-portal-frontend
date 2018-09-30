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
  async inven_data() {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/showInven`).toPromise()
    return resp.json();
  }
  async showInven_cost() {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/showInven_cost`).toPromise()
    return resp.json();
  }
  async showorderPoint(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/orderPoint/${warehouseId}`).toPromise()
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

  async getBudgetByYear(budgetYear: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/budget/list/${budgetYear}`).toPromise()
    return resp.json();
  }

  async getBudgetTransaction(budgetchart: any, sDate: any, eDate: any, budgetYear: any, budgetDetailId: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/budget/transaction/${budgetchart}/${sDate}/${eDate}/${budgetYear}/${budgetDetailId}`).toPromise();
    return resp.json();
  }

  async getBudgetAll(budgetDetailId: any, selectedYear: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/budget/all/${budgetDetailId}/${selectedYear}`).toPromise();
    return resp.json();
  }

  async getBudgetAmount(budgetDetailId: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/budget/amount/${budgetDetailId}`).toPromise();
    return resp.json();
  }

  async getInventoryValue(warehouseId: any, date: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/inventoryValue/${warehouseId}/${date}`).toPromise();
    return resp.json();
  }

  async getpoApproved() {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/poApproved`).toPromise();
    return resp.json();
  }

  async getOrdersWaiting(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/getOrdersWaiting/${warehouseId}`).toPromise();
    return resp.json();
  }

  async getOrdersWaitingApprove(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/getOrdersWaitingApprove/${warehouseId}`).toPromise();
    return resp.json();
  }

  async getOrdersUnpaid(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.apiUrl}/dashboard/getOrdersUnpaid/${warehouseId}`).toPromise();
    return resp.json();
  }
}
