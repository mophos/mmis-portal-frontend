import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from './user.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

 public users: Array<any> = [];

 public userId: number;
 public username: string;
 public password: string;
 public oldPassword: string;
 public email: string;
 public fullname: string;
 public enable: boolean;

 public opened: boolean = false;
 public isUpdate: boolean = false;
 public loading: boolean = false;

  constructor(
    private userService: UserService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  addNew() {
    this.userId = null;
    this.username = null;
    this.password = null;
    this.fullname = null;
    this.email = null;
    this.enable = true;
    this.isUpdate = false;
    this.opened = true;
  }

  getUsers() {
    this.userService.all()
    .then((results: any) => {
      this.users = results.rows;
      this.ref.detectChanges();
    })
    .catch(error => {
      this.alertService.serverError();
    });
  }

  save() {
    let user = {
      id: this.userId,
      username: this.username,
      password: this.password,
      oldPassword: this.oldPassword,
      email: this.email,
      enable: this.enable,
      fullname: this.fullname
    };

    if (this.username || this.password || this.email) {
      let promise;
      if (this.isUpdate) {
        promise = this.userService.update(this.userId, user);
      } else {
        promise = this.userService.save(user);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.opened = false;
          this.getUsers();
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
        .catch(() => {
          this.alertService.serverError();
        });
    } else {
      this.alertService.error('กรุณาระบุข้อมูลเพิ่มเติมให้ครบถ้วน');
    }
  }

  update(user: any) {
     this.userId = user.user_id;
     this.username = user.username;
     this.password = user.password;
     this.oldPassword = user.password;
     this.email = user.email;
     this.fullname = user.fullname;
     this.enable = user.enable;
     this.isUpdate = true;
     this.opened = true;
  }

  remove(u: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + u.username + ']')
      .then(() => {
        this.userService.remove(u.user_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.getUsers();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

}
