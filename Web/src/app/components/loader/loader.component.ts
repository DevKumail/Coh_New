import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
  <!-- <div class="full-screen-loader"><div class="spinner"></div></div> -->
 <div class="col">

                            <div class="sk-swing mx-auto">
                                <div class="sk-swing-dot"></div>
                                <div class="sk-swing-dot"></div>
                            </div>
                        </div>


  `,
  styleUrls: ['./loader.component.scss'],
  standalone: true
})
export class LoaderComponent {}
