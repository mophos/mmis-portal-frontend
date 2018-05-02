import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styles: []
})
export class ManualComponent implements OnInit {

  constructor(
    @Inject('API_URL') private apiUrl: string
  ) { }

  ngOnInit() {
  }

  downloadManualAdmin() {
    const url = `${this.apiUrl}/pdf/ManualAdmin.pdf`;
    window.open(url, '_blank');
  }

  downloadManualStaff() {
    const url = `${this.apiUrl}/pdf/ManualStaff.pdf`;
    window.open(url, '_blank');
  }

  downloadTemplate() {
    const url = `${this.apiUrl}/pdf/template.xlsx`;
    window.open(url, '_blank');
  }

  downloadTemplateBlank() {
    const url = `${this.apiUrl}/pdf/template_blank.xlsx`;
    window.open(url, '_blank');
  }
}
