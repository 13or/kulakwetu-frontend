/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { routes } from '../../../../core/core.index';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ui-lightbox',
    templateUrl: './ui-lightbox.component.html',
    styleUrls: ['./ui-lightbox.component.scss'],
    imports: [RouterLink,CommonModule,LightboxModule]
})
export class UiLightboxComponent {
  public routes = routes;
  public albumsOne: any = [];
  public albumsTwo: any = [];

  constructor(private _lightbox: Lightbox) {
    for (let i = 1; i <= 5; i++) {
      const src = 'assets/img/img-0' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';

      this.albumsOne.push({ src: src });
      this.albumsTwo.push({ src: src, caption: caption });
    }
  }

  open(index: number, albumArray: Array<any>): void {
    this._lightbox.open(albumArray, index);
  }

  close(): void {
    this._lightbox.close();
  }
}
