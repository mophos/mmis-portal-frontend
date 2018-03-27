import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../auth-guard.service';
import { ClarityModule } from 'clarity-angular';
import { AdministratorRoutingModule } from './administrator-routing.module';
import { AdministratorComponent } from './administrator.component';
import { PortalComponent } from './portal/portal.component';
import { AccountComponent } from './account/account.component';
import { HistoryComponent } from './history/history.component';
import { MophediServiceComponent } from './mophedi-service/mophedi-service.component';
import { MophediRoleComponent } from './mophedi-role/mophedi-role.component';
import { MophisRoleComponent } from './mophis-role/mophis-role.component';
import { MophisServiceComponent } from './mophis-service/mophis-service.component';
import { NmpcdServiceComponent } from './nmpcd-service/nmpcd-service.component';
import { NmpcdRoleComponent } from './nmpcd-role/nmpcd-role.component';
import { SystemComponent } from './system/system.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from './account/user.service';
import { AlertService } from './alert.service';
import { LogService } from './shares/log.service';
import { ServiceService } from './shares/service.service';
import { SystemService } from './shares/system.service';
import { RoleService } from './shares/role.service';
import { SystemViewComponent } from './system/system-view.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    AdministratorRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdministratorComponent,
    PortalComponent,
    AccountComponent,
    HistoryComponent,
    MophediServiceComponent,
    MophediRoleComponent,
    MophisRoleComponent,
    MophisServiceComponent,
    NmpcdServiceComponent,
    NmpcdRoleComponent,
    SystemComponent,
    SystemViewComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    UserService,
    LogService,
    RoleService,
    ServiceService,
    SystemService
  ]
})
export class AdministratorModule { }
