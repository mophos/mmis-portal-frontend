import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToThaiDatePipe } from './to-thai-date.pipe';
import { HtmlPreviewComponent } from './html-preview/html-preview.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ToThaiDatePipe, 
    HtmlPreviewComponent
  ],
  exports: [
    ToThaiDatePipe, 
    HtmlPreviewComponent
  ]
})
export class HelperModule { }
