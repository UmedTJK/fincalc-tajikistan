/**
 * =====================================================
 * FinCalc.TJ — Main Application Script
 * Version: v0.5.0 (INTEGRATION 2.0)
 * =====================================================
 */

// =====================================================
// 1. ИМПОРТЫ
// =====================================================

// 📊 Логика расчётов
import {
  calculateMonthlyInterest,
  calculateDepositPlan
} from './modules/calc/interest.js';

// 🏦 Данные банков
import { banksData } from './modules/data/banks.js';

// 🧮 UI — интеграция банковских продуктов
import { applyProductRules, attachProductGuards } from './modules/ui/applyProductRules.js';

// 📈 Графики
import { initChart, updateChart, takeChartScreenshot } from './modules/ui/chart-ui.js';

// 🔧 Утилиты
import { formatNumber, formatDate } from './modules/utils/format.js';

// 🎨 Темы
import { initThemeSwitcher } from './modules/ui/themes.js';

// 📊 UI таблицы
import { renderCalculationsTable } from './modules/ui/table.js';

// 🔗 Шаринг
import {
  prepareShareData,
  shareAsText,
  shareAsImage,
  shareToSocial,
  showShareOptions,
  hideShareOptions
} from './modules/ui/share.js';

// 📊 Экспорт
import { generateCSVReport } from './modules/export/csv.js';
import { exportToPDF as generatePDF } from './modules/export/pdf.js';

// =====================================================
// 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// =====================================================
let calculations = [];
let capitalizationType = 'none';

// =====================================================
// 3. ОСНОВНАЯ ЛОГИКА РАСЧЕТА
// =====================================================

/**
 * Расчет с учетом капитализации
 */
function calculateWithCapitalization() {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
    const taxRate = (parseFloat(document.getElementById('taxRate').value) || 0) / 100;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    const startDate = new Date(document.getElementById('startDate').value || new Date().toISOString().split('T')[0]);
    
    calculations = [];
    let currentAmount = initialDeposit;
    let totalInterest = 0;
    let totalTax = 0;

    for (let month = 1; month <= termMonths; month++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + month - 1);
        const formattedDate = formatDate(monthDate);
        
        // КЛЮЧЕВОЕ ПРАВИЛО: в первый месяц проценты не начисляются
        let interestEarned = 0;
        let taxAmount = 0;
        let netInterest = 0;
        let capitalizedAmount = 0;
        let endAmount = currentAmount;
        
        // Только со второго месяца начисляем проценты
        if (month > 1) {
            // Используем единую функцию расчета
            const monthlyData = calculateMonthlyInterest(
                currentAmount,
                annualRate,
                month,
                capitalizationType !== 'none',
                taxRate
            );
            
            if (monthlyData) {
                interestEarned = monthlyData.interest;
                taxAmount = monthlyData.tax;
                netInterest = monthlyData.net;
                
                // Капитализация
                if (capitalizationType !== 'none') {
                    capitalizedAmount = netInterest;
                    endAmount = monthlyData.newBalance + monthlyContribution;
                } else {
                    // Без капитализации: проценты не добавляются к депозиту
                    endAmount = currentAmount + monthlyContribution;
                }
            }
        } else {
            // Первый месяц: только начальная сумма + пополнение
            endAmount = currentAmount + monthlyContribution;
        }
        
        calculations.push({
            month: month,
            date: formattedDate,
            startAmount: currentAmount,
            interestEarned: interestEarned,
            taxAmount: taxAmount,
            netInterest: netInterest,
            capitalizedAmount: capitalizedAmount,
            monthlyContribution: monthlyContribution,
            endAmount: endAmount,
            capitalizationType: capitalizationType
        });
        
        currentAmount = endAmount;
        totalInterest += interestEarned;
        totalTax += taxAmount;
    }
    
    return { 
        finalAmount: currentAmount, 
        totalInterest: totalInterest,
        totalTax: totalTax
    };
}

/**
 * Расчет сценария капитализации для графика
 */
