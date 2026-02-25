import { Component } from '@angular/core';
import { routes } from '../../../core/core.index';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
    imports: [RouterLink,CommonModule]
})
export class EmailComponent {
  routes=routes
  checkAll: boolean = false;
  checkbox1: boolean = false;
  checkbox2: boolean = false;
  checkbox3: boolean = false;
  checkbox4: boolean = false;
  checkbox5: boolean = false;
  checkbox6: boolean = false;
  checkbox7: boolean = false;
  checkbox8: boolean = false;
  checkbox9: boolean = false;
  checkbox10: boolean = false;
  emailcompose: boolean = false;
  toggleEmailCompose() {
    this.emailcompose = !this.emailcompose;
  }
  showMore: boolean[] = [false];
  toggleShowMore(i:number) {
    this.showMore[i] = !this.showMore[i];
  }
  toggleAllCheckboxes() {
    this.checkbox1 = this.checkAll;
    this.checkbox2 = this.checkAll;
    this.checkbox3 = this.checkAll;
    this.checkbox4 = this.checkAll;
    this.checkbox5 = this.checkAll;
    this.checkbox6 = this.checkAll;
    this.checkbox7 = this.checkAll;
    this.checkbox8 = this.checkAll;
    this.checkbox9 = this.checkAll;
    this.checkbox10 = this.checkAll;
  }
}
