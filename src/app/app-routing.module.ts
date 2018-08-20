import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PortalComponent } from './portal/portal.component';
import { ReportComponent } from './report/report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManualComponent } from './manual/manual.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'portal',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      // { path: '', redirectTo: 'report', pathMatch: 'full'},
      { path: 'index', component: PortalComponent },
      { path: 'report', component: ReportComponent },
      { path: 'manual', component: ManualComponent },
      { path: 'dashboard', component: DashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
