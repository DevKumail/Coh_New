import {getColor} from "@/app/utils/color-utils";
import moment from "moment";
import {ApexOptions} from "ng-apexcharts";
import {dataSeries, githubData} from "./github-data";

export const basicAreaChart: () => ApexOptions = () => ({
    chart: {
        height: 380, type: 'area', toolbar: {show: false},
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 2, curve: 'straight'
    },
    colors: [getColor('primary')], series: [{
        name: "getColorpinia",
        data: [110, 110, 95, 95, 85, 85, 95, 95, 115, 115, 100, 100, 115, 116, 95, 95, 65, 85, 90]
    }],
    xaxis: {
        categories: ["", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM", "12 AM", ""],
        axisBorder: {show: false},
        axisTicks: {show: false},
        tickAmount: 6,
        labels: {
            style: {
                fontSize: "12px"
            }
        }
    },
    yaxis: {
        opposite: false, tickAmount: 12,
    },
    tooltip: {
        shared: true, y: {
            formatter: function (val) {
                return val + " Sales";
            }
        }
    },
    legend: {
        horizontalAlign: 'left'
    },
    grid: {
        borderColor: getColor('border-color')
    }
});

export const splineAreaChart: () => ApexOptions = () => ({
    chart: {
        height: 380, type: 'area', toolbar: {show: false}
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 3, curve: 'smooth'
    },
    colors: [getColor('danger'), getColor('blue')], series: [{
        name: 'iPhone 16',
        data: [110, 110, 95, 95, 85, 85, 95, 95, 115, 115, 100, 100, 115, 115, 95, 95, 85, 85, 90]
    }, {
        name: 'iPhone 16 Pro', data: [80, 80, 60, 60, 45, 45, 80, 80, 70, 70, 90, 90, 80, 80, 80, 60, 60, 65, 50]
    }],
    legend: {
        offsetY: 5,
    },
    xaxis: {
        categories: ["", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM", "12 AM", ""],
        axisBorder: {show: false},
        axisTicks: {show: false},
        tickAmount: 6,
        labels: {
            style: {
                fontSize: "12px"
            }
        }
    }, tooltip: {
        shared: true, y: {
            formatter: function (val) {
                return val + " Orders";
            }
        }
    }, fill: {
        type: "gradient", gradient: {
            shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.2, stops: [15, 120, 100]
        }
    }, grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        }, borderColor: getColor('border-color'), padding: {
            bottom: 5
        }
    }
});

