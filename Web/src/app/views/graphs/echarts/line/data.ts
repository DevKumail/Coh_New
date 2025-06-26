import {getColor} from "@/app/utils/color-utils"
import {EChartsOption} from "echarts"

export const lineCharts = (): EChartsOption => ({
    grid: {
        left: '0%', right: '0%', bottom: '0%', top: '4%', containLabel: true
    }, xAxis: {
        type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisLine: {
            lineStyle: {
                color: getColor('body-secondary-color'),
            },
        },
    }, yAxis: {
        type: 'value', axisLine: {
            lineStyle: {
                color: '#858d98'
            },
        }, splitLine: {
            lineStyle: {
                color: "rgba(133, 141, 152, 0.1)"
            }
        }
    }, series: [{
        data: [150, 180, 120, 190, 110, 170, 130], type: 'line'
    }], textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, color: getColor('primary')

})

export const lineStacked = (): EChartsOption => ({
    textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, tooltip: {
        trigger: "axis",
        padding: [5, 0],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1, // Custom HTML formatter
        formatter: function (params: any) {
            const title = params[0].name; // xAxis label
            let content = `<div style="font-size: 14px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid ${getColor("border-color")}; margin-bottom: 8px; padding: 3px 10px 8px;">${title}</div>`;
            params.forEach((item: any) => {
                content += `<div style="margin-top: 4px; padding: 3px 15px;">
                            <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${item.color};"></span>
                            ${item.seriesName} : <strong>${item.value}</strong>
                        </div>`;
            });
            return content;
        },
    }, xAxis: {
        type: "category",
        data: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        boundaryGap: false,
        axisLine: {
            lineStyle: {
                color: getColor("tertiary-bg"), type: "dashed"
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: getColor("body-color"), margin: 15
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: getColor("border-color"), type: "dashed"
            }
        },
        boundaryGap: false, axisLabel: {
            show: true, color: getColor("body-color"), margin: 15
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        }
    }, series: [{
        name: "Matcha Latte", type: "line", symbolSize: 6, itemStyle: {
            color: getColor("info"), borderColor: getColor("info"), borderWidth: 2
        }, lineStyle: {
            color: getColor("info")
        }, symbol: "circle", stack: "product", data: [120, 132, 101, 134, 90, 230, 210]
    }, {
        name: "Milk Tea", type: "line", symbolSize: 10, itemStyle: {
            color: getColor("success"), borderColor: getColor("success"), borderWidth: 2
        }, lineStyle: {
            color: getColor("success")
        }, symbol: "circle", stack: "product", data: [220, 182, 191, 234, 290, 330, 310]
    }, {
        name: "Cheese Cocoa", type: "line", symbolSize: 10, itemStyle: {
            color: getColor("danger"), borderColor: getColor("danger"), borderWidth: 2
        }, lineStyle: {
            color: getColor("danger")
        }, symbol: "circle", stack: "product", data: [150, 232, 201, 154, 190, 330, 410]
    }, {
        name: "Cheese Brownie", type: "line", symbolSize: 10, itemStyle: {
            color: getColor("warning"), borderColor: getColor("warning"), borderWidth: 2
        }, lineStyle: {
            color: getColor("warning")
        }, symbol: "circle", stack: "product", data: [320, 332, 301, 334, 390, 330, 320]
    }, {
        name: "Matcha Cocoa", type: "line", symbolSize: 10, itemStyle: {
            color: getColor("primary"), borderColor: getColor("primary"), borderWidth: 2
        }, lineStyle: {
            color: getColor("primary")
        }, symbol: "circle", stack: "product", data: [820, 932, 901, 934, 1290, 1330, 1320]
    }], grid: {
        right: 22, left: 5, bottom: 5, top: 8, containLabel: true
    }
})

