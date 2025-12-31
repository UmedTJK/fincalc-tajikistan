/**
 * =====================================================
 * FinCalc.TJ — Main Application Script
 * Version: v0.4.4
 *
 * This file intentionally contains orchestration logic.
 * Heavy logic is gradually extracted into /modules.
 * =====================================================
 */

import { calculateMonthlyInterest } from './modules/interest.js';
import { banksData } from './modules/banks.js';
import { generateCSVReport } from './modules/export/csv.js';
import { buildTimeSeries, buildComparisonSeries } from './modules/charts.js';
import { exportToPDF as generatePDF } from './modules/export/pdf.js';
import { formatNumber, formatDate } from './modules/utils/format.js';







// =====================================================
// 1. Global State & Constants
// =====================================================

// calculations, shareData, chartInstance, etc.


// Глобальные переменные
let calculations = [];
let depositChart = null;
let capitalizationType = 'none';
let capitalizationFrequency = 'monthly';


// =====================================================
// 2. UTILITY & HELPER FUNCTIONS
// -----------------------------------------------------
// Чистые вспомогательные функции:
// - форматирование чисел
// - работа с датами
// Не имеют побочных эффектов
// =====================================================




// Инициализация капитализации
function initCapitalization() {
    const capitalizationSelect = document.getElementById('capitalizationType');
    if (!capitalizationSelect) return;
    
    // Обработчик изменения типа капитализации
    capitalizationSelect.addEventListener('change', function() {
        capitalizationType = this.value;
        calculateDeposit();
    });
}

// =====================================================
// 3. CORE CALCULATION LOGIC
// -----------------------------------------------------
// Бизнес-логика расчёта депозита:
// - помесячные расчёты
// - капитализация
// - сценарии сравнения
// =====================================================

// Расчет с учетом капитализации
function calculateWithCapitalization() {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = (parseFloat(document.getElementById('annualRate').value) || 0) / 100;
    const taxRate = (parseFloat(document.getElementById('taxRate').value) || 0) / 100;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    const startDate = new Date(document.getElementById('startDate').value || new Date().toISOString().split('T')[0]);
    
    const grossAnnualRate = annualRate; // Ставка до вычета налогов
    const netAnnualRate = annualRate * (1 - taxRate); // Ставка после вычета налогов
    
    calculations = [];
    let currentAmount = initialDeposit;
    let totalInterest = 0;
    let totalTax = 0;
    let totalCapitalized = 0;

    for (let month = 1; month <= termMonths; month++) {
        // Расчет даты для каждого месяца
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + month - 1);
        const formattedDate = formatDate(monthDate);
        
        // Расчет процентов и налога (interest.js)
        const { gross, tax, net } = calculateMonthlyInterest(
          currentAmount,
          grossAnnualRate,
          taxRate
        );

        
        // Сумма капитализации (зависит от типа)
        let capitalizedAmount = 0;
        let endAmount = currentAmount;
        
        switch (capitalizationType) {
            case 'auto':
                // Автоматическая: все проценты капитализируются
                capitalizedAmount = net;
                endAmount = currentAmount + capitalizedAmount + monthlyContribution;
                break;
                
            case 'manual':
                // Ручная: пользователь решает капитализировать или нет
                // Для простоты предположим, что пользователь капитализирует все
                capitalizedAmount = net;
                endAmount = currentAmount + capitalizedAmount + monthlyContribution;
                break;
                
            case 'none':
            default:
                // Без капитализации: проценты не капитализируются
                capitalizedAmount = 0;
                endAmount = currentAmount + monthlyContribution;
                break;
        }
        
        calculations.push({
            month: month,
            date: formattedDate,
            startAmount: currentAmount,
            interestEarned: gross,
            taxAmount: tax,
            netInterest: net,
            capitalizedAmount: capitalizedAmount,
            monthlyContribution: monthlyContribution,
            endAmount: endAmount,
            capitalizationType: capitalizationType
        });


        currentAmount = endAmount;
        totalInterest += gross;
        totalTax += tax;
        totalCapitalized += capitalizedAmount;
    }

    return { 
        finalAmount: currentAmount, 
        totalInterest: totalInterest,
        totalTax: totalTax,
        totalCapitalized: totalCapitalized
    };
}

// [МОДУЛЬ: Сравнение сценариев капитализации]
function calculateAllCapitalizationScenarios() {
    const scenarios = {
        'Без капитализации': calculateScenario('none'),
        'Ручная капитализация': calculateScenario('manual'),
        'Автоматическая капитализация': calculateScenario('auto')
    };

    return buildComparisonSeries(scenarios);
}





