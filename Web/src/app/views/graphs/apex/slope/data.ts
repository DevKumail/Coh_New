import {getColor} from "@/app/utils/color-utils";
import {ApexOptions} from "ng-apexcharts";

export const basicSlopeChart: () => ApexOptions = () => ({
    series: [
        {
            name: 'Product A',
            data: [
                {x: 'Jan', y: 120},
                {x: 'Feb', y: 160},
            ],
        },
        {
            name: 'Product B',
            data: [
                {x: 'Jan', y: 90},
                {x: 'Feb', y: 130},
            ],
        },
        {
            name: 'Product C',
            data: [
                {x: 'Jan', y: 150},
                {x: 'Feb', y: 100},
            ],
        },
    ],
    colors: [getColor('success'), getColor('warning'), getColor('danger')],
    chart: {
        height: 350,
        width: '100%',
        type: 'line',
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        line: {
            isSlopeChart: true,
        },
    },
    xaxis: {
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            }
        }
    }

})

export const multiSlopeChart: () => ApexOptions = () => ({
    series: [
        {
            name: 'Desktop',
            data: [
                {x: 'Page Views', y: 1200},
                {x: 'Unique Visitors', y: 950},
                {x: 'Conversions', y: 300},
            ],
        },
        {
            name: 'Tablet',
            data: [
                {x: 'Page Views', y: 900},
                {x: 'Unique Visitors', y: 600},
                {x: 'Conversions', y: 220},
            ],
        },
        {
            name: 'Mobile',
            data: [
                {x: 'Page Views', y: 1600},
                {x: 'Unique Visitors', y: 1100},
                {x: 'Conversions', y: 500},
            ],
        },
        {
            name: 'Other Devices',
            data: [
                {x: 'Page Views', y: 300},
                {x: 'Unique Visitors', y: 250},
                {x: 'Conversions', y: 100},
            ],
        },
    ],
    chart: {
        height: 350,
        width: 600,
        type: 'line',
    },
    colors: [getColor('secondary'), getColor('purple'), getColor('info'), getColor('warning')],
    plotOptions: {
        line: {
            isSlopeChart: true,
        },
    },
    tooltip: {
        followCursor: true,
        intersect: false,
        shared: true,
    },
    dataLabels: {
        background: {
            enabled: true,
        },
        formatter(val, opts) {
            const seriesName = opts.w.config.series[opts.seriesIndex].name
            return val !== null ? seriesName : ''
        },
    },
    yaxis: {
        show: true,
        labels: {
            show: true,
        },
    },
    xaxis: {
        position: 'bottom',
        labels: {
            style: {
                fontSize: '14px',
                fontWeight: 500,
            }
        }
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
    },
    stroke: {
        width: [2, 3, 4, 2],
        dashArray: [0, 0, 5, 2],
        curve: 'smooth',
    }
})

