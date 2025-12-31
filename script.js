/**
 * =====================================================
 * FinCalc.TJ — Main Application Script
 * Version: v0.4.5 (FIXED)
 *
 * This file intentionally contains orchestration logic.
 * Heavy logic is gradually extracted into /modules.
 * =====================================================
 */

// =====================================================
// 1. IMPORTS
// =====================================================
import { calculateMonthlyInterest } from './modules/interest.js';
import { banksData } from './modules/banks.js';
import { generateCSVReport } from './modules/export/csv.js';
import { buildTimeSeries, buildComparisonSeries } from './modules/charts.js';
import { exportToPDF as generatePDF } from './modules/export/pdf.js';
import { formatNumber, formatDate } from './modules/utils/format.js';
import { renderCalculationsTable } from './modules/ui/table.js';
import { initChart, updateChart, takeChartScreenshot } from './modules/ui/chart-ui.js';
import { initThemeSwitcher } from './modules/ui/themes.js';
import {
  shareCalculation,
  showShareOptions,
  hideShareOptions,
  shareAsText,
  shareAsImage,
  shareToSocial
} from './modules/ui/share.js';

// =====================================================
// 2. GLOBAL STATE & CONSTANTS
// =====================================================
let calculations = [];
let capitalizationType = 'none';
let capitalizationFrequency = 'monthly';

// =====================================================
// 3. DOM HELPERS & INITIALIZATION HELPERS
// =====================================================

/**
 * Инициализация выбора капитализации
 */
function initCapitalization() {
    const capitalizationSelect = document.getElementById('capitalizationType');
    if (!capitalizationSelect) return;
    
    capitalizationSelect.addEventListener('change', function() {
        capitalizationType = this.value;
        calculateDeposit();
    });
}

// =====================================================
// 4. CORE CALCULATION LOGIC
// =====================================================

/**
 * Расчет с учетом капитализации (основная логика)
 */
function calculateWithCapitalization() {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = (parseFloat(document.getElementById('annualRate').value) || 0) / 100;
    const taxRate = (parseFloat(document.getElementById('taxRate').value) || 0) / 100;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    const startDate = new Date(document.getElementById('startDate').value || new Date().toISOString().split('T')[0]);
    
    const grossAnnualRate = annualRate;
    const netAnnualRate = annualRate * (1 - taxRate);
    
    calculations = [];
    let currentAmount = initialDeposit;
    let totalInterest = 0;
    let totalTax = 0;
    let totalCapitalized = 0;

    for (let month = 1; month <= termMonths; month++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + month - 1);
        const formattedDate = formatDate(monthDate);
        
        const { gross, tax, net } = calculateMonthlyInterest(
          currentAmount,
          grossAnnualRate,
          taxRate
        );
        
        let capitalizedAmount = 0;
        let endAmount = currentAmount;
        
        switch (capitalizationType) {
            case 'auto':
                capitalizedAmount = net;
                endAmount = currentAmount + capitalizedAmount + monthlyContribution;
                break;
                
            case 'manual':
                capitalizedAmount = net;
                endAmount = currentAmount + capitalizedAmount + monthlyContribution;
                break;
                
            case 'none':
            default:
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

/**
 * Расчет одного сценария капитализации
 */
function calculateScenario(type) {
    const previousType = capitalizationType;
    const tempCalculations = [];
    
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
    const annualRate = (parseFloat(document.getElementById('annualRate').value) || 0) / 100;
    const taxRate = (parseFloat(document.getElementById('taxRate').value) || 0) / 100;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const termMonths = parseInt(document.getElementById('termMonths').value) || 1;
    const startDate = new Date(document.getElementById('startDate').value || new Date().toISOString().split('T')[0]);
    
    const grossAnnualRate = annualRate;
    const netAnnualRate = annualRate * (1 - taxRate);
    
    let currentAmount = initialDeposit;

    for (let month = 1; month <= termMonths; month++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + month - 1);
        const formattedDate = formatDate(monthDate);
        
        const { gross, tax, net } = calculateMonthlyInterest(
            currentAmount,
            grossAnnualRate,
            taxRate
        );
        
        let capitalizedAmount = 0;
        let endAmount = currentAmount;
        
        switch (type) {
            case 'auto':
            case 'manual':
                capitalizedAmount = net;
                endAmount = currentAmount + capitalizedAmount + monthlyContribution;
                break;
            case 'none':
            default:
                capitalizedAmount = 0;
                endAmount = currentAmount + monthlyContribution;
                break;
        }
        
        tempCalculations.push({
            month: month,
            date: formattedDate,
            startAmount: currentAmount,
            interestEarned: gross,
            taxAmount: tax,
            netInterest: net,
            capitalizedAmount: capitalizedAmount,
            monthlyContribution: monthlyContribution,
            endAmount: endAmount,
            capitalizationType: type
        });

        currentAmount = endAmount;
    }

    capitalizationType = previousType;
    
    return tempCalculations;
}

/**
 * Расчет всех сценариев капитализации для сравнения
 */
function calculateAllCapitalizationScenarios() {
    const scenarios = {
        'Без капитализации': calculateScenario('none'),
        'Ручная капитализация': calculateScenario('manual'),
        'Автоматическая капитализация': calculateScenario('auto')
    };

    return buildComparisonSeries(scenarios);
}

// =====================================================
// 5. UI ORCHESTRATION (ЦЕНТРАЛЬНАЯ ТОЧКА)
// =====================================================

/**
 * Основная функция расчета и обновления UI
 * ЕДИНСТВЕННАЯ точка, где вызываются расчёты и обновляется UI
 */
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

    // Расчет по месяцам
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

    // Обновляем таблицу
    renderCalculationsTable(calculations, formatNumber);

    // Контроль: расчёты
    console.assert(
      Array.isArray(calculations) && calculations.length > 0,
      '[FinCalc] calculations пуст — таблица не получит данные'
    );

    // Готовим данные для графика
    const chartData = calculateAllCapitalizationScenarios();

    // Контроль: данные для графика
    console.assert(
      chartData &&
      Array.isArray(chartData.labels) &&
      Object.keys(chartData.series || {}).length > 0,
      '[FinCalc] chartData некорректен — график не получит данные'
    );

    // Обновляем график
    updateChart(chartData);
}

// =====================================================
// 6. EXPORT LOGIC
// =====================================================

/**
 * Экспорт в Excel (CSV)
 */
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

/**
 * Экспорт в PDF
 */
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

// =====================================================
// 7. BANK / DEPOSIT SELECTION LOGIC
// =====================================================

/**
 * Применение выбранного депозита к форме
 */
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

/**
 * Инициализация выбора банков и депозитов
 */
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

// =====================================================
// 8. APP BOOTSTRAP
// =====================================================

/**
 * Инициализация приложения при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация модулей
  initBanks();
  initThemeSwitcher();
  initChart(formatNumber);
  initCapitalization();

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
  
  // Обработчик для кнопки "Поделиться"
  document.getElementById('shareBtn').addEventListener('click', showShareOptions);
  
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
  document.getElementById('shareOptions').addEventListener('click', function(e) {
      if (e.target === this) hideShareOptions();
  });
  
  // Закрытие по ESC
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') hideShareOptions();
  });

  // Первоначальный расчет
  calculateDeposit();
});