import {getColor} from "@/app/utils/color-utils";
import {ApexOptions} from "ng-apexcharts"


function generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    let i = 0;
    const series = [];
    while (i < count) {
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([baseval, y]);
        baseval += 86400000;
        i++;
    }
    return series;
}

export const basicScatter: () => ApexOptions = () => ({
    chart: {
        height: 380,
        type: 'scatter',
        zoom: {
            enabled: false
        },
        toolbar: {show: false}
    },
    series: [{
        name: "Device A",
        data: [
            [5, 3], [10, 15], [15, 7], [18, 5], [12, 8], [20, 12], [25, 6],
            [30, 10], [35, 4], [40, 13], [22, 9], [26, 7]
        ]
    }, {
        name: "Device B",
        data: [
            [6, 20], [12, 18], [14, 16], [17, 15], [19, 14], [21, 13],
            [23, 12], [25, 11], [28, 10], [30, 9], [32, 8], [34, 7]
        ]
    }, {
        name: "Device C",
        data: [
            [5, 8], [9, 7], [12, 6], [16, 5], [18, 4], [22, 3],
            [26, 2], [30, 1], [34, 0.5], [38, 0.2], [40, 0]
        ]
    }],
    colors: [getColor('primary'), getColor('warning'), getColor('danger')],
    xaxis: {
        tickAmount: 10,
    },
    yaxis: {
        tickAmount: 7
    },
    grid: {
        borderColor: getColor('border-color'),
        padding: {
            right: 20
        }
    },
    legend: {
        offsetY: 5,
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            legend: {
                show: false
            },
        }
    }]
})

export const datetimeScatter: () => ApexOptions = () => ({
    chart: {
        height: 380,
        type: 'scatter',
        zoom: {
            type: 'xy'
        }
    },
    series: [
        {
            name: 'Server A',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2025 GMT').getTime(), 20, {
                min: 10,
                max: 60
            })
        },
        {
            name: 'Server B',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2025 GMT').getTime(), 20, {
                min: 10,
                max: 60
            })
        },
        {
            name: 'Server C',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2025 GMT').getTime(), 30, {
                min: 10,
                max: 60
            })
        },
        {
            name: 'Server D',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2025 GMT').getTime(), 10, {
                min: 10,
                max: 60
            })
        },
        {
            name: 'Server E',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2025 GMT').getTime(), 30, {
                min: 10,
                max: 60
            })
        }
    ],
    colors: [getColor('secondary'), getColor('purple'), getColor('info'), getColor('gray'), getColor('pink')],
    dataLabels: {
        enabled: false
    },
    grid: {
        borderColor: getColor('border-color'),
        padding: {
            right: 20,
            bottom: 5,
        },

    },
    legend: {
        offsetY: 10,
    },
    xaxis: {
        type: 'datetime',

    },
    yaxis: {
        max: 70
    },
})

export const scatterImages: () => ApexOptions = () => ({
    chart: {
        height: 380,
        type: 'scatter',
        animations: {
            enabled: false,
        },
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false
        }
    },
    series: [
        {
            name: 'Microsoft',
            data: [
                [5, 10], [10, 14], [15, 11], [18, 16], [20, 9],
                [25, 18], [30, 12], [35, 14], [38, 17], [40, 13]
            ]
        },
        {
            name: 'Google',
            data: [
                [4, 6], [9, 10], [13, 12], [17, 9], [21, 13],
                [26, 11], [29, 15], [33, 8], [37, 16], [39, 14]
            ]
        }
    ],
    xaxis: {
        tickAmount: 10,
        min: 0,
        max: 40
    },
    yaxis: {
        tickAmount: 7
    },
    markers: {
        size: 20
    },
    fill: {
        type: 'image',
        opacity: 1,
        image: {
            src: ['assets/images/logos/microsoft.svg', 'assets/images/logos/google.svg'],
            width: 40,
            height: 40
        }
    },
    legend: {
        labels: {
            useSeriesColors: true
        },
        offsetY: 5
    },
    grid: {padding: {right: 20}}
})
