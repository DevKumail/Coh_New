import {Component, Input} from '@angular/core';
import {CountUpModule} from 'ngx-countup';
import { CommonModule } from '@angular/common';

import {EchartComponent} from '@app/components/echart.component';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { Roles } from '../../../../../shared/enum/roles.enum';

@Component({
    selector: 'app-statistics-widget',
    imports: [CommonModule, CountUpModule, EchartComponent, NgIcon, RouterLink],
    templateUrl: './statistics-widget.component.html',
})
export class StatisticsWidgetComponent {
    @Input() item!: any

    Roles = Roles;
    currentRoleId: number = Number(sessionStorage.getItem('empId') || 0);

    // Decide visibility per item title. Adjust mappings as needed.
    canShowItem(item: any): boolean {
        if (!item) return true;
        const title = (item.title || '').toString().toLowerCase();

        // Notes: only Provider or Nurse
        if (title.includes('notes')) {
            return this.currentRoleId === Roles.Provider || this.currentRoleId === Roles.Nurse;
        }

        // Billed: only Biller
        if (title.includes('billed')) {
            return this.currentRoleId === Roles.Biller;
        }

        // Appointments, Messages, My Task -> visible to everyone
        // Otherwise default allow
        return true;
    }
}