// =====================================================
// 4. UI RENDERING & DOM UPDATES
// -----------------------------------------------------
// Отвечает за отображение данных:
// - таблица расчетов
// - графики Chart.js
// - визуальные обновления
// =====================================================

// Обновление таблицы с расчетами
function updateTable() {
    const tbody = document.getElementById('calculationsBody');
    tbody.innerHTML = '';

    calculations.forEach((calc) => {
        const row = tbody.insertRow();
        
        // Определяем иконку в зависимости от типа капитализации
        let icon = '💳'; // по умолчанию (без капитализации)
        if (calc.capitalizationType === 'auto') icon = '⚡';
        if (calc.capitalizationType === 'manual') icon = '👐';
        
        row.innerHTML = `
            <td style="text-align: center; font-weight: 600;">${calc.month}</td>
            <td style="text-align: center;">${calc.date}</td>
            <td>${formatNumber(calc.startAmount)} </td>
            <td class="interest-cell">${formatNumber(calc.interestEarned)} </td>
            <td class="tax-cell" style="color: #dc3545;">-${formatNumber(calc.taxAmount)}</td>
            <td class="capitalization-cell" style="color: #28a745;">${icon} ${formatNumber(calc.capitalizedAmount)} </td>
            <td class="contribution-cell">+${formatNumber(calc.monthlyContribution)}</td>
            <td class="amount-cell" style="font-weight: 700;">${formatNumber(calc.endAmount)} </td>
        `;
    });
}

// Основная функция расчета
function calculateDeposit() {
    // Получаем значения из полей ввода
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = (parseFloat(document.getElementById('annualRate').value) || 0) / 100;
    const taxRate = (parseFloat(document.getElementById('taxRate').value) || 0) / 100;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;

    // Рассчитываем чистые ставки
    const netAnnualRate = annualRate * (1 - taxRate);
    const netMonthlyRate = netAnnualRate / 12;
    const monthlyIncome = initialDeposit * netMonthlyRate;

    // Обновляем расчетные показатели
    document.getElementById('netAnnualRate').textContent = (netAnnualRate * 100).toFixed(2) + '%';
    document.getElementById('netMonthlyRate').textContent = (netMonthlyRate * 100).toFixed(4) + '%';
    document.getElementById('monthlyIncome').textContent = formatNumber(monthlyIncome);

    // Расчет по месяцам (ОДИН раз вызываем функцию!)
    const result = calculateWithCapitalization();
    let finalAmount = result.finalAmount;
    let totalInterest = result.totalInterest;
    let totalTax = result.totalTax;
    let totalCapitalized = result.totalCapitalized;

    // Обновляем итоговые показатели
    const totalContributions = initialDeposit + (monthlyContribution * termMonths);

    document.getElementById('totalContributions').textContent = formatNumber(totalContributions);
    document.getElementById('totalInterest').textContent = formatNumber(totalInterest);
    document.getElementById('finalAmount').textContent = formatNumber(finalAmount);

    // Можно также отобразить эти итоги где-то в интерфейсе
    console.log("Общий налог:", totalTax);
    console.log("Общая капитализация:", totalCapitalized);

    // Обновляем таблицу и график
    updateTable();
    updateChart();
}



// =====================================================
// 5. EXPORT LOGIC (CSV / PDF)
// -----------------------------------------------------
// Экспорт результатов расчёта:
// - CSV (Excel)
// - PDF (печать / сохранение)
// =====================================================