export const datetimeAreaChart: () => ApexOptions = () => ({
    annotations: {
        yaxis: [{
            y: 30, borderColor: getColor('border-color'), label: {
                show: true, text: 'Support', style: {
                    color: "#fff", background: getColor('danger')
                }
            }
        }], xaxis: [{
            x: new Date('14 Nov 2012').getTime(), borderColor: getColor('border-color'), yAxisIndex: 0, label: {
                show: true, text: 'Rally', style: {
                    color: "#fff", background: getColor('warning'),
                }
            }
        }]
    },
    chart: {
        type: 'area', height: 350, toolbar: {show: false}
    },
    stroke: {
        width: 3, curve: 'smooth'
    },
    colors: [getColor('secondary')], dataLabels: {
        enabled: false
    },
    series: [{
        name: "Inspinia",
        data: [[1327359600000, 30.95], [1327446000000, 31.34], [1327532400000, 31.18], [1327618800000, 31.05], [1327878000000, 31.00], [1327964400000, 30.95], [1328050800000, 31.24], [1328137200000, 31.29], [1328223600000, 31.85], [1328482800000, 31.86], [1328569200000, 32.28], [1328655600000, 32.10], [1328742000000, 32.65], [1328828400000, 32.21], [1329087600000, 32.35], [1329174000000, 32.44], [1329260400000, 32.46], [1329346800000, 32.86], [1329433200000, 32.75], [1329778800000, 32.54], [1329865200000, 32.33], [1329951600000, 32.97], [1330038000000, 33.41], [1330297200000, 33.27], [1330383600000, 33.27], [1330470000000, 32.89], [1330556400000, 33.10], [1330642800000, 33.73], [1330902000000, 33.22], [1330988400000, 31.99], [1331074800000, 32.41], [1331161200000, 33.05], [1331247600000, 33.64], [1331506800000, 33.56], [1331593200000, 34.22], [1331679600000, 33.77], [1331766000000, 34.17], [1331852400000, 33.82], [1332111600000, 34.51], [1332198000000, 33.16], [1332284400000, 33.56], [1332370800000, 33.71], [1332457200000, 33.81], [1332712800000, 34.40], [1332799200000, 34.63], [1332885600000, 34.46], [1332972000000, 34.48], [1333058400000, 34.31], [1333317600000, 34.70], [1333404000000, 34.31], [1333490400000, 33.46], [1333576800000, 33.59], [1333922400000, 33.22], [1334008800000, 32.61], [1334095200000, 33.01], [1334181600000, 33.55], [1334268000000, 33.18], [1334527200000, 32.84], [1334613600000, 33.84], [1334700000000, 33.39], [1334786400000, 32.91], [1334872800000, 33.06], [1335132000000, 32.62], [1335218400000, 32.40], [1335304800000, 33.13], [1335391200000, 33.26], [1335477600000, 33.58], [1335736800000, 33.55], [1335823200000, 33.77], [1335909600000, 33.76], [1335996000000, 33.32], [1336082400000, 32.61], [1336341600000, 32.52], [1336428000000, 32.67], [1336514400000, 32.52], [1336600800000, 31.92], [1336687200000, 32.20], [1336946400000, 32.23], [1337032800000, 32.33], [1337119200000, 32.36], [1337205600000, 32.01], [1337292000000, 31.31], [1337551200000, 32.01], [1337637600000, 32.01], [1337724000000, 32.18], [1337810400000, 31.54], [1337896800000, 31.60], [1338242400000, 32.05], [1338328800000, 31.29], [1338415200000, 31.05], [1338501600000, 29.82], [1338760800000, 30.31], [1338847200000, 30.70], [1338933600000, 31.69], [1339020000000, 31.32], [1339106400000, 31.65], [1339365600000, 31.13], [1339452000000, 31.77], [1339538400000, 31.79], [1339624800000, 31.67], [1339711200000, 32.39], [1339970400000, 32.63], [1340056800000, 32.89], [1340143200000, 31.99], [1340229600000, 31.23], [1340316000000, 31.57], [1340575200000, 30.84], [1340661600000, 31.07], [1340748000000, 31.41], [1340834400000, 31.17], [1340920800000, 32.37], [1341180000000, 32.19], [1341266400000, 32.51], [1341439200000, 32.53], [1341525600000, 31.37], [1341784800000, 30.43], [1341871200000, 30.44], [1341957600000, 30.20], [1342044000000, 30.14], [1342130400000, 30.65], [1342389600000, 30.40], [1342476000000, 30.65], [1342562400000, 31.43], [1342648800000, 31.89], [1342735200000, 31.38], [1342994400000, 30.64], [1343080800000, 30.02], [1343167200000, 30.33], [1343253600000, 30.95], [1343340000000, 31.89], [1343599200000, 31.01], [1343685600000, 30.88], [1343772000000, 30.69], [1343858400000, 30.58], [1343944800000, 32.02], [1344204000000, 32.14], [1344290400000, 32.37], [1344376800000, 32.51], [1344463200000, 32.65], [1344549600000, 32.64], [1344808800000, 32.27], [1344895200000, 32.10], [1344981600000, 32.91], [1345068000000, 33.65], [1345154400000, 33.80], [1345413600000, 33.92], [1345500000000, 33.75], [1345586400000, 33.84], [1345672800000, 33.50], [1345759200000, 32.26], [1346018400000, 32.32], [1346104800000, 32.06], [1346191200000, 31.96], [1346277600000, 31.46], [1346364000000, 31.27], [1346709600000, 31.43], [1346796000000, 32.26], [1346882400000, 32.79], [1346968800000, 32.46], [1347228000000, 32.13], [1347314400000, 32.43], [1347400800000, 32.42], [1347487200000, 32.81], [1347573600000, 33.34], [1347832800000, 33.41], [1347919200000, 32.57], [1348005600000, 33.12], [1348092000000, 34.53], [1348178400000, 33.83], [1348437600000, 33.41], [1348524000000, 32.90], [1348610400000, 32.53], [1348696800000, 32.80], [1348783200000, 32.44], [1349042400000, 32.62], [1349128800000, 32.57], [1349215200000, 32.60], [1349301600000, 32.68], [1349388000000, 32.47], [1349647200000, 32.23], [1349733600000, 31.68], [1349820000000, 31.51], [1349906400000, 31.78], [1349992800000, 31.94], [1350252000000, 32.33], [1350338400000, 33.24], [1350424800000, 33.44], [1350511200000, 33.48], [1350597600000, 33.24], [1350856800000, 33.49], [1350943200000, 33.31], [1351029600000, 33.36], [1351116000000, 33.40], [1351202400000, 34.01], [1351638000000, 34.02], [1351724400000, 34.36], [1351810800000, 34.39], [1352070000000, 34.24], [1352156400000, 34.39], [1352242800000, 33.47], [1352329200000, 32.98], [1352415600000, 32.90], [1352674800000, 32.70], [1352761200000, 32.54], [1352847600000, 32.23], [1352934000000, 32.64], [1353020400000, 32.65], [1353279600000, 32.92], [1353366000000, 32.64], [1353452400000, 32.84], [1353625200000, 33.40], [1353884400000, 33.30], [1353970800000, 33.18], [1354057200000, 33.88], [1354143600000, 34.09], [1354230000000, 34.61], [1354489200000, 34.70], [1354575600000, 35.30], [1354662000000, 35.40], [1354748400000, 35.14], [1354834800000, 35.48], [1355094000000, 35.75], [1355180400000, 35.54], [1355266800000, 35.96], [1355353200000, 35.53], [1355439600000, 37.56], [1355698800000, 37.42], [1355785200000, 37.49], [1355871600000, 38.09], [1355958000000, 37.87], [1356044400000, 37.71], [1356303600000, 37.53], [1356476400000, 37.55], [1356562800000, 37.30], [1356649200000, 36.90], [1356908400000, 37.68], [1357081200000, 38.34], [1357167600000, 37.75], [1357254000000, 38.13], [1357513200000, 37.94], [1357599600000, 38.14], [1357686000000, 38.66], [1357772400000, 38.62], [1357858800000, 38.09], [1358118000000, 38.16], [1358204400000, 38.15], [1358290800000, 37.88], [1358377200000, 37.73], [1358463600000, 37.98], [1358809200000, 37.95], [1358895600000, 38.25], [1358982000000, 38.10], [1359068400000, 38.32], [1359327600000, 38.24], [1359414000000, 38.52], [1359500400000, 37.94], [1359586800000, 37.83], [1359673200000, 38.34], [1359932400000, 38.10], [1360018800000, 38.51], [1360105200000, 38.40], [1360191600000, 38.07], [1360278000000, 39.12], [1360537200000, 38.64], [1360623600000, 38.89], [1360710000000, 38.81], [1360796400000, 38.61], [1360882800000, 38.63], [1361228400000, 38.99], [1361314800000, 38.77], [1361401200000, 38.34], [1361487600000, 38.55], [1361746800000, 38.11], [1361833200000, 38.59], [1361919600000, 39.60],]
    },],
    markers: {
        size: 0, style: 'hollow',
    },
    xaxis: {
        type: 'datetime', min: new Date('01 Mar 2012').getTime(), tickAmount: 6,
    },
    tooltip: {
        x: {
            format: 'dd MMM yyyy'
        }
    },
    fill: {
        type: 'gradient', gradient: {
            shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 100]
        }
    },
});

