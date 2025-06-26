import { Component } from '@angular/core';
import { PageTitleComponent } from "@app/components/page-title.component";
import { NgIcon } from '@ng-icons/core';
import { UiCardComponent } from "@app/components/ui-card.component";
import { DataTablesModule } from 'angular-datatables';
import {paginationIcons} from '@/app/views/tables/datatables/data';

@Component({
    selector: 'app-data-rendering',
    imports: [PageTitleComponent, NgIcon, UiCardComponent,DataTablesModule],
    templateUrl: './data-rendering.component.html',
    styles: ``
})
export class DataRenderingComponent {
    dtOptions = {
        ajax: 'assets/data/datatables-rendering.json',
        language: {
            paginate: paginationIcons
        },
        columns: [
            {
                data: 'name'
            },
            {
                data: 'position',
                render: (data: string, type: string) => {
                    if (type === 'display') {
                        let link = 'https://datatables.net';

                        if (data[0] < 'H') {
                            link = 'https://cloudtables.com';
                        } else if (data[0] < 'S') {
                            link = 'https://editor.datatables.net';
                        }

                        return `<a href="${link}">${data}</a>`;
                    }

                    return data;
                }
            },
            {
                data: 'office',
                className: 'f32',
                render: (data: string, type: string) => {
                    if (type === 'display') {
                        const flagMap: { [key: string]: string } = {
                            'Argentina': 'ar',
                            'Gujarat': 'in',
                            'Germany': 'de',
                            'London': 'gb',
                            'New York': 'us',
                            'San Francisco': 'us',
                            'Sydney': 'au',
                            'Tokyo': 'jp'
                        };

                        const countryCode = flagMap[data] || '';
                        return `<span class="flag ${countryCode}">
                        <img class="avatar-xs rounded me-2" src="assets/images/flags/${countryCode}.svg" alt="${data}" />
                      </span> ${data}`;
                    }

                    return data;
                }
            },
            {
                data: 'extn',
                render: (data: number, type: string) => {
                    return type === 'display'
                        ? `<div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="${data}" aria-valuemin="0" aria-valuemax="9999" style="height:8px">
                    <div class="progress-bar" style="width: ${(data / 9999) * 100}%"></div>
                 </div>`
                        : data;
                }
            },
            {
                data: 'start_date'
            },
            {
                data: 'salary',
                render: (data: number, type: string) => {
                    const number = (window as any).DataTable.render
                        .number(',', '.', 2, '$')
                        .display(data);

                    if (type === 'display') {
                        let color = 'green';
                        if (data < 250000) {
                            color = 'red';
                        } else if (data < 500000) {
                            color = 'orange';
                        }

                        return `<span style="color:${color}">${number}</span>`;
                    }

                    return number;
                }
            }
        ]
    };
}