// Экспорт в Excel (CSV)
function exportToExcel() {
  const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
  const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
  const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
  const termMonths = parseInt(document.getElementById('termMonths').value) || 1;

  const csvContent = generateCSVReport({
    initialDeposit,
    annualRate,
    taxRate,
    monthlyContribution,
    termMonths,
    calculations,
    formatNumber
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'deposit_calculator.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// Экспорт в PDF
function exportToPDF() {
  const printWindow = window.open('', '_blank');

  const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
  const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
  const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
  const termMonths = parseInt(document.getElementById('termMonths').value) || 1;

  const pdfContent = generatePDF({
    title: 'Калькулятор депозита',
    initialDeposit,
    annualRate,
    taxRate,
    monthlyContribution,
    termMonths,
    calculations,
    formatNumber
  });

  printWindow.document.open();
  printWindow.document.write(pdfContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 500);
}


// [МОДУЛЬ: Графики Chart.js]
// Инициализация графика
function initChart() {
    const ctx = document.getElementById('depositChart').getContext('2d');
    
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
                        label: function(context) {
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
                        callback: function(value) {
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

// Обновление данных графика
function updateChart() {
    if (!depositChart) return;

    const result = calculateAllCapitalizationScenarios();

    // Метки по оси X (даты)
    depositChart.data.labels = result.labels;

    // Данные для линий
    depositChart.data.datasets[0].data =
        result.series['Без капитализации'] || [];

    depositChart.data.datasets[1].data =
        result.series['Ручная капитализация'] || [];

    depositChart.data.datasets[2].data =
        result.series['Автоматическая капитализация'] || [];

    depositChart.update();
}


// Функция для скриншота графика (для YouTube)
function takeChartScreenshot() {
    if (!depositChart) return;
    
    const chartCanvas = document.getElementById('depositChart');
    const image = chartCanvas.toDataURL('image/png');
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.download = 'график-депозита-' + new Date().toLocaleDateString() + '.png';
    link.href = image;
    link.click();
}



// =====================================================
// 7. THEME & UI CONFIGURATION
// -----------------------------------------------------
// Управление оформлением интерфейса:
// - темы оформления
// - сохранение выбора в LocalStorage
// =====================================================

// [МОДУЛЬ: Переключатель тем]
// Назначение: Управление различными темами оформления
// Логика: Сохранение выбранной темы в LocalStorage

const themes = {
    'default': {
        body: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        container: 'white'
    },
    'dark-gradient': {
        body: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        container: 'rgba(18, 18, 18, 0.95)',
        text: '#ffffff'
    },
    'futuristic': {
        body: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
        container: 'rgba(255, 255, 255, 0.95)'
    },
    'glass': {
        body: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        container: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'blur(20px)'
    },
    'premium': {
        body: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
        container: 'rgba(255, 255, 255, 0.98)'
    }
};

function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    
    // Применяем сохраненную тему
    applyTheme(savedTheme);
    
    // Добавляем обработчики для кнопок
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            localStorage.setItem('selectedTheme', theme);
            
            // Обновляем активную кнопку
            themeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Помечаем активную тему
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        }
    });
}

function applyTheme(themeName) {
    const theme = themes[themeName];
    const body = document.body;
    const container = document.querySelector('.container');
    
    // Применяем стили
    body.style.background = theme.body;
    container.style.background = theme.container;
    
    if (theme.backdrop) {
        container.style.backdropFilter = theme.backdrop;
    }
    
    if (theme.text) {
        container.style.color = theme.text;
    }
    
    // Дополнительные стили для конкретных тем
    if (themeName === 'dark-gradient' || themeName === 'futuristic') {
        container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        container.style.color = theme.text || '#333';
    } else {
        container.style.border = 'none';
        container.style.color = '#333';
    }
}

// [МОДУЛЬ: Поделиться расчетом]
// Назначение: Позволяет пользователю поделиться результатами расчета через Web Share API
// Вход: Данные текущего расчета
// Возвращает: Ничего (открывает нативный диалог поделиться)
// 📍 РАЗМЕСТИТЕ: После функций экспорта, перед инициализацией

function shareCalculation() {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    const finalAmount = calculations.length > 0 ? calculations[calculations.length - 1].endAmount : 0;
    
    const shareText = `💰 Результат расчета депозита:
• Начальная сумма: ${formatNumber(initialDeposit)} TJS
• Годовая ставка: ${annualRate}%
• Срок: ${termMonths} месяцев
• Итоговая сумма: ${formatNumber(finalAmount)} TJS

Рассчитано на FinCalc.TJ - калькуляторе депозитов для Таджикистана`;

    // Проверяем поддержку Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Расчет депозита - FinCalc.TJ',
            text: shareText,
            url: window.location.href
        })
        .then(() => console.log('Успешно поделились'))
        .catch((error) => {
            // Если пользователь отменил шаринг или произошла ошибка,
            // предлагаем альтернативный способ
            fallbackShare(shareText);
        });
    } else {
        // Fallback для браузеров без поддержки Web Share API
        fallbackShare(shareText);
    }
}

