import {getColor} from "@/app/utils/color-utils";
import {EChartsOption} from "echarts";

export const pieChart = (): EChartsOption => ({
    legend: {
        show: false
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, series: [{
        type: "pie", radius: window.innerWidth < 530 ? "60%" : "75%", // ⬆️ Increased radius
        label: {
            color: getColor("tertiary-color")
        }, center: ["50%", "50%"], data: [{value: 1200, name: "Facebook", itemStyle: {color: getColor("primary")}}, {
            value: 1000, name: "Youtube", itemStyle: {color: getColor("danger")}
        }, {value: 800, name: "Twitter", itemStyle: {color: getColor("info")}}, {
            value: 600, name: "Linkedin", itemStyle: {color: getColor("secondary")}
        }, {value: 400, name: "Github", itemStyle: {color: getColor("warning")}}], emphasis: {
            itemStyle: {
                shadowBlur: 10, shadowOffsetX: 0, shadowColor: getColor("tertiary-color", 0.5)
            }
        }
    }], tooltip: {
        trigger: "item",
        padding: [8, 15],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1,
    }, xs: {series: [{radius: "45%"}]}, sm: {series: [{radius: "60%"}]}
})

export const doughnutPie = (): EChartsOption => ({
    legend: {
        bottom: 0, left: 'center', textStyle: {
            color: getColor('tertiary-color')
        }
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, series: [{
        type: 'pie', radius: ['60%', '80%'], center: ['50%', '45%'], avoidLabelOverlap: false, label: {
            show: false, position: 'center'
        }, labelLine: {
            show: false
        }, data: [{value: 1200, name: 'FB', itemStyle: {color: getColor('primary')}}, {
            value: 1000, name: 'YT', itemStyle: {color: getColor('danger')}
        }, {value: 800, name: 'TX', itemStyle: {color: getColor('info')}}, {
            value: 600, name: 'LD', itemStyle: {color: getColor('secondary')}
        }, {value: 400, name: 'GT', itemStyle: {color: getColor('warning')}}]
    }], tooltip: {
        trigger: 'item',
        padding: [8, 15],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1,
    }
})

export const roundedPie = (): EChartsOption => ({
    legend: {
        orient: 'vertical', left: 'left', textStyle: {
            color: getColor('tertiary-color')
        }
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, series: [{
        type: 'pie',
        radius: ['55%', '90%'],
        center: window.innerWidth < 530 ? ['65%', '55%'] : ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 10, borderColor: getColor('light'), borderWidth: 2
        },
        label: {
            show: false, position: 'center'
        },
        labelLine: {
            show: false
        },
        data: [{value: 1200, name: 'Starter', itemStyle: {color: getColor('primary')}}, {
            value: 1000, name: 'Basic', itemStyle: {color: getColor('danger')}
        }, {value: 800, name: 'Optimal', itemStyle: {color: getColor('info')}}, {
            value: 600, name: 'Business', itemStyle: {color: getColor('secondary')}
        }, {value: 400, name: 'Premium', itemStyle: {color: getColor('warning')}}]
    }], tooltip: {
        trigger: 'item',
        padding: [8, 15],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1,
    }, xs: {series: [{center: ['65%', '55%']}]}, sm: {series: [{center: ['50%', '55%']}]}
})

const leftChartData = [{value: 1048, name: 'Starter', itemStyle: {color: getColor('danger')}}, {
    value: 735, name: 'Basic', itemStyle: {color: getColor('primary')}
}, {value: 580, name: 'Optimal', itemStyle: {color: getColor('secondary')}}, {
    value: 484, name: 'Business', itemStyle: {color: getColor('warning')}
}, {value: 300, name: 'Premium', itemStyle: {color: getColor('success')}}, {
    value: 300, name: 'Platinum', itemStyle: {color: getColor('info')}
}];

const rightChartData = [{value: 1048, name: 'Facebook', itemStyle: {color: getColor('primary')}}, {
    value: 735, name: 'Youtube', itemStyle: {color: getColor('danger')}
}, {value: 580, name: 'Twitter', itemStyle: {color: getColor('info')}}, {
    value: 484, name: 'Linkedin', itemStyle: {color: getColor('secondary')}
}, {value: 300, name: 'Github', itemStyle: {color: getColor('warning')}}];

export const multiplePie = (): EChartsOption => ({
    tooltip: {
        trigger: 'item',
        padding: [8, 15],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1,
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, series: [{
        type: 'pie', radius: window.innerWidth < 450 ? '55%' : '65%', center: ['30%', '50%'], // Moved slightly toward center
        data: leftChartData, label: {show: false}
    }, {
        type: 'pie', radius: window.innerWidth < 450 ? '55%' : '65%', center: ['70%', '50%'], // Moved slightly toward center
        avoidLabelOverlap: false, label: {show: false}, data: rightChartData
    }], xs: {
        series: [{radius: '55%'}, {radius: '55%'}]
    }, sm: {
        series: [{radius: '65%'}, {radius: '65%'}]
    }
})

const data = [
    {value: 850, name: 'Starter', itemStyle: {color: getColor('primary')}}, {
        value: 750, name: 'Starter Pro', itemStyle: {color: getColor('secondary')}
    }, {value: 457, name: 'Basic', itemStyle: {color: getColor('success')}}, {
        value: 654, name: 'Optimal', itemStyle: {color: getColor('info')}
    }, {value: 447, name: 'Business', itemStyle: {color: getColor('warning')}}, {
        value: 682, name: 'Classic addition', itemStyle: {color: getColor('dark')}
    }, {value: 471, name: 'Premium', itemStyle: {color: getColor('purple')}}, {
        value: 524, name: 'Platinum', itemStyle: {color: getColor('light')}
    }];
export const labelAlign = (): EChartsOption => ({
    title: [{
        text: 'Pie Label Align Chart',
        left: 'center',
        textStyle: {color: getColor('tertiary-color'), fontSize: 13, fontWeight: 600}
    }, {
        subtext: 'alignTo: "labelLine"',
        left: '50%',
        top: '85%',
        textAlign: 'center',
        subtextStyle: {color: getColor('tertiary-color')}
    }], tooltip: {
        trigger: 'item',
        padding: [8, 15],
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
    }, series: [{
        type: 'pie', radius: window.innerWidth < 530 ? '45%' : '60%', center: ['50%', '50%'], data, label: {
            position: 'outer', alignTo: 'labelLine', bleedMargin: 5, color: getColor('tertiary-color')
        }, left: '5%', right: '5%', top: 0, bottom: 0
    }], xs: {series: [{radius: '45%'}]}, sm: {series: [{radius: '60%'}]}
})

export const nightingaleMap = (): EChartsOption => ({
    tooltip: {
        trigger: 'item',
        padding: [8, 15],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1,
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, series: [{
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 130],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
            borderRadius: 8
        },
        label: {
            color: getColor('tertiary-color')
        },
        data: [{value: 40, name: 'Rose 1'}, {value: 38, name: 'Rose 2'}, {value: 32, name: 'Rose 3'}, {
            value: 30, name: 'Rose 4'
        }, {value: 28, name: 'Rose 5'}, {value: 26, name: 'Rose 6'}, {value: 22, name: 'Rose 7'}, {
            value: 18, name: 'Rose 8'
        }]
    }]
})
const data1 = [{value: 850, name: 'Starter', itemStyle: {color: getColor('primary')}}, {
    value: 750, name: 'Starter Pro', itemStyle: {color: getColor('secondary')}
}, {value: 457, name: 'Basic', itemStyle: {color: getColor('success')}}, {
    value: 654, name: 'Optimal', itemStyle: {color: getColor('info')}
}, {value: 447, name: 'Business', itemStyle: {color: getColor('warning')}}, {
    value: 682, name: 'Classic addition', itemStyle: {color: getColor('dark')}
}, {value: 471, name: 'Premium', itemStyle: {color: getColor('purple')}}, {
    value: 524, name: 'Platinum', itemStyle: {color: getColor('light')}
}];

export const edgeAlign = (): EChartsOption => ({
    title: [{
        text: 'Pie Edge Align Chart',
        left: 'center',
        textStyle: {color: getColor('body-color'), fontSize: 13, fontWeight: 600}
    }, {
        subtext: 'alignTo: "edge"',
        left: '50%',
        top: '85%',
        textAlign: 'center',
        subtextStyle: {color: getColor('body-color')}
    }], tooltip: {
        trigger: 'item',
        padding: [8, 15],
        backgroundColor: getColor("secondary-bg"),
        borderColor: getColor("border-color"),
        textStyle: {color: getColor("light-text-emphasis")},
        borderWidth: 1,
        transitionDuration: 0.125,
        axisPointer: {type: "none"},
        shadowBlur: 2,
        shadowColor: "rgba(76, 76, 92, 0.15)",
        shadowOffsetX: 0,
        shadowOffsetY: 1,
    }, textStyle: {
        fontFamily: getComputedStyle(document.body).fontFamily
    }, series: [{
        type: 'pie', radius: window.innerWidth < 530 ? '45%' : '60%', center: ['50%', '50%'], data: data1, label: {
            position: 'outer', alignTo: 'edge', margin: 20, color: getColor('tertiary-color')
        }, left: '5%', right: '5%', top: 0, bottom: 0
    }], xs: {series: [{radius: '45%'}]}, sm: {series: [{radius: '60%'}]}
})
