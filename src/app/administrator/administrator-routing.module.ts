import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorComponent } from './administrator.component';
import { PortalComponent } from './portal/portal.component';
import { AccountComponent } from './account/account.component';
import { HistoryComponent } from './history/history.component';

import { MophediRoleComponent } from './mophedi-role/mophedi-role.component';
import { MophediServiceComponent } from './mophedi-service/mophedi-service.component';
import { MophisRoleComponent } from './mophis-role/mophis-role.component';
import { MophisServiceComponent } from './mophis-service/mophis-service.component';
import { NmpcdRoleComponent } from './nmpcd-role/nmpcd-role.component';
import { NmpcdServiceComponent } from './nmpcd-service/nmpcd-service.component';
import { SystemComponent } from './system/system.component';
import { SystemViewComponent } from './system/system-view.component';

const routes: Routes = [
  {
    path: 'administrator',
    component: AdministratorComponent,
    children: [
      { path: '',  redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', component: PortalComponent, pathMatch: 'full'},
      { path: 'account', component: AccountComponent, pathMatch: 'full'},
      { path: 'history', component: HistoryComponent, pathMatch: 'full'},
      { path: 'systems', component: SystemComponent, pathMatch: 'full'},
      { path: 'systems/view/:id', component: SystemViewComponent, pathMatch: 'full'},
      { path: 'systems/mophedi-services', component: MophediServiceComponent, pathMatch: 'full'},
      { path: 'systems/mophedi-role', component: MophediRoleComponent, pathMatch: 'full'},
      { path: 'systems/mophis-services', component: MophisServiceComponent, pathMatch: 'full'},
      { path: 'systems/mophis-role', component: MophisRoleComponent, pathMatch: 'full'},
      { path: 'systems/nmpcd-services', component: NmpcdServiceComponent, pathMatch: 'full'},
      { path: 'systems/nmpcd-role', component: NmpcdRoleComponent, pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