export const lineMarker = (): EChartsOption => ({
    textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, color: [getColor("primary"), getColor("warning")], tooltip: {
        trigger: "axis",
        padding: [5, 0],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1, // Custom HTML formatter
        formatter: function (params: any) {
            const title = params[0].name; // xAxis label
            let content = `<div style="font-size: 14px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid ${getColor("border-color")}; margin-bottom: 8px; padding: 3px 10px 8px;">${title}</div>`;
            params.forEach((item: any) => {
                content += `<div style="margin-top: 4px; padding: 3px 15px;">
                            <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${item.color};"></span>
                            ${item.seriesName} : <strong>${item.value}</strong>
                        </div>`;
            });
            return content;
        },
    }, xAxis: {
        type: "category",
        data: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        boundaryGap: false,
        axisLine: {
            lineStyle: {color: getColor("tertiary-bg"), type: "solid"}
        },
        axisTick: {show: false},
        axisLabel: {
            color: getColor("body-color"), margin: 15
        },
        splitLine: {show: false}
    }, yAxis: {
        splitLine: {lineStyle: {color: getColor("border-color")}}, boundaryGap: false, axisLabel: {
            show: true, color: getColor("body-color"), margin: 15
        }, axisTick: {show: false}, axisLine: {show: false}
    }, series: [{
        name: "Max",
        type: "line",
        data: [10, 11, 13, 11, 12, 9, 12],
        symbolSize: 10,
        lineStyle: {color: getColor("primary")},
        symbol: "circle",
        markPoint: {
            itemStyle: {color: getColor("primary")},
            label: {color: "#fff"},
            data: [{type: "max", name: "Max"}, {type: "min", name: "Min"}]
        },
        markLine: {
            lineStyle: {color: getColor("primary")},
            label: {color: getColor("body-color")},
            data: [{type: "average", name: "average"}]
        }
    }, {
        name: "Min", type: "line", data: [1, -2, 2, 5, 3, 2, 0], symbolSize: 10, itemStyle: {
            color: getColor("danger"), borderColor: getColor("danger"), borderWidth: 2
        }, lineStyle: {color: getColor("danger")}, symbol: "circle", markPoint: {
            itemStyle: {color: getColor("danger")},
            label: {color: "#fff"},
            data: [{name: "Weekly lowest", value: -2, xAxis: 1, yAxis: -1.5}]
        }, markLine: {
            lineStyle: {color: getColor("danger")},
            label: {color: getColor("body-color")},
            data: [{type: "average", name: "average"}, [{symbol: "none", x: "90%", yAxis: "max"}, {
                symbol: "circle", label: {position: "start", formatter: "Max"}, type: "max", name: "Highest point"
            }]]
        }
    }], grid: {
        right: "5%", left: "5%", bottom: "10%", top: "15%"
    }

})

export const stepLine = (): EChartsOption => ({
    tooltip: {
        trigger: 'axis',
        padding: [12, 16],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1
    },
    legend: {
        data: ['Step Start', 'Step Middle', 'Step End'], textStyle: { //The style of the legend text
            color: '#858d98',
        },
    },
    grid: {
        left: '0%', right: '0%', bottom: '0%', containLabel: true
    },
    xAxis: {
        type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisLine: {
            lineStyle: {color: getColor("tertiary-bg"), type: "dashed"}
        }, axisLabel: {
            color: getColor("body-color"), margin: 15
        },
    },
    yAxis: {
        type: 'value', axisLine: {
            lineStyle: {
                color: '#858d98'
            },
        }, splitLine: {
            lineStyle: {
                color: "rgba(133, 141, 152, 0.1)"
            }
        }
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, color: [getColor('purple'), getColor('warning'), getColor('success')], series: [{
        name: 'Step Start', type: 'line', step: 'start', data: [120, 132, 101, 134, 90, 230, 210]
    }, {
        name: 'Step Middle', type: 'line', step: 'middle', data: [220, 282, 201, 234, 290, 430, 410]
    }, {
        name: 'Step End', type: 'line', step: 'end', data: [450, 432, 401, 454, 590, 530, 510]
    }]
})

export const lineCategory = (): EChartsOption => ({
    legend: {
        data: ['Altitude (km) vs. temperature (°C)'], textStyle: { //The style of the legend text
            color: '#858d98',
        },
    }, tooltip: {
        trigger: 'axis',
        formatter: 'Temperature : <br/>{b}km : {c}°C',
        padding: [12, 16],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1
    }, grid: {
        left: '1%', right: '0%', bottom: '0%', containLabel: true
    }, xAxis: {
        type: 'value', axisLabel: {
            formatter: '{value} °C', color: getColor("body-color"), margin: 15
        }, axisLine: {
            lineStyle: {color: getColor("tertiary-bg"), type: "solid"}
        }, splitLine: {
            lineStyle: {
                color: "rgba(133, 141, 152, 0.1)"
            }
        },
    }, yAxis: {
        type: 'category', axisLine: {
            onZero: false, lineStyle: {color: getColor("secondary-color"), type: "dashed"}
        }, axisLabel: {
            formatter: '{value} km'
        }, boundaryGap: false, data: ['0', '10', '20', '30', '40', '50', '60', '70', '80'], splitLine: {
            lineStyle: {
                color: "rgba(133, 141, 152, 0.1)"
            }
        }
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, series: [{
        name: 'Altitude (km) vs. temperature (°C)',
        type: 'line',
        symbolSize: 10,
        symbol: 'circle',
        smooth: true,
        itemStyle: {
            color: getColor("primary"), borderColor: getColor("primary"), borderWidth: 2
        },
        lineStyle: {
            width: 3, color: getColor("primary"), shadowColor: 'rgba(0,0,0,0.3)', shadowBlur: 10, shadowOffsetY: 8
        },
        data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
    }]
})


let now = new Date(2023, 9, 3);
const oneDay = 24 * 3600 * 1000;
let value = Math.random() * 100;

export function randomData(): { name: string; value: [string, number] } {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(value)
        ]
    };
}

export const data: { name: string; value: [string, number] }[] = [];
for (let i = 0; i < 1000; i++) {
    data.push(randomData());
}
