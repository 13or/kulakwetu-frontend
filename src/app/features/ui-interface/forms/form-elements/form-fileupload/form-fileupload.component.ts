import { Component } from '@angular/core';
import { routes } from '../../../../../core/core.index';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgxFileDropModule } from 'ngx-file-drop';
@Component({
    selector: 'app-form-fileupload',
    templateUrl: './form-fileupload.component.html',
    styleUrls: ['./form-fileupload.component.scss'],
    imports: [NgxDropzoneModule,RouterLink,DecimalPipe,NgxFileDropModule,CommonModule]
})
export class FormFileuploadComponent {
  public routes = routes;
  singleFile: File[] = [];
  multipleFiles: File[] = [];
  files: any[] = [];

  onSelect(event: NgxDropzoneChangeEvent) {
    for (const file of event.addedFiles) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.files.push({
          file: file,
          preview: e.target.result  // Base64 preview
        });
      };

      reader.readAsDataURL(file);
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }
}
