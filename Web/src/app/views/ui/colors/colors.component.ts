import { Component } from '@angular/core';
import {UiCardComponent} from '@app/components/ui-card.component';
import {PageTitleComponent} from '@app/components/page-title.component';
import {NgIcon} from '@ng-icons/core';

@Component({
  selector: 'app-colors',
    imports: [
        UiCardComponent,
        PageTitleComponent,
        NgIcon
    ],
  templateUrl: './colors.component.html',
  styles: ``
})
export class ColorsComponent {

}
