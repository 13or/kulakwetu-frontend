import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { CommonModule } from '@angular/common';
import { LightgalleryModule } from 'lightgallery/angular';
import { routes } from '../../../core/core.index';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-reply',
  imports: [RouterLink,LightgalleryModule,CommonModule,FormsModule],
  templateUrl: './email-reply.component.html',
  styleUrl: './email-reply.component.scss',
})
export class EmailReplyComponent {
  routes=routes
  constructor(private router: Router){}
  emailcompose: boolean = false;
  toggleEmailCompose() {
    this.emailcompose = !this.emailcompose;
  }
  showMore: boolean[] = [false];
  toggleShowMore(i:number) {
    this.showMore[i] = !this.showMore[i];
  }
  onSubmit() {
    this.router.navigate([routes.email]);
  }

}