// Альтернативный способ поделиться (копирование в буфер обмена)
function fallbackShare(text) {
    // Копируем текст в буфер обмена
    navigator.clipboard.writeText(text)
        .then(() => {
            // Показываем уведомление об успешном копировании
            showNotification('✅ Текст расчета скопирован в буфер обмена! Вставьте его в сообщение.');
        })
        .catch(err => {
            // Если не удалось скопировать, показываем текст для ручного копирования
            alert('📋 Скопируйте текст для分享:\n\n' + text);
        });
}

// Функция показа уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}



// =====================================================
// 6. SHARE LOGIC
// -----------------------------------------------------
// Поделиться результатами расчёта:
// - Web Share API
// - fallback (clipboard)
// - модальное окно и варианты шаринга
// =====================================================

// [МОДУЛЬ: Улучшенный функционал поделиться]
// Назначение: Расширенный функционал для分享 результатов
// 📍 РАЗМЕСТИТЕ: После предыдущей функции shareCalculation

// ⚠️ Global state (share flow)
let shareData = null;

function prepareShareData() {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    const finalAmount = calculations.length > 0 ? calculations[calculations.length - 1].endAmount : 0;
    const totalInterest = finalAmount - (initialDeposit + monthlyContribution * termMonths);
    
    shareData = {
        initialDeposit,
        annualRate,
        taxRate,
        monthlyContribution,
        termMonths,
        finalAmount,
        totalInterest,
        url: window.location.href,
        timestamp: new Date().toLocaleString('ru-RU')
    };
    
    return shareData;
}

function showShareOptions() {
    prepareShareData();
    document.getElementById('shareOptions').style.display = 'flex';
}

function hideShareOptions() {
    document.getElementById('shareOptions').style.display = 'none';
}

function shareAsText() {
    const text = `💰 РАСЧЕТ ДЕПОЗИТА - FinCalc.TJ

📊 Параметры:
• Начальная сумма: ${formatNumber(shareData.initialDeposit)} TJS
• Годовая ставка: ${shareData.annualRate}%
• Налог: ${shareData.taxRate}%
• Пополнение: ${formatNumber(shareData.monthlyContribution)} TJS/мес
• Срок: ${shareData.termMonths} месяцев

📈 Результаты:
• Итоговая сумма: ${formatNumber(shareData.finalAmount)} TJS
• Общий доход: ${formatNumber(shareData.totalInterest)} TJS
• Дата расчета: ${shareData.timestamp}

🔗 ${shareData.url}

#финансы #Таджикистан #депозит #инвестиции`;

    if (navigator.share) {
        navigator.share({
            title: 'Мой расчет депозита - FinCalc.TJ',
            text: text,
            url: shareData.url
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('✅ Текст скопирован! Вставьте в сообщение');
            hideShareOptions();
        });
    }
}

function shareAsImage() {
    takeChartScreenshot();
    hideShareOptions();
    showNotification('📸 Скриншот графика сохранен!');
}

function shareToSocial() {
    const text = encodeURIComponent('Посмотрите мой расчет депозита на FinCalc.TJ!');
    const url = encodeURIComponent(shareData.url);
    
    const socialLinks = {
        telegram: `https://t.me/share/url?url=${url}&text=${text}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
        vk: `https://vk.com/share.php?url=${url}&title=${text}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    };
    
    // Можно открыть окно выбора соцсетей
    window.open(socialLinks.telegram, '_blank');
    hideShareOptions();
}


// =====================================================
// 8. APP INITIALIZATION & EVENT LISTENERS
// -----------------------------------------------------
// Запуск приложения:
// - подписка на события
// - инициализация модулей
// - первичный расчет
// =====================================================

// Обновляем обработчики
document.addEventListener('DOMContentLoaded', function() {
    // Заменяем старый обработчик на новый
    document.getElementById('shareBtn').addEventListener('click', showShareOptions);
    
    // Добавляем обработчики для кнопок выбора
    document.querySelectorAll('.share-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switch(type) {
                case 'text': shareAsText(); break;
                case 'image': shareAsImage(); break;
                case 'social': shareToSocial(); break;
            }
        });
    });
    
    // Закрытие по клику вне модального окна
    document.getElementById('shareOptions').addEventListener('click', function(e) {
        if (e.target === this) hideShareOptions();
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideShareOptions();
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики событий для всех полей ввода
    const inputs = ['initialDeposit', 'annualRate', 'taxRate', 'monthlyContribution', 'termMonths', 'startDate'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateDeposit);
    });
    
    // Добавляем обработчик для выбора капитализации
    document.getElementById('capitalizationType').addEventListener('change', calculateDeposit);
    
    // Добавляем обработчики для кнопок экспорта
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
    document.getElementById('screenshotBtn').addEventListener('click', takeChartScreenshot);
    
    
    // Инициализируем переключатель тем
    initThemeSwitcher();

    


    // Добавляем обработчик для кнопки "Поделиться"
    document.getElementById('shareBtn').addEventListener('click', shareCalculation);
    
    
    // Инициализируем график и капитализацию
    initChart();
    initCapitalization();
    
    // Первоначальный расчет
    calculateDeposit();
});






