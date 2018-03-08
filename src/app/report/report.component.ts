import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../alert.service';
import { PurchasingService } from '../services/purchasing.service';
import { InventoryService } from '../services/inventory.service';
import { MaterialService } from '../services/material.service';
import { ContractsService } from '../services/contracts.service';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';

import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  };

  url = 'localhost:3009'

  pReport1: boolean = false;

  startDate: any;
  endDate: any;

  bgdetailId: any;
  statusPo: any;

  bgsubType: any = [];

  constructor(
    private alertService: AlertService,
    private purchasingService: PurchasingService,
    private inventoryService: InventoryService,
    private materialService: MaterialService,
    private contractsService: ContractsService
  ) { }

  ngOnInit() {
    const date = new Date();
    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }
    };
    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
  }

  purchasingReport1() {
    this.pReport1 = true;
    this.purchasingService.getSubtype()
      .then((results) => {
        this.bgsubType = results.rows;
      })
      .catch((error) => {
        this.pReport1 = false;
        this.alertService.error(JSON.stringify(error));
      })
  }

  async printReport1() {
    const sDate = moment(this.startDate.date).format('YYYYMMDD');
    const eDate = moment(this.endDate.date).format('YYYYMMDD');
    let showUrl = this.url + '/report/purchasing/' + sDate + '/' + eDate + '/' + this.bgdetailId + '/' + this.statusPo;
    this.htmlPreview.showReport(showUrl);
    this.pReport1 = false;
  }
}