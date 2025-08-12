import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-loader',
  template: `
    <div [ngClass]="{
      'full-screen-loader': fullscreen,
      'table-loader': !fullscreen && centered,
      'inline-loader': !fullscreen && !centered
    }">
      <div class="spinner" [ngStyle]="{ width: size, height: size }"></div>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle]
})
export class LoaderComponent {
  @Input() fullscreen: boolean = false;
  @Input() centered: boolean = false;
  @Input() size: string = '24px'; // Allow custom size like '16px', '32px', etc.
}
