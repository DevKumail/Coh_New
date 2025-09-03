import {Component, Input} from '@angular/core';
import {CountUpModule} from 'ngx-countup';
import { CommonModule } from '@angular/common';

import {EchartComponent} from '@app/components/echart.component';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-statistics-widget',
    imports: [CommonModule, CountUpModule, EchartComponent, NgIcon, RouterLink],
    templateUrl: './statistics-widget.component.html',
})
export class StatisticsWidgetComponent {
    @Input() item!: any
}
