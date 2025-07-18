import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgxEchartsDirective, provideEchartsCore} from 'ngx-echarts';
import type {EChartsType} from 'echarts/core';
import {echarts} from '@/app/config/echarts-config';
import {EChartsOption} from 'echarts';
import {CommonModule} from '@angular/common';
import {LayoutStoreService} from '@core/services/layout-store.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-echart',
    imports: [NgxEchartsDirective, CommonModule],
    providers: [provideEchartsCore({echarts})],
    template: `
        <div echarts [options]="options" [autoResize]="true"
             [ngStyle]="{ minHeight: height, width: width }" (chartInit)="onChartInit($event)"></div>
    `
})
export class EchartComponent implements OnInit, OnDestroy {
    @Input() getOptions!: () => EChartsOption;
    @Input() height: string = '300px';
    @Input() width: string = 'auto';
    @Output() chartInit = new EventEmitter<EChartsType>();

    options!: EChartsOption;

    layout = inject(LayoutStoreService);

    private layoutSub!: Subscription;

    ngOnInit(): void {
        this.options = this.getOptions();

        // refresh chart on theme and skin change
        this.layoutSub = this.layout.layoutState$.subscribe(state => {
            const skin = state.skin;
            const theme = state.theme;
            this.options = this.getOptions();
        });
    }

    ngOnDestroy(): void {
        this.layoutSub?.unsubscribe();
    }

    onChartInit(instance: EChartsType) {
        this.chartInit.emit(instance);
    }
}
