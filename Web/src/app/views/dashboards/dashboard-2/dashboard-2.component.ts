import {Component} from '@angular/core';
import {PageTitleComponent} from '@app/components/page-title.component';
import {
    StatisticsWidgetComponent
} from '@/app/views/dashboards/dashboard-2/components/statistics-widget/statistics-widget.component';
import {
    OrderStatisticsComponent
} from '@/app/views/dashboards/dashboard-2/components/order-statistics/order-statistics.component';
import {
    ProductInventoryComponent
} from '@/app/views/dashboards/dashboard-2/components/product-inventory/product-inventory.component';
import {
    RecentOrdersComponent
} from '@/app/views/dashboards/dashboard-2/components/recent-orders/recent-orders.component';
import {TransactionsComponent} from '@/app/views/dashboards/dashboard-2/components/transactions/transactions.component';
import { StatisticsWidgetType } from './types';
import { StatisticWidget1Type } from '@/app/types';
import { Roles } from '@/app/shared/enum/roles.enum';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
 

@Component({
    selector: 'app-dashboard-2',
    imports: [
        PageTitleComponent,
        StatisticsWidgetComponent,
        OrderStatisticsComponent,
        TranslatePipe,
        // ProductInventoryComponent,
        // RecentOrdersComponent,
        // TransactionsComponent
    ],
    templateUrl: './dashboard-2.component.html',
})
export class Dashboard2Component {


    // Hardcoded color palettes (edit these to your preference)
    private allAppointmentColors: string[] = [
        '#FF6B6B', // Not Yet Arrived
        '#4D96FF', // Check In
        '#F59E0B', // Ready
        '#06D6A0', // Seen
        '#8338EC', // Billed
        '#EF476F', // Check Out
    ];

    private notesColors: string[] = [
        '#F59E0B', // Pending
        '#10B981', // Completed
    ];

    private resultColors: string[] = [
        '#0EA5E9', // Review
        '#EF4444', // Non Review
    ];

    private billingColors: string[] = [
        '#22C55E', // Paid
        '#F59E0B', // Unpaid
    ];

    // Editable data sources (modify these arrays as needed)
    AllAppoinment = {
        salesData : [
            { name: 'Not Yet Arrived', value: 15 },
            { name: 'Check In', value: 20 },
            { name: 'Ready', value: 10 },
            { name: 'Seen', value: 15 },
            { name: 'Billed', value: 15 },
            { name: 'Check Out', value: 20 },
        ],
        title : 'Appointment',
        value: 95,
    }

    Notes = {
        Data : [
            { name: 'Pending', value: 100 },
            { name: 'Completed', value: 50 }
        ],
        title : 'Notes',
        value: 150,
    }

    Result = {
        Data : [
            { name: 'Review', value: 70 },
            { name: 'Non Review', value: 40 }
        ],
        title : 'Result',
        value: 110,
    }


    Billing = {
        Data : [
            { name: 'Paid', value: 40 },
            { name: 'Unpaid', value: 10 }
        ],
        title: 'Billed',
        value: 50
    }

