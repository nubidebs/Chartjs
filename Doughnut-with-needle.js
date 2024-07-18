<template>
    <Doughnut
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        :plugins=" chartPlugins"
    />
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
    name: 'AuiDoughnutChart',
    components: { Doughnut },
    props: {
        chartId: {
            type: String,
            required: true
        },
        needleValue: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            chartData: {
                labels: [
                    'Red',
                    'Blue',
                    'Yellow'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [70, 15, 15],
                    backgroundColor: [
                        'rgb(0, 128, 0)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 99, 132)'
                    ],
                    hoverOffset: 4,
                    circumference: 180,
                    rotation: 270.5,
                    cutout: '75%',
                    needleValue: this.needleValue
                }]
            },
            chartOptions: {
                responsive: true,
                aspectRatio: 1.6,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            },
            chartPlugins: [{
                id: 'gaugeNeedle',
                afterDatasetsDraw (chart) {
                    const { ctx, data } = chart
                    ctx.save()

                    const needleValue = data.datasets[0].needleValue
                    const xCenter = chart.getDatasetMeta(0).data[0].x
                    const yCenter = chart.getDatasetMeta(0).data[0].y
                    const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius - 6
                    const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius
                    const widthSlice = outerRadius - innerRadius
                    const angle = Math.PI

                    // Calculates what is the needle's angle
                    const circumference = (chart.getDatasetMeta(0).data[0].circumference / Math.PI / data.datasets[0].data[0]) * needleValue
                    const needleValueAngle = circumference + 1.5
                    // Indicates a new 0 point in the middle of the arc
                    ctx.translate(xCenter, yCenter)
                    // Needle's angle
                    ctx.rotate(angle * needleValueAngle)

                    // Drawing needle
                    ctx.beginPath()

                    ctx.moveTo(0 - 7, 0) // starting point
                    ctx.lineTo(0, -innerRadius - widthSlice)
                    ctx.lineTo(0, 0)

                    ctx.stroke()
                    ctx.fill()

                    // Drawing needle's dot
                    ctx.beginPath()
                    ctx.arc(-3, -3, 8, angle * 0, angle * 2, false)
                    ctx.fill()
                    ctx.restore()
                }
            }]
        }
    }
}
</script>