function calculateScenario(type) {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
    const taxRate = (parseFloat(document.getElementById('taxRate').value) || 0) / 100;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    
    const tempCalculations = [];
    let currentAmount = initialDeposit;
    
    for (let month = 1; month <= termMonths; month++) {
        let endAmount = currentAmount;
        
        // КЛЮЧЕВОЕ ПРАВИЛО: в первый месяц проценты не начисляются
        if (month > 1) {
            const withCapitalization = type !== 'none';
            const monthlyData = calculateMonthlyInterest(
                currentAmount,
                annualRate,
                month,
                withCapitalization,
                taxRate
            );
            
            if (monthlyData) {
                if (withCapitalization) {
                    endAmount = monthlyData.newBalance + monthlyContribution;
                } else {
                    endAmount = currentAmount + monthlyContribution;
                }
            }
        } else {
            // Первый месяц: только пополнение
            endAmount = currentAmount + monthlyContribution;
        }
        
        tempCalculations.push(endAmount);
        currentAmount = endAmount;
    }
    
    return tempCalculations;
}

/**
 * Расчет всех сценариев капитализации для сравнения
 */
function calculateAllCapitalizationScenarios() {
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    const labels = Array.from({ length: termMonths }, (_, i) => `Месяц ${i + 1}`);
    
    return {
        labels: labels,
        series: {
            'Без капитализации': calculateScenario('none'),
            'Ручная капитализация': calculateScenario('manual'),
            'Автоматическая капитализация': calculateScenario('auto')
        }
    };
}

// =====================================================
// 4. ОРКЕСТРАЦИЯ UI
// =====================================================

/**
 * Основная функция расчета и обновления UI
 */
function calculateDeposit() {
    try {
        // Получаем значения из полей ввода
        const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
        const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
        const termMonths = parseInt(document.getElementById('termMonths').value) || 1;

        // Рассчитываем чистые ставки
        const netAnnualRate = annualRate * (1 - taxRate / 100);
        const netMonthlyRate = netAnnualRate / 12;
        const monthlyIncome = initialDeposit * netMonthlyRate / 100;

        // Обновляем расчетные показатели
        const netAnnualRateElement = document.getElementById('netAnnualRate');
        const netMonthlyRateElement = document.getElementById('netMonthlyRate');
        const monthlyIncomeElement = document.getElementById('monthlyIncome');
        
        if (netAnnualRateElement) netAnnualRateElement.textContent = netAnnualRate.toFixed(2) + '%';
        if (netMonthlyRateElement) netMonthlyRateElement.textContent = (netMonthlyRate / 100 * 12).toFixed(4) + '%';
        if (monthlyIncomeElement) monthlyIncomeElement.textContent = formatNumber(monthlyIncome);

        // Расчет по месяцам
        const result = calculateWithCapitalization();
        
        // Обновляем итоговые показатели
        const totalContributions = initialDeposit + (monthlyContribution * termMonths);
        
        const totalContributionsElement = document.getElementById('totalContributions');
        const totalInterestElement = document.getElementById('totalInterest');
        const finalAmountElement = document.getElementById('finalAmount');
        
        if (totalContributionsElement) totalContributionsElement.textContent = formatNumber(totalContributions);
        if (totalInterestElement) totalInterestElement.textContent = formatNumber(result.totalInterest);
        if (finalAmountElement) finalAmountElement.textContent = formatNumber(result.finalAmount);

        // ПОДГОТОВКА ДАННЫХ ДЛЯ ШАРИНГА
        prepareShareData({
            initialDeposit,
            annualRate,
            taxRate,
            monthlyContribution,
            termMonths,
            finalAmount: result.finalAmount,
            totalInterest: result.totalInterest,
            formatNumber
        });

        // Обновляем таблицу
        if (calculations && calculations.length > 0) {
            renderCalculationsTable(calculations, formatNumber);
        }

        // Готовим данные для графика
        const chartData = calculateAllCapitalizationScenarios();
        
        // Обновляем график
        updateChart(chartData);

    } catch (error) {
        console.error('[FinCalc] Ошибка при расчете:', error);
    }
}

// =====================================================
// 5. ЭКСПОРТ ЛОГИКА
// =====================================================

/**
 * Экспорт в Excel (CSV)
 */
function exportToExcel() {
    try {
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
    } catch (error) {
        console.error('[FinCalc] Ошибка при экспорте в CSV:', error);
        alert('Ошибка при экспорте в CSV. Проверьте консоль для деталей.');
    }
}