    statistics: any[] = [
        {
            showpie: true,
            title: this.AllAppoinment?.title,
            badge: {text: 'Daily', variant: 'success'},
            value: this.AllAppoinment?.value,
            description: 'Today Total Appoinment',
            chartOptions: () => ({
                tooltip: {
                    show: true,
                    // trigger: 'item',
                    confine: true,
                    // position: 'right'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['65%', '100%'],
                        hoverAnimation: false,
                        label: {show: false, position: 'outside', formatter: '{b}: {c}%', fontSize: 8},
                        labelLine: {show: true, length: 4, length2: 4},
                        data: this.AllAppoinment?.salesData?.map((item, index) => ({
                            name: item.name,
                            value: item.value,
                            itemStyle: {
                                color: this.allAppointmentColors[index % this.allAppointmentColors.length]
                            }
                        }))
                    }
                ]
            })
        },
        {
            showpie: true,
            title: this.Notes?.title,
            badge: {text: 'Monthly', variant: 'primary'},
            value: this.Notes?.value,
            description: 'Monthly Total Notes',
            chartOptions: () => ({
                tooltip: {
                    show: true,
                    // trigger: 'item',
                    confine: true,
                    // position: 'right'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['65%', '100%'],
                        hoverAnimation: false,
                        label: {show: false, position: 'outside', formatter: '{b}: {c}%', fontSize: 8},
                        labelLine: {show: true, length: 4, length2: 4},
                        data: this.Notes.Data.map((item, index) => ({
                            name: item.name,
                            value: item.value,
                            itemStyle: {
                                color: this.notesColors[index % this.notesColors.length]
                            }
                        }))
                    }
                ]
            })
        },
        {
            showpie: true,
            title: this.Billing?.title,
            badge: {text: 'Monthly', variant: 'primary'},
            value: this.Billing?.value,
            description: 'Monthly Total Billed',
            chartOptions: () => ({
                tooltip: {
                    show: true,
                    // trigger: 'item',
                    confine: true,
                    // position: 'right'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['65%', '100%'],
                        hoverAnimation: false,
                        label: {show: false, position: 'outside', formatter: '{b}: {c}%', fontSize: 8},
                        labelLine: {show: true, length: 4, length2: 4},
                        data: this.Billing.Data.map((item, index) => ({
                            name: item.name,
                            value: item.value,
                            itemStyle: {
                                color: this.notesColors[index % this.notesColors.length]
                            }
                        }))
                    }
                ]
            })
        },
        // {
        //     showpie: true,
        //     title: this.Billing?.title,
        //     badge: {text: 'Daily', variant: 'warning'},
        //     value: this.Billing?.value,
        //     // prefix: '$',
        //     // suffix: 'K',
        //     description: 'Today Total Billed',
        //     chartOptions: () => ({
        //         tooltip: {show: true},
        //         series: [
        //             {
        //                 type: 'pie',
        //                 radius: ['65%', '100%'],
        //                 hoverAnimation: false,
        //                 label: {show: true},
        //                 labelLine: {show: false},
        //                 data: this.Billing?.Data?.map((item, index) => ({
        //                     value:  item.value,
        //                     itemStyle: {
        //                             color: this.billingColors[index % this.billingColors.length]
        //                     }
        //                 }))
        //             }
        //         ]
        //     })
        // },
        {
            showpie: false,
            title: 'My_Tasks',
            description: 'Total Tasks',
            label: '+3 New',
            icon: 'tablerChecklist',
            count: {value: 124},
            variant: 'primary',
            totalCount: {value: 12450}
        },
        {
            showpie: false,
            title: 'Messages',
            description: 'Total Messages',
            label: '+5 New',
            icon: 'tablerMessageCircle',
            count: {value: 69.5, suffix: 'k'},
            variant: 'purple',
            totalCount: {value: 32.1, suffix: 'M'}
        }
    ]


    getappoinmentdashboardcount(){

    }    

    // Role-based filtering: compute current role and helper to decide visibility
    currentRoleId: number = Number(sessionStorage.getItem('empId') || 0);
    private canShow(item: any): boolean {
        const title = (item?.title || '').toString().toLowerCase();
        // Notes visible only to Provider or Nurse
        if (title.includes('notes')) {
            return this.currentRoleId === Roles.Provider || this.currentRoleId === Roles.Nurse;
        }
        // Billed visible only to Biller (if enabled in list in the future)
        if (title.includes('billed')) {
            return this.currentRoleId === Roles.Biller;
        }
        // Appointment, My Tasks, Messages -> visible to all by default
        return true;
    }
    get visibleStatistics() {
        return (this.statistics || []).filter(i => this.canShow(i));
    }

    // defaultStatisticWidgets: StatisticWidget1Type[] = [
    //     {
    //         title: 'My Tasks',
    //         description: 'Total Tasks',
    //         label: '+3 New',
    //         icon: 'tablerChecklist',
    //         count: {value: 124},
    //         variant: 'primary',
    //         totalCount: {value: 12450}
    //     },
    //     {
    //         title: 'Messages',
    //         description: 'Total Messages',
    //         label: '+5 New',
    //         icon: 'tablerMessageCircle',
    //         count: {value: 69.5, suffix: 'k'},
    //         variant: 'purple',
    //         totalCount: {value: 32.1, suffix: 'M'}
    //     }
    // ];
    
    // statistics = statistics;
}

