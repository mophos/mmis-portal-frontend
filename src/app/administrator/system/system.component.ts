import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../shares/system.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

  systems: Array<any> = [];

  constructor(
    private systemService: SystemService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
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

}