/**
 * Экспорт в PDF
 */
function exportToPDF() {
    try {
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
    } catch (error) {
        console.error('[FinCalc] Ошибка при экспорте в PDF:', error);
        alert('Ошибка при экспорте в PDF. Проверьте консоль для деталей.');
    }
}

// =====================================================
// 6. ИНТЕГРАЦИЯ БАНКОВ
// =====================================================

/**
 * Инициализация выбора банков и депозитов
 */
function initBanks() {
    const bankSelect = document.getElementById("bankSelect");
    const depositSelect = document.getElementById("depositSelect");

    if (!bankSelect || !depositSelect) {
        console.warn('[FinCalc] Элементы выбора банка не найдены');
        return;
    }

    // Заполняем список банков
    Object.keys(banksData).forEach(bank => {
        const option = document.createElement("option");
        option.value = bank;
        option.textContent = banksData[bank].name;
        bankSelect.appendChild(option);
    });

    // Обработчики
    bankSelect.addEventListener("change", () => {
        depositSelect.innerHTML = '<option value="">-- Выберите депозит --</option>';
        depositSelect.disabled = true;

        const bank = bankSelect.value;
        if (!bank) return;

        // Заполняем список депозитов
        const products = banksData[bank].products;
        Object.keys(products).forEach((productKey) => {
            const product = products[productKey];
            const option = document.createElement("option");
            option.value = productKey;
            option.textContent = product.type || productKey;
            depositSelect.appendChild(option);
        });

        depositSelect.disabled = false;
    });

    depositSelect.addEventListener("change", () => {
        const bank = bankSelect.value;
        const productKey = depositSelect.value;
        
        if (!bank || !productKey) return;

        // Получаем продукт
        const product = banksData[bank].products[productKey];
        
        // Применяем правила продукта
        applyProductRules(product);
        attachProductGuards(product);
        
        // Обновляем расчет
        calculateDeposit();
    });
}

/**
 * Инициализация обработчиков событий шаринга
 */
function initShareButtons() {
    // Обработчик для кнопки "Поделиться"
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', showShareOptions);
    }
    
    // Добавляем обработчики для кнопок выбора способа шаринга
    document.querySelectorAll('.share-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switch(type) {
                case 'text': 
                    shareAsText(); 
                    break;
                case 'image': 
                    shareAsImage(takeChartScreenshot);
                    break;
                case 'social': 
                    shareToSocial(); 
                    break;
            }
        });
    });
    
    // Закрытие по клику вне модального окна
    const shareOptionsModal = document.getElementById('shareOptions');
    if (shareOptionsModal) {
        shareOptionsModal.addEventListener('click', function(e) {
            if (e.target === this) hideShareOptions();
        });
    }
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideShareOptions();
    });
}

// =====================================================
// 7. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// =====================================================

/**
 * Инициализация приложения при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('[FinCalc] Инициализация приложения v0.5.0...');
    
    try {
        // Инициализация модулей
        initBanks();
        initThemeSwitcher();
        initChart(formatNumber);
        initShareButtons();

        // Получаем значение капитализации по умолчанию
        const capitalizationTypeElement = document.getElementById('capitalizationType');
        if (capitalizationTypeElement) {
            capitalizationType = capitalizationTypeElement.value;
            capitalizationTypeElement.addEventListener('change', function() {
                capitalizationType = this.value;
                calculateDeposit();
            });
        }

        // Добавляем обработчики событий для всех полей ввода
        const inputs = ['initialDeposit', 'annualRate', 'taxRate', 'monthlyContribution', 'termMonths', 'startDate'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', calculateDeposit);
            }
        });
        
        // Добавляем обработчики для кнопок экспорта
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToExcel);
        }
        
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', exportToPDF);
        }
        
        const screenshotBtn = document.getElementById('screenshotBtn');
        if (screenshotBtn) {
            screenshotBtn.addEventListener('click', takeChartScreenshot);
        }

        // Первоначальный расчет
        setTimeout(() => {
            calculateDeposit();
        }, 100);
        
        console.log('[FinCalc] Приложение успешно инициализировано');
    } catch (error) {
        console.error('[FinCalc] Ошибка при инициализации:', error);
    }
});