export const negativeAreaChart: () => ApexOptions = () => ({
    series: [
        {
            name: "Payments", data: [0, -41, 35, -51, 0, 62, -69, 32, -32, 54, 16, -50],
        }],
    chart: {
        height: 380, type: 'area', toolbar: {show: false}, zoom: {enabled: false},
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 0,
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
        labels: {
            formatter: function (val) {
                return val + " USD";
            }
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + " USD";
            }
        }
    },
    plotOptions: {
        line: {
            colors: {
                threshold: 0, colorAboveThreshold: getColor('success'), colorBelowThreshold: getColor('danger'),
            },
        },
    }
});

export const githubAreaChart: () => ApexOptions = () => ({
    chart: {
        id: 'chartyear', type: 'area', height: 200, toolbar: {
            show: false, autoSelected: 'pan'
        }
    }, colors: [getColor('secondary')], stroke: {
        width: 0, curve: 'smooth'
    }, dataLabels: {
        enabled: false
    }, fill: {
        opacity: 1, type: 'solid'
    }, series: [{
        name: 'commits', data: githubData.series
    }], yaxis: {
        tickAmount: 10, labels: {
            show: false
        }
    }, xaxis: {
        type: 'datetime',
    }
});

export const githubAreaChart2: () => ApexOptions = () => ({
    chart: {
        height: 175, type: 'area', toolbar: {
            autoSelected: 'selection',
        }, brush: {
            enabled: true, target: 'chartyear'
        }, selection: {
            enabled: true, xaxis: {
                min: new Date('05 Jan 2015').getTime(), max: new Date('04 Jan 2016').getTime()
            }, fill: {
                color: getColor('primary'), // background color of selection
                opacity: 0.15
            }, stroke: {
                color: getColor('primary'), // border color of selection
                width: 1, dashArray: 3
            }, handle: {
                backgroundColor: '#FF9800', // Circle color (Orange)
                borderColor: '#F57C00',     // Circle border color (Darker orange)
                borderWidth: 2
            }
        },
    }, colors: [getColor('info')], dataLabels: {
        enabled: false
    }, stroke: {
        width: 0, curve: 'smooth'
    },

    series: [{
        name: 'commits', data: githubData.series
    }], fill: {
        opacity: 1, type: 'solid'
    }, legend: {
        position: 'top', horizontalAlign: 'left'
    }, xaxis: {
        type: 'datetime'
    },
});

