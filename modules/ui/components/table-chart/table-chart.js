// Компонент: Таблица и график
// modules/ui/components/table-chart/table-chart.js
console.log('📦 TableChart.js загружается...');

// ============================
// Класс компонента
// ============================
class TableChartComponent {
    constructor() {
        console.log('🚀 TableChartComponent создается');
        this.chart = null;
        this.init();
    }

    init() {
        console.log('🔧 TableChartComponent инициализация');
        this.initChart();
        this.bindEvents();
    }

    bindEvents() {
        console.log('🔗 Подписка на события приложения');

        // Получаем расчёты → обновляем таблицу и график
        document.addEventListener('depositCalculated', (e) => {
            const { calculations, chartData } = e.detail;

            console.log('📊 depositCalculated → обновление UI');
            this.updateTable(calculations);
            this.updateChart(chartData);
        });

        // Скриншот, инициируемый ExportPanel
        document.addEventListener('captureScreenshotRequested', () => {
            const img = this.captureChartScreenshot();
            if (!img) return alert('⚠️ График ещё не готов');
            console.log('📸 Скриншот графика создан');
            console.log(img);
        });
    }

    // 📈 Создание графика
    initChart() {
        console.log('📈 Инициализация графика Chart.js');

        const ctx = document.getElementById('depositChart');
        if (!ctx) {
            console.warn('❌ Canvas #depositChart не найден — компонент загрузился до вставки HTML?');
            return;
        }

        this.chart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Начало'],
                datasets: [{
                    label: 'Рост депозита',
                    data: [0],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, .15)',
                    borderWidth: 2,
                    fill: true,
                    tension: .35,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Динамика роста депозита' }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Сумма' } },
                    x: { title: { display: true, text: 'Месяц' } }
                }
            }
        });

        console.log('✅ Chart.js график успешно создан');
    }

    // 📋 Обновление таблицы
    updateTable(calculations) {
        const tbody = document.getElementById('calculationsBody');
        if (!tbody) {
            console.error('❌ calculationsBody не найден');
            return;
        }

        // Нет данных?
        if (!calculations?.length) {
            tbody.innerHTML = `
                <tr><td colspan="8" class="empty">Нет данных для отображения</td></tr>
            `;
            console.warn('⚠️ Расчёт пустой → таблица очищена');
            return;
        }

        tbody.innerHTML = calculations.map(row => `
            <tr>
                <td>${row.month}</td>
                <td>${row.date}</td>
                <td>${this.format(row.startBalance)}</td>
                <td>${this.format(row.interest)}</td>
                <td>${this.format(row.tax)}</td>
                <td>${this.format(row.capitalization)}</td>
                <td>${this.format(row.contribution)}</td>
                <td>${this.format(row.endBalance)}</td>
            </tr>
        `).join('');

        console.log(`📋 Таблица обновлена: ${calculations.length} строк`);
    }

    // 📈 Обновление графика
    updateChart(chartData) {
        if (!this.chart) return console.warn('❌ chart не инициализирован');

        if (!chartData?.labels || !chartData?.datasets) {
            return console.warn('⚠️ Нет данных для графика → пропуск');
        }

        this.chart.data.labels = chartData.labels;
        this.chart.data.datasets = chartData.datasets;
        this.chart.update();

        console.log('📈 График обновлён');
    }

    // 📌 Числовой форматтер
    format(v) {
        return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(v ?? 0);
    }

    // 📸 Скриншот графика → Base64
    captureChartScreenshot() {
        if (!this.chart) return null;
        return this.chart.toBase64Image();
    }
}


// ============================
// 📌 ТОЧКА ВХОДА (для component-loader)
// ============================
export function init() {
    try {
        window.tableChartComponent = new TableChartComponent();
        console.log('⚙️ TableChartComponent init() выполнен');
    } catch (err) {
        console.error('❌ Ошибка init TableChartComponent:', err);
    }
}
