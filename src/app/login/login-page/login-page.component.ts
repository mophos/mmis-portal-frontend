import { async } from '@angular/core/testing';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
    username: string;
    password: string;
    jwtHelper: JwtHelper = new JwtHelper();
    isLogging = false;
    version: any;
    budgetYear: any;
    hospitalName: any;
    warehouses = [];
    userWarehouseId: any;
    dateTime: any;
    constructor(
        @Inject('API_URL') private url: string,
        private loginService: LoginService,
        private router: Router,
        private alert: AlertService
    ) {
        this.getHospitalInfo();
        this.getVersion();
        moment.locale('TH');
        this.dateTime = moment().format('DD MMMM ') + (+moment().format('YYYY') + 543) + ' ' + moment().format('HH:mm') + ' น.'
    }

    ngOnInit() {
        if (sessionStorage.getItem('token')) {
            this.router.navigate(['portal']);
        }
    }

    enterLogin(event) {
        // enter login
        if (event.keyCode === 13) {
            this.doLogin();
        }
    }

    async selectWarehouse(event) {
        const rs: any = await this.loginService.searchWarehouse(this.username);
        if (rs.ok) {
            this.warehouses = rs.rows;
            this.userWarehouseId = rs.rows[0].user_warehouse_id;
        } else {
            this.warehouses = [];
            this.userWarehouseId = null;
        }
    }

    async doLogin() {
        this.isLogging = true;
        const rs: any = await this.loginService.doLogin(this.username, this.password, this.userWarehouseId);
        if (rs.ok) {
            const decodedToken = this.jwtHelper.decodeToken(rs.token);
            const fullname = `${decodedToken.fullname}`;
            sessionStorage.setItem('token', rs.token);
            sessionStorage.setItem('fullname', fullname);
            // hide spinner
            this.isLogging = false;
            // redirect to admin module
            console.log(decodedToken);
            const accessRight = decodedToken.accessRight;
            const rights = accessRight.split(',');
            if (_.indexOf(rights, 'WM_WAREHOUSE_ADMIN') > -1) {
                location.href = '/inventory/#/';
            } else {
                this.router.navigate(['portal']);
            }


        } else {
            this.isLogging = false;
            this.alert.error(rs.error);
            console.log(rs.error);
        }
    }
    showManualStaff() {
        const url = this.url + '/pdf/HowTo(staff).pdf';
        window.open(url, '_blank');
    }
    async getVersion() {
        const rs: any = await this.loginService.getVersion();
        if (rs.ok) {
            this.version = rs.version;
        }
    }

    async getHospitalInfo() {
        try {
            const rs: any = await this.loginService.getHospitalInfo();
            if (rs.ok) {
                this.hospitalName = rs.hospitalName || 'ไม่สามารถติดต่อฐานข้อมูลได้';
                this.budgetYear = +rs.budgetYear + 543;
            } else {
                console.log(rs.error);
            }
        } catch (error) {
            console.log(error);
        }

    }
}