function generateWaveStyleData(baseTime: any, count: number, min: number, max: number) {
    let series = [];
    for (let i = 0; i < count; i++) {

        let value = (Math.sin(i / 2) * (max - min) / 2) + (min + (max - min) / 2);
        value = parseFloat(value.toFixed(2)); // Round to two decimal places
        series.push([baseTime + i * 86400000, value]);  // Increment time by 1 day (86400000 ms)
    }
    return series;
}

export const stackedAreaChart: () => ApexOptions = () => ({
    chart: {
        height: 422, type: 'area', stacked: true, toolbar: {show: false}, events: {
            selection: function (chart, e) {
                console.log(new Date(e.xaxis.min));
            }
        }
    }, colors: [getColor('primary'), getColor('secondary'), getColor('gray')], dataLabels: {
        enabled: false
    }, stroke: {
        width: 2, curve: 'smooth'
    }, series: [{
        name: 'iPhone 16', data: generateWaveStyleData(new Date('11 Feb 2025').getTime(), 20, 10, 60)
    }, {
        name: 'iPhone 16 Pro', data: generateWaveStyleData(new Date('11 Feb 2025').getTime(), 20, 10, 20)
    }, {
        name: 'iPhone 15 Pro', data: generateWaveStyleData(new Date('11 Feb 2025').getTime(), 20, 10, 15)
    }], fill: {
        gradient: {
            enabled: true, opacityFrom: 0.6, opacityTo: 0.8
        }
    }, legend: {
        position: 'top', horizontalAlign: 'center'
    }, xaxis: {
        type: 'datetime'
    }, grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        }, borderColor: getColor('border-color')
    }
});

let ts1 = 1388534400000;
let ts2 = 1388620800000;
let ts3 = 1389052800000;

const dataSet: number[][][] = [[], [], []];