// === Функции выбора банка/депозита ===
function applyDepositOption(deposit, option, selectedCurrency = null) {
  const currency = selectedCurrency || Object.keys(option.rates)[0];
  if (!option.rates[currency]) return;

  document.getElementById("currency").value = currency;
  document.getElementById("annualRate").value = option.rates[currency];
  document.getElementById("initialDeposit").value = deposit.minAmount[currency] || 0;
  document.getElementById("termMonths").value = option.term;
  document.getElementById("capitalizationType").disabled = !deposit.capitalization;

  calculateDeposit();
}

function initBanks() {
  const bankSelect = document.getElementById("bankSelect");
  const depositSelect = document.getElementById("depositSelect");
  const termGroup = document.getElementById("termGroup");
  const termSelect = document.getElementById("termSelect");
  const currencyGroup = document.getElementById("currencyGroup");
  const currencySelect = document.getElementById("depositCurrencySelect");

  // Заполняем список банков
  Object.keys(banksData).forEach(bank => {
    const option = document.createElement("option");
    option.value = bank;
    option.textContent = bank;
    bankSelect.appendChild(option);
  });

  // Обработчики
  bankSelect.addEventListener("change", () => {
    depositSelect.innerHTML = '<option value="">-- Выберите депозит --</option>';
    depositSelect.disabled = true;
    termGroup.classList.remove("show");
    currencyGroup.classList.remove("show");

    const bank = bankSelect.value;
    if (!bank) return;

    banksData[bank].forEach((deposit, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = deposit.depositName;
      depositSelect.appendChild(option);
    });

    depositSelect.disabled = false;
  });

  depositSelect.addEventListener("change", () => {
    const bank = bankSelect.value;
    const depositIndex = depositSelect.value;
    if (!bank || depositIndex === "") return;

    const deposit = banksData[bank][depositIndex];
    termSelect.innerHTML = "";

    if (deposit.options && deposit.options.length > 0) {
      deposit.options.forEach((opt, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = `${opt.term} мес.`;
        termSelect.appendChild(option);
      });

      termGroup.style.display = "block";
      setTimeout(() => termGroup.classList.add("show"), 50);

      termSelect.value = 0;
      updateCurrencyOptions(deposit, deposit.options[0]);
    }
  });

  termSelect.addEventListener("change", () => {
    const bank = bankSelect.value;
    const depositIndex = depositSelect.value;
    if (!bank || depositIndex === "") return;
    const deposit = banksData[bank][depositIndex];
    const option = deposit.options[termSelect.value];
    updateCurrencyOptions(deposit, option);
  });

  currencySelect.addEventListener("change", () => {
    const bank = bankSelect.value;
    const depositIndex = depositSelect.value;
    if (!bank || depositIndex === "") return;
    const deposit = banksData[bank][depositIndex];
    const option = deposit.options[termSelect.value];
    applyDepositOption(deposit, option, currencySelect.value);
  });

  function updateCurrencyOptions(deposit, option) {
    currencySelect.innerHTML = "";
    Object.entries(option.rates).forEach(([cur, rate]) => {
      const optionEl = document.createElement("option");
      optionEl.value = cur;
      optionEl.textContent = `${cur} (${rate}%)`;
      currencySelect.appendChild(optionEl);
    });

    currencyGroup.style.display = "block";
    setTimeout(() => currencyGroup.classList.add("show"), 50);

    applyDepositOption(deposit, option, Object.keys(option.rates)[0]);
  }
}

window.addEventListener("DOMContentLoaded", initBanks);

function calculateScenario(type) {
    const previousType = capitalizationType;

    capitalizationType = type;
    calculateWithCapitalization(); // пересчитывает глобальный `calculations`

    const scenarioCalculations = [...calculations]; // КОПИЯ!

    capitalizationType = previousType;

    return scenarioCalculations;
}

