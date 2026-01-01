let depositChart = null;

export function initChart(formatNumber) {
  const canvas = document.getElementById('depositChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // 💣 испавляет ошибку "Canvas already in use"
  if (depositChart) {
    depositChart.destroy();
  }

  depositChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Без капитализации', data: [], borderColor: '#dc3545', fill: true, tension: 0.4 },
        { label: 'Ручная капитализация', data: [], borderColor: '#fd7e14', fill: true, tension: 0.4 },
        { label: 'Автоматическая капитализация', data: [], borderColor: '#28a745', fill: true, tension: 0.4 },
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
