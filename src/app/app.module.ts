import { DashboardService } from './services/dashboard.service';
import { PurchasingService } from './services/purchasing.service';
import { BrowserModule,  } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdministratorModule } from './administrator/administrator.module';
import { ClarityModule } from 'clarity-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyDatePickerTHModule } from 'mydatepicker-th';
// import { ChartsModule } from 'ng2-charts/ng2-charts';

import { environment } from '../environments/environment';

import { LoginModule } from './login/login.module';
import { AdminModule } from './admin/admin.module';
import { AuthGuard } from './auth-guard.service';
import { AlertService } from './alert.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PortalComponent } from './portal/portal.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

declare var require: any; // highcharts

import { ChartModule } from 'angular2-highcharts'
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { ReportComponent } from './report/report.component';
import { InventoryService } from './services/inventory.service';
import { MaterialService } from './services/material.service';
import { ContractsService } from './services/contracts.service';
import { HelperModule } from './helper/helper.module';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PortalComponent,
    LayoutComponent,
    DashboardComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot(),
    ChartModule,
    AdministratorModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,
    AdminModule,
    MyDatePickerTHModule,
    HelperModule
  ],
  providers: [
    AuthGuard,
    DashboardService,
    PurchasingService,
    InventoryService,
    MaterialService,
    ContractsService,
    AlertService,
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: 'PURCHASING_URL', useValue: environment.purchasingUrl },
    { provide: 'UM_LOGIN_URL', useValue: environment.umLoginUrl },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HighchartsStatic, useFactory: highchartsFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function highchartsFactory() {
  return require('highcharts');
}
const Highcharts = require('highcharts');

Highcharts.setOptions({
  credits: false
});
