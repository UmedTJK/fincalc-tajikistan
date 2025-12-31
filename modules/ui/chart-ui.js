// modules/ui/chart-ui.js

/**
 * Chart UI (Chart.js)
 * Only UI + rendering. No business logic.
 */

let depositChart = null;

/**
 * Initialize deposit chart
 * @param {Function} formatNumber
 */
export function initChart(formatNumber) {
  const canvas = document.getElementById('depositChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  depositChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Без капитализации',
          data: [],
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Ручная капитализация',
          data: [],
          borderColor: '#fd7e14',
          backgroundColor: 'rgba(253, 126, 20, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Автоматическая капитализация',
          data: [],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Сравнение типов капитализации',
          font: { size: 16, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label(context) {
              return context.dataset.label + ': ' + formatNumber(context.raw) + ' TJS';
            }
          }
        },
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Сумма депозита (TJS)'
          },
          ticks: {
            callback(value) {
              return formatNumber(value) + ' TJS';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Месяцы'
          },
          ticks: {
            maxTicksLimit: 12
          }
        }
      }
    }
  });
}

/**
 * Update chart data
 * @param {{labels: string[], series: Object<string, number[]>}} result
 */
export function updateChart(result) {
  if (!depositChart) return;

  depositChart.data.labels = result.labels;

  depositChart.data.datasets[0].data = result.series['Без капитализации'] || [];
  depositChart.data.datasets[1].data = result.series['Ручная капитализация'] || [];
  depositChart.data.datasets[2].data = result.series['Автоматическая капитализация'] || [];

  depositChart.update();
}

/**
 * Take chart screenshot (PNG)
 */
export function takeChartScreenshot() {
  if (!depositChart) return;

  const canvas = document.getElementById('depositChart');
  if (!canvas) return;

  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'график-депозита-' + new Date().toLocaleDateString() + '.png';
  link.href = image;
  link.click();
}
