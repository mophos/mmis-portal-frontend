import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  public jwtHelper: JwtHelper = new JwtHelper();
  fullname: string;
  public env: any;
  rights: any;
  Purchasing = false;
  Planning = false;
  Inventory = false;
  InventoryWarehouse = false;
  Materials = false;
  Contracts = false;
  Administrator = false;
  Report = false;
  token: any;
  warehouseName: any;
  warehouseCode: any;
  constructor(private router: Router) {
    this.fullname = sessionStorage.getItem('fullname');
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');

    this.router.navigate(['login']);
  }

  ngOnInit() {
    this.env = {
      purchasingUrl: environment.purchasingUrl,
      planningUrl: environment.planningUrl,
      inventoryUrl: environment.inventoryUrl,
      materialsUrl: environment.materialsUrl,
      reportUrl: environment.reportUrl,
      umUrl: environment.umUrl,
      contractsUrl: environment.contractsUrl
    };
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const accessRight = decodedToken.accessRight;
    this.warehouseName = decodedToken.warehouseName;
    this.warehouseCode = decodedToken.warehouseCode;
    this.rights = accessRight.split(',');

    this.Purchasing = _.indexOf(this.rights, 'PO_ADMIN') === -1 ? false : true;
    this.Planning = _.indexOf(this.rights, 'BM_ADMIN') === -1 ? false : true;
    this.Inventory = _.indexOf(this.rights, 'WM_ADMIN') === -1 ? false : true;
    this.InventoryWarehouse = _.indexOf(this.rights, 'WM_WAREHOUSE_ADMIN') === -1 ? false : true;
    this.Materials = _.indexOf(this.rights, 'MM_ADMIN') === -1 ? false : true;
    this.Contracts = _.indexOf(this.rights, 'CM_ADMIN') === -1 ? false : true;
    this.Administrator = _.indexOf(this.rights, 'UM_ADMIN') === -1 ? false : true;
    this.Report = _.indexOf(this.rights, 'RP_ADMIN') === -1 ? false : true;
    // console.log(this.rights);
    // console.log(_.indexOf(this.rights, 'PO_ADMIN'));
  }

}
