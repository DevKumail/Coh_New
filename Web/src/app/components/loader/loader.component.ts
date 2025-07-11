import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<div class="full-screen-loader"><div class="spinner"></div></div>`,
  styleUrls: ['./loader.component.scss'],
  standalone: true
})
export class LoaderComponent {}
