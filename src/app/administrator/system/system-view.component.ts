import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SystemService } from '../shares/system.service';
import { ServiceService } from '../shares/service.service';
import { RoleService } from '../shares/role.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-system-view',
  templateUrl: './system-view.component.html',
  styleUrls: ['./system-view.component.css']
})
export class SystemViewComponent implements OnInit {

  public systemId: string;
  public system: any = {};
  public systems: Array<any> = [];
  public roles: Array<any> = [];
  public services: Array<any> = [];
  private sub: any;
  public isUpdate = false;

  public service_id;
  public oldService_id;
  public system_id;
  public service_name;
  public description;
  public enable;

  public role_id;
  public oldRole_id;
  public role_name;
  public desc;




  public serviceOpened = false;
  public roleOpened = false;

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private systemService: SystemService,
    private serviceService: ServiceService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.systemId = params['id'];
       this.getSystemDetail(this.systemId);
    });
    this.getSystems();
  }

  getSystems() {
    this.systemService.all()
    .then(( results: any ) => {
      this.systems = results.rows;
      this.ref.detectChanges();
    })
    .catch( error => {
      this.alertService.serverError();
    });
  }

  getSystemDetail(systemId: string) {
     this.systemService.detail(systemId)
    .then(( results: any ) => {
      this.system = results.detail;
      if(this.system.system_id) {
        this.getServicesBySytemId(this.system.system_id);
        this.getRolesBySystemId(this.system.system_id);
      }
      this.ref.detectChanges();
    })
    .catch( error => {
      this.alertService.serverError();
    });
  }

  getRolesBySystemId(systemId: string) {
    this.roleService.allBySystemId(systemId)
    .then(( results: any ) => {
      this.roles = results.rows;
      this.ref.detectChanges();
    })
    .catch( error => {
      this.alertService.serverError();
    });
  }

  getServicesBySytemId(systemId: string) {
    this.serviceService.allBySystemID(systemId)
    .then(( results: any ) => {
      this.services = results.rows;
      this.ref.detectChanges();
    })
    .catch( error => {
      this.alertService.serverError();
    });
  }

  addNewService() {
    this.serviceOpened = true;
    this.isUpdate =  false;

    this.service_id = null;
    this.system_id = this.systemId;
    this.service_name = null;
    this.description = null;
    this.enable = null;
  }

  addNewRole() {
    this.roleOpened = true;
    this.isUpdate =  false;

    this.role_id = null;
    this.system_id = this.systemId;
    this.role_name = null;
    this.desc = null;
  }

  saveService()
  {
    let service = {
      service_id: this.service_id,
      oldService_id: this.oldService_id,
      system_id: this.systemId,
      service_name: this.service_name,
      description: this.description,
      enable: this.enable
    };

    if (this.service_id || this.system_id || this.service_name) {
      let promise;
      if (this.isUpdate) {
        promise = this.serviceService.update(this.oldService_id, service);
      } else {
        promise = this.serviceService.save(service);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.serviceOpened = false;
          this.getServicesBySytemId(this.systemId);
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

  saveRole()
  {
    let role = {
      role_id: this.role_id,
      oldRole_id: this.oldRole_id,
      system_id: this.systemId,
      role_name: this.role_name,
      desc: this.desc
    };

    if (this.role_id || this.system_id || this.role_name) {
      let promise;
      if (this.isUpdate) {
        promise = this.roleService.update(this.oldRole_id, role);
      } else {
        promise = this.roleService.save(role);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.roleOpened = false;
          this.getRolesBySystemId(this.systemId);
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

  editService(system: any) {
    this.serviceOpened = true;
    this.isUpdate = true;

    this.oldService_id = system.service_id;
    this.service_id = system.service_id;
    this.system_id = system.system_id;
    this.service_name = system.service_name;
    this.description = system.description;
    this.enable = system.enable;
  }

  editRole(role: any) {
    this.roleOpened = true;
    this.isUpdate = true;

    this.oldRole_id = role.role_id;
    this.role_id = role.role_id;
    this.system_id = role.system_id;
    this.role_name = role.role_name;
    this.desc = role.desc;
  }

  removeService(s: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + s.service_id + ']')
      .then(() => {
        this.serviceService.remove(s.service_id)
          .then((results: any) => {
            if (results.ok) {
               this.alertService.success();
               this.getServicesBySytemId(this.systemId);
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  removeRole(r: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + r.role_id + ']')
      .then(() => {
        this.roleService.remove(r.role_id)
          .then((results: any) => {
            if (results.ok) {
               this.alertService.success();
               this.getRolesBySystemId(this.systemId);
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
