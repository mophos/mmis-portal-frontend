import { async } from '@angular/core/testing';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
import * as moment from 'moment';
// import { environment } from '../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
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
    deviceInfo: any;
    lastVersion: any;
    urlVersion: any

    // ----- ขั้นตอนความปลอดภัยหลังตรวจรหัสผ่าน -----
    // preAuthToken เก็บไว้ในตัวแปรของ component เท่านั้น ห้ามลง sessionStorage
    // เพราะมันไม่ใช่ token สำหรับใช้งานระบบ และควรหายไปเมื่อผู้ใช้ปิดหน้าจอ
    preAuthToken: string = null;

    showChangePassword = false;
    showSetup2fa = false;
    showVerify2fa = false;
    isProcessing = false;

    newPassword = '';
    confirmPassword = '';
    showNewPassword = false;
    showConfirmPassword = false;
    changePasswordError: string = null;

    qrDataUri: string = null;
    secretText: string = null;
    twoFaIssuer: string = null;
    twoFaAccount: string = null;
    setupCode = '';
    setupError: string = null;

    verifyCode = '';
    verifyError: string = null;
    remainingAttempts: number = null;

    /**
     * ผู้ใช้ติ๊ก "จำอุปกรณ์นี้" — ค่าเริ่มต้นต้องเป็น false เสมอ
     * เครื่องในโรงพยาบาลหลายจุดเป็นเครื่องกลาง ถ้าติ๊กมาให้ตั้งแต่แรก
     * จะมีคนเผลอจำอุปกรณ์บนเครื่องที่ใช้ร่วมกันโดยไม่ตั้งใจ
     */
    rememberDevice = false;

    /** ระบบเปิดให้จำอุปกรณ์หรือไม่ (SYS_2FA_TRUST_DEVICE_DAYS > 0) */
    trustDeviceDays = 0;
    constructor(
        @Inject('API_URL') private url: string,
        private loginService: LoginService,
        private router: Router,
        private alert: AlertService,
        private deviceService: DeviceDetectorService
    ) {
        this.getHospitalInfo();
        this.getVersion();
        this.getLastVersion();
        moment.locale('TH');
        this.dateTime = moment().format('DD MMMM ') + (+moment().format('YYYY') + 543) + ' ' + moment().format('HH:mm') + ' น.'
    }

    ngOnInit() {
        if (sessionStorage.getItem('token')) {
            this.router.navigate(['portal']);
        }
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this.deviceInfo.host = location.host;
        this.deviceInfo.url = location.href;
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
        try {
            const rs: any = await this.loginService.doLogin(this.username, this.password, this.userWarehouseId, this.deviceInfo);
            this.isLogging = false;

            if (!rs.ok) {
                this.alert.error(rs.error);
                return;
            }

            // ผ่านทุกขั้นตอนแล้ว เข้าระบบได้เลย
            if (rs.token) {
                this.enterSystem(rs.token);
                return;
            }

            // ยังต้องทำขั้นตอนความปลอดภัยต่อ
            this.preAuthToken = rs.preAuthToken;
            this.trustDeviceDays = rs.trustDeviceDays || 0;
            this.goToStep(rs.next);

        } catch (error) {
            this.isLogging = false;
            this.alert.error('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
        }
    }

    /** เก็บ token แล้วพาเข้าระบบ — ตรรกะเดิมทุกประการ */
    private enterSystem(token: string) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        const fullname = `${decodedToken.fullname}`;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('fullname', fullname);

        this.closeAllSteps();
        this.isLogging = false;

        const accessRight = decodedToken.accessRight;
        const rights = accessRight.split(',');
        if (_.indexOf(rights, 'WM_WAREHOUSE_ADMIN') > -1) {
            location.href = '/inventory/#/';
        } else {
            this.router.navigate(['portal']);
        }
    }

    /** เปิด modal ให้ตรงกับขั้นตอนที่ backend บอกมา */
    private goToStep(next: string) {
        this.closeAllSteps();

        // ล้างทุกครั้งที่เปิดขั้นตอนใหม่ ไม่ให้ค่าที่ติ๊กไว้รอบก่อนค้างมา
        // เช่น กรอก OTP ผิดแล้วเริ่มใหม่ หรือผู้ใช้คนอื่นมาเข้าต่อบนเครื่องเดียวกัน
        this.rememberDevice = false;

        if (next === 'change_password') {
            this.newPassword = '';
            this.confirmPassword = '';
            this.changePasswordError = null;
            this.showChangePassword = true;
        } else if (next === '2fa_setup') {
            this.showSetup2fa = true;
            this.loadSetup2fa();
        } else if (next === '2fa_verify') {
            this.verifyCode = '';
            this.verifyError = null;
            this.remainingAttempts = null;
            this.showVerify2fa = true;
        } else {
            this.alert.error('ไม่รู้จักขั้นตอนความปลอดภัยที่ระบบส่งมา');
        }
    }

    private closeAllSteps() {
        this.showChangePassword = false;
        this.showSetup2fa = false;
        this.showVerify2fa = false;
    }

    /** ยกเลิกกลางคัน — ล้างทุกอย่างแล้วกลับไปหน้ากรอกรหัสผ่าน */
    cancelSteps() {
        this.closeAllSteps();
        this.preAuthToken = null;
        this.password = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.setupCode = '';
        this.verifyCode = '';
        this.qrDataUri = null;
        this.secretText = null;
        this.changePasswordError = null;
        this.setupError = null;
        this.verifyError = null;
        this.remainingAttempts = null;
        this.isProcessing = false;
        this.rememberDevice = false;
        this.trustDeviceDays = 0;
    }

    /** จัดการคำตอบของทุก step ให้เหมือนกัน: จบแล้วเข้าระบบ ไม่จบก็ไป step ถัดไป */
    private handleStepResult(rs: any) {
        this.preAuthToken = rs.preAuthToken || this.preAuthToken;

        if (rs.next === 'done' && rs.token) {
            this.enterSystem(rs.token);
        } else {
            this.goToStep(rs.next);
        }
    }

    /** หมดอายุ pre-auth token ระหว่างทาง ต้องเริ่มใหม่ */
    private handleExpired(rs: any) {
        if (rs.code === 'PREAUTH_EXPIRED') {
            this.cancelSteps();
            this.alert.error(rs.error);
            return true;
        }
        return false;
    }

    // ----- ขั้นตอนที่ 1 : เปลี่ยนรหัสผ่าน -----

    get passwordRules() {
        const pw = this.newPassword || '';
        return {
            length: pw.length >= 8,
            letter: /[a-zA-Z]/.test(pw),
            number: /[0-9]/.test(pw),
            match: pw.length > 0 && pw === this.confirmPassword
        };
    }

    get canSubmitPassword() {
        const r = this.passwordRules;
        return r.length && r.letter && r.number && r.match && !this.isProcessing;
    }

    async submitChangePassword() {
        if (!this.canSubmitPassword) { return; }

        this.isProcessing = true;
        this.changePasswordError = null;

        try {
            const rs: any = await this.loginService.changePassword(this.preAuthToken, this.newPassword, this.confirmPassword);
            this.isProcessing = false;

            if (!rs.ok) {
                if (this.handleExpired(rs)) { return; }
                this.changePasswordError = rs.error;
                return;
            }

            this.alert.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
            this.handleStepResult(rs);

        } catch (error) {
            this.isProcessing = false;
            this.changePasswordError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
        }
    }

    // ----- ขั้นตอนที่ 2 : ตั้งค่า Google Authenticator -----

    async loadSetup2fa() {
        this.isProcessing = true;
        this.setupCode = '';
        this.setupError = null;
        this.qrDataUri = null;

        try {
            const rs: any = await this.loginService.setup2fa(this.preAuthToken);
            this.isProcessing = false;

            if (!rs.ok) {
                if (this.handleExpired(rs)) { return; }
                this.setupError = rs.error;
                return;
            }

            this.preAuthToken = rs.preAuthToken;
            this.qrDataUri = rs.qrDataUri;
            this.secretText = rs.secretText;
            this.twoFaIssuer = rs.issuer;
            this.twoFaAccount = rs.account;

        } catch (error) {
            this.isProcessing = false;
            this.setupError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
        }
    }

    async submitSetup2fa() {
        if (this.setupCode.length !== 6 || this.isProcessing) { return; }

        this.isProcessing = true;
        this.setupError = null;

        try {
            const rs: any = await this.loginService.confirm2fa(this.preAuthToken, this.setupCode, this.rememberDevice);
            this.isProcessing = false;

            if (!rs.ok) {
                if (this.handleExpired(rs)) { return; }
                // backend ส่ง token เดิมกลับมาให้ลองซ้ำได้โดยไม่ต้องสแกน QR ใหม่
                this.preAuthToken = rs.preAuthToken || this.preAuthToken;
                this.setupError = rs.error;
                this.setupCode = '';
                return;
            }

            this.handleStepResult(rs);

        } catch (error) {
            this.isProcessing = false;
            this.setupError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
        }
    }

    copySecret() {
        const input: any = document.getElementById('mmis-2fa-secret');
        if (!input) { return; }
        input.select();
        try {
            document.execCommand('copy');
            this.alert.success('คัดลอกรหัสแล้ว');
        } catch (error) {
            this.alert.error('คัดลอกไม่สำเร็จ กรุณาพิมพ์รหัสเอง');
        }
    }

    // ----- ขั้นตอนที่ 3 : กรอก OTP -----

    async submitVerify2fa() {
        if (this.verifyCode.length !== 6 || this.isProcessing) { return; }

        this.isProcessing = true;
        this.verifyError = null;

        try {
            const rs: any = await this.loginService.verify2fa(this.preAuthToken, this.verifyCode, this.rememberDevice);
            this.isProcessing = false;

            if (!rs.ok) {
                if (this.handleExpired(rs)) { return; }

                // ถูกล็อกบัญชี ไม่มีประโยชน์ที่จะให้กรอกต่อ ปิด modal แล้วแจ้งชัดๆ
                if (rs.code === 'LOCKED') {
                    this.cancelSteps();
                    this.alert.error(rs.error);
                    return;
                }

                this.preAuthToken = rs.preAuthToken || this.preAuthToken;
                this.verifyError = rs.error;
                this.remainingAttempts = rs.remainingAttempts;
                this.verifyCode = '';
                return;
            }

            this.handleStepResult(rs);

        } catch (error) {
            this.isProcessing = false;
            this.verifyError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
        }
    }

    /** ให้กรอกได้เฉพาะตัวเลข 6 หลัก */
    onlyDigits(value: string): string {
        return (value || '').replace(/[^0-9]/g, '').substring(0, 6);
    }
    showManualStaff() {
        const url = this.url + '/pdf/HowTo(staff).pdf';
        window.open(url, '_blank');
    }

    async getVersion() {
        try {
            const rs: any = await this.loginService.getVersion();
            if (rs.ok) {
                this.version = rs.version.toUpperCase();
                this.deviceInfo.version = this.version.toUpperCase();
            }
        } catch (error) {
            console.log(error);
        }

    }

    async getLastVersion() {
        try {
            const rs: any = await this.loginService.getLastVersion();
            if (rs) {
                this.lastVersion = rs.name.toUpperCase();
                this.urlVersion = rs.html_url;
            }
        } catch (error) {
            this.lastVersion = this.version;
            console.log(error);
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
