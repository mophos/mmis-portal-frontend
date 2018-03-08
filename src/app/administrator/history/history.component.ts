import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LogService } from '../shares/log.service';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  logs: Array<any> = [];

  constructor(
    private logService: LogService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
     this.logService.all()
    .then((results: any) => {
      this.logs = results.rows;
      this.ref.detectChanges();
    })
    .catch(error => {
      this.alertService.serverError();
    });
  }

}