for (let i = 0; i < 12; i++) {
    ts1 = ts1 + 86400000;
    const innerArr1 = [ts1, dataSeries[2][i].value];
    dataSet[0].push(innerArr1)
}
for (let i = 0; i < 18; i++) {
    ts2 = ts2 + 86400000;
    const innerArr2 = [ts2, dataSeries[1][i].value];
    dataSet[1].push(innerArr2)
}
for (let i = 0; i < 12; i++) {
    ts3 = ts3 + 86400000;
    const innerArr3 = [ts3, dataSeries[0][i].value];
    dataSet[2].push(innerArr3)
}

export const timeSeriesAreaChart: () => ApexOptions = () => ({
    chart: {
        type: 'area', stacked: false, height: 380, toolbar: {show: false}, zoom: {
            enabled: false
        },
    }, plotOptions: {
        line: {}
    }, dataLabels: {
        enabled: false
    }, series: [{
        name: 'Product A', data: dataSet[0]
    }, {
        name: 'Product B', data: dataSet[1]
    }, {
        name: 'Product C', data: dataSet[2]
    }], colors: [getColor('warning'), getColor('primary'), getColor('secondary')], markers: {
        size: 0, style: 'full',
    }, stroke: {
        width: 3
    }, fill: {
        gradient: {
            enabled: true,
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100]
        },
    }, yaxis: {

        labels: {
            style: {
                colors: getColor('gray'),
            }, offsetX: 0, formatter: function (val) {
                return (val / 1000000).toFixed(0);
            },
        }, axisBorder: {
            show: false,
        }, axisTicks: {
            show: false
        }
    }, xaxis: {
        type: 'datetime', tickAmount: 8, labels: {
            formatter: function (val) {
                return moment(new Date(val)).format("DD MMM YYYY")
            }
        }
    }, tooltip: {
        shared: true, y: {
            formatter: function (val) {
                return (val / 1000000).toFixed(0) + " points"
            }
        }
    }, legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetY: 10,
    }, grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        }, borderColor: getColor('border-color')
    }
});

export const nullValueAreaChart: () => ApexOptions = () => ({
    chart: {
        height: 380, type: 'area', toolbar: {show: false}, animations: {
            enabled: false
        }, zoom: {
            enabled: false
        },
    }, dataLabels: {
        enabled: false
    }, stroke: {
        curve: 'straight'
    }, colors: [getColor('secondary')], series: [{
        name: 'Network', data: [{x: 'Apr 01 2025', y: 48}, {x: 'Apr 02 2025', y: 30}, {x: 'Apr 03 2025', y: 45}, {
            x: 'Apr 04 2025', y: 51
        }, {x: 'Apr 05 2025', y: null}, {x: 'Apr 06 2025', y: 36}, {x: 'Apr 07 2025', y: 42}, {
            x: 'Apr 08 2025', y: 59
        }, {x: 'Apr 09 2025', y: 63}, {x: 'Apr 10 2025', y: 22}, {x: 'Apr 11 2025', y: 31}, {
            x: 'Apr 12 2025', y: null
        }, {x: 'Apr 13 2025', y: null}, {x: 'Apr 14 2025', y: 19}, {x: 'Apr 15 2025', y: 6}, {
            x: 'Apr 16 2025', y: 17
        }, {x: 'Apr 17 2025', y: null}, {x: 'Apr 18 2025', y: 11}, {x: 'Apr 19 2025', y: 37}, {
            x: 'Apr 20 2025', y: 25
        }, {x: 'Apr 21 2025', y: null}, {x: 'Apr 22 2025', y: 15}, {x: 'Apr 23 2025', y: 18}, {
            x: 'Apr 24 2025', y: 20
        }],
    }], fill: {
        opacity: 0.8,
        gradient: {}, pattern: {
            enabled: true, style: ['verticalLines', 'horizontalLines'], width: 5, depth: 6
        },
    }, markers: {
        size: 5, hover: {
            size: 9
        }
    }, tooltip: {
        intersect: true, shared: false
    }, theme: {
        palette: 'palette3'
    }, xaxis: {
        type: 'datetime',
    }, yaxis: {
        title: {
            text: 'Bytes Received',
            offsetX: -5,
            style: {
                fontSize: '14px',
                fontWeight: 500,
            },
        }
    }, grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        }, borderColor: getColor('border-color')
    }
});
