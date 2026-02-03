import { useEffect, useRef } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

function RevenueChart({ revenueData, expenseData, currency = 'USD' }) {
    const chartRef = useRef(null)

    // Format currency for tooltip
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const labels = revenueData.map((d) => d.month)
    const revenues = revenueData.map((d) => d.revenue)
    const expenses = expenseData.map((d) => d.expenses)

    const data = {
        labels,
        datasets: [
            {
                label: 'Revenue',
                data: revenues,
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: 'rgb(37, 99, 235)',
                borderWidth: 0,
                borderRadius: 6,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            {
                label: 'Expenses',
                data: expenses,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 0,
                borderRadius: 6,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    borderRadius: 3,
                    useBorderRadius: true,
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleFont: {
                    size: 13,
                    family: "'Inter', sans-serif",
                },
                bodyFont: {
                    size: 12,
                    family: "'Inter', sans-serif",
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                    color: '#94a3b8',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                },
                ticks: {
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                    },
                    color: '#94a3b8',
                    callback: function (value) {
                        if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(0) + 'k'
                        }
                        return '$' + value
                    },
                },
            },
        },
    }

    if (!revenueData.length && !expenseData.length) {
        return (
            <div className="chart-empty">
                <p>No data available yet</p>
            </div>
        )
    }

    return (
        <div className="revenue-chart">
            <Bar ref={chartRef} data={data} options={options} />
        </div>
    )
}

export default RevenueChart
