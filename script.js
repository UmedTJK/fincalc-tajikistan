/**
 * =====================================================
 * FinCalc.TJ — Main Application Script
 * Version: v0.6.0 (COMPONENT-BASED ARCHITECTURE)
 * =====================================================
 */

// =====================================================
// 1. КОМПОНЕНТНАЯ СИСТЕМА - ЗАГРУЗКА ВСЕХ КОМПОНЕНТОВ
// =====================================================

// Глобальные переменные
let calculations = [];
let capitalizationType = 'none';
let componentsLoaded = false;

async function loadAllComponents() {
    console.group('🚀 Загрузка компонентов FinCalc.TJ');
    
    try {
        // Импортируем ComponentLoader
        const { ComponentLoader } = await import('./modules/utils/component-loader.js');
        const loader = new ComponentLoader();
        
        // Список компонентов для загрузки (в порядке зависимости)
        const components = [
            { name: 'header', selector: '#header-container', priority: 1 },
            { name: 'calculator-form', selector: '#calculator-container', priority: 2 },
            { name: 'export-panel', selector: '#export-container', priority: 3 },
            { name: 'table-chart', selector: '#table-chart-container', priority: 4 },
            // Добавляем футер с низким приоритетом (после загрузки основного контента)
            { name: 'footer', selector: '#footer-container', priority: 5 }
        ];
        
        // Сортируем по приоритету
        components.sort((a, b) => a.priority - b.priority);
        
        // Загружаем по очереди
        const results = [];
        for (const component of components) {
            console.log(`📦 Загружаем: ${component.name} (приоритет: ${component.priority})`);
            const success = await loader.load(component.name, component.selector);
            results.push({ name: component.name, success });
            
            if (!success) {
                console.warn(`⚠️ Компонент ${component.name} не загрузился`);
            }
            
            // Небольшая пауза между загрузками
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Проверяем результаты
        const allCriticalLoaded = results.filter(r => 
            ['calculator-form', 'header'].includes(r.name)
        ).every(r => r.success);
        
        componentsLoaded = allCriticalLoaded;
        
        console.log('📊 Результаты загрузки:', results);
        console.log(`✅ Компоненты загружены: ${allCriticalLoaded ? 'Все критические' : 'Не все'}`);
        console.groupEnd();
        
        return allCriticalLoaded;
        
    } catch (error) {
        console.error('💥 Критическая ошибка загрузки компонентов:', error);
        console.groupEnd();
        return false;
    }
}

// =====================================================
// 2. ИМПОРТЫ ДЛЯ РАСЧЕТОВ И ЛОГИКИ
// =====================================================

// Функция для безопасного импорта - если компоненты не загружены, импортируем позже
async function lazyImport(modulePath) {
    try {
        const module = await import(modulePath);
        return module;
    } catch (error) {
        console.warn(`⚠️ Не удалось импортировать ${modulePath}:`, error);
        return null;
    }
}

// Будем импортировать модули после загрузки компонентов
let modules = {
    interest: null,
    banksData: null,
    format: null,
    chartUi: null,
    themes: null,
    table: null,
    share: null,
    csv: null,
    pdf: null,
    applyProductRules: null
};

async function loadModules() {
    console.group('📦 Загрузка модулей');
    
    try {
        // 📊 Логика расчётов
        modules.interest = await lazyImport('./modules/calc/interest.js');
        
        // 🏦 Данные банков
        const banksModule = await lazyImport('./modules/data/banks.js');
        modules.banksData = banksModule?.banksData || null;
        
        // 🔧 Утилиты
        modules.format = await lazyImport('./modules/utils/format.js');
        
        // 📈 Графики
        modules.chartUi = await lazyImport('./modules/ui/chart-ui.js');
        
        // 🎨 Темы
        modules.themes = await lazyImport('./modules/ui/themes.js');
        
        // 📊 UI таблицы
        modules.table = await lazyImport('./modules/ui/table.js');
        
        // 🔗 Шаринг
        modules.share = await lazyImport('./modules/ui/share.js');
        
        // 📊 Экспорт
        modules.csv = await lazyImport('./modules/export/csv.js');
        modules.pdf = await lazyImport('./modules/export/pdf.js');
        
        // 🧮 Интеграция банковских продуктов
        modules.applyProductRules = await lazyImport('./modules/ui/applyProductRules.js');
        
        console.log('✅ Модули загружены');
        console.groupEnd();
        return true;
        
    } catch (error) {
        console.error('💥 Ошибка загрузки модулей:', error);
        console.groupEnd();
        return false;
    }
}

// =====================================================
// 3. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =====================================================

/**
 * Расчет с учетом капитализации
 */
function calculateWithCapitalization() {
    if (!document.getElementById('initialDeposit') || !modules.interest || !modules.format) {
        console.warn('[FinCalc] Необходимые элементы или модули не загружены');
        return { finalAmount: 0, totalInterest: 0, totalTax: 0 };
    }
    
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
        const formattedDate = modules.format.formatDate(monthDate);
        
        // КЛЮЧЕВОЕ ПРАВИЛО: в первый месяц проценты не начисляются
        let interestEarned = 0;
        let taxAmount = 0;
        let netInterest = 0;
        let capitalizedAmount = 0;
        let endAmount = currentAmount;
        
        // Только со второго месяца начисляем проценты
        if (month > 1) {
            // Используем единую функцию расчета
            const monthlyData = modules.interest.calculateMonthlyInterest(
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
            const monthlyData = modules.interest.calculateMonthlyInterest(
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
// 4. ОСНОВНАЯ ФУНКЦИЯ РАСЧЕТА И ОБНОВЛЕНИЯ UI
// =====================================================

/**
 * Основная функция расчета и обновления UI (с защитой от незагруженных компонентов)
 */
function calculateDeposit() {
    // Проверяем что компоненты загружены
    if (!componentsLoaded) {
        console.warn('[FinCalc] Компоненты не загружены, расчет отложен');
        return;
    }
    
    // Проверяем что модули форматирования загружены
    if (!modules.format) {
        console.warn('[FinCalc] Модуль форматирования не загружен');
        return;
    }
    
    const { formatNumber, formatDate } = modules.format;
    
    try {
        // 1. Безопасно получаем элементы формы
        const getElement = (id) => {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`[FinCalc] Элемент ${id} не найден`);
                return null;
            }
            return element;
        };
        
        const initialDepositInput = getElement('initialDeposit');
        const annualRateInput = getElement('annualRate');
        const taxRateInput = getElement('taxRate');
        const monthlyContributionInput = getElement('monthlyContribution');
        const termMonthsInput = getElement('termMonths');
        
        // Проверяем что все необходимые элементы найдены
        if (!initialDepositInput || !annualRateInput || !taxRateInput || 
            !monthlyContributionInput || !termMonthsInput) {
            console.warn('[FinCalc] Не все элементы формы найдены');
            return;
        }
        
        // 2. Получаем значения из полей ввода
        const initialDeposit = parseFloat(initialDepositInput.value) || 0;
        const annualRate = parseFloat(annualRateInput.value) || 0;
        const taxRate = parseFloat(taxRateInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const termMonths = parseInt(termMonthsInput.value) || 1;

        // 3. Рассчитываем чистые ставки
        const netAnnualRate = annualRate * (1 - taxRate / 100);
        const netMonthlyRate = netAnnualRate / 12;
        const monthlyIncome = initialDeposit * netMonthlyRate / 100;

        // 4. Обновляем расчетные показатели
        const updateResult = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.warn(`[FinCalc] Элемент результата ${id} не найден`);
            }
        };
        
        updateResult('netAnnualRate', netAnnualRate.toFixed(2) + '%');
        updateResult('netMonthlyRate', (netMonthlyRate / 100 * 12).toFixed(4) + '%');
        updateResult('monthlyIncome', formatNumber(monthlyIncome));

        // 5. Расчет по месяцам (если модуль interest загружен)
        if (modules.interest) {
            const result = calculateWithCapitalization();
            
            // 6. Обновляем итоговые показатели
            const totalContributions = initialDeposit + (monthlyContribution * termMonths);
            
            updateResult('totalContributions', formatNumber(totalContributions));
            updateResult('totalInterest', formatNumber(result.totalInterest));
            updateResult('finalAmount', formatNumber(result.finalAmount));
            
            // 7. Подготавливаем данные для шаринга
            if (modules.share) {
                modules.share.prepareShareData({
                    initialDeposit,
                    annualRate,
                    taxRate,
                    monthlyContribution,
                    termMonths,
                    finalAmount: result.finalAmount,
                    totalInterest: result.totalInterest,
                    formatNumber
                });
            }
            
            // 8. Обновляем таблицу (через событие для компонента)
            if (calculations && calculations.length > 0 && modules.table) {
                modules.table.renderCalculationsTable(calculations, formatNumber);
            }
            
            // 9. Обновляем график
            if (modules.chartUi) {
                const chartData = calculateAllCapitalizationScenarios();
                modules.chartUi.updateChart(chartData);
            }
        } else {
            console.warn('[FinCalc] Модуль расчета процентов не загружен');
        }

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
        if (!modules.csv || !modules.format) {
            console.warn('[FinCalc] Модуль экспорта CSV не загружен');
            return;
        }
        
        const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
        const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
        const termMonths = parseInt(document.getElementById('termMonths').value) || 1;

        const csvContent = modules.csv.generateCSVReport({
            initialDeposit,
            annualRate,
            taxRate,
            monthlyContribution,
            termMonths,
            calculations,
            formatNumber: modules.format.formatNumber
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
        if (!modules.pdf || !modules.format) {
            console.warn('[FinCalc] Модуль экспорта PDF не загружен');
            return;
        }
        
        const printWindow = window.open('', '_blank');

        const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
        const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
        const termMonths = parseInt(document.getElementById('termMonths').value) || 1;

        const pdfContent = modules.pdf.exportToPDF({
            title: 'Калькулятор депозита',
            initialDeposit,
            annualRate,
            taxRate,
            monthlyContribution,
            termMonths,
            calculations,
            formatNumber: modules.format.formatNumber
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

    if (!modules.banksData) {
        console.warn('[FinCalc] Данные банков не загружены');
        return;
    }

    // Заполняем список банков
    Object.keys(modules.banksData).forEach(bank => {
        const option = document.createElement("option");
        option.value = bank;
        option.textContent = modules.banksData[bank].name;
        bankSelect.appendChild(option);
    });

    // Обработчики
    bankSelect.addEventListener("change", () => {
        depositSelect.innerHTML = '<option value="">-- Выберите депозит --</option>';
        depositSelect.disabled = true;

        const bank = bankSelect.value;
        if (!bank) return;

        // Заполняем список депозитов
        const products = modules.banksData[bank].products;
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
        const product = modules.banksData[bank].products[productKey];
        
        // Применяем правила продукта
        if (modules.applyProductRules) {
            modules.applyProductRules.applyProductRules(product);
            modules.applyProductRules.attachProductGuards(product);
        }
        
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
        shareBtn.addEventListener('click', () => {
            if (modules.share) {
                modules.share.showShareOptions();
            }
        });
    }
    
    // Добавляем обработчики для кнопок выбора способа шаринга
    document.querySelectorAll('.share-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!modules.share) return;
            
            const type = this.getAttribute('data-type');
            switch(type) {
                case 'text': 
                    modules.share.shareAsText(); 
                    break;
                case 'image': 
                    modules.share.shareAsImage(() => {
                        if (modules.chartUi) return modules.chartUi.takeChartScreenshot();
                        return null;
                    });
                    break;
                case 'social': 
                    modules.share.shareToSocial(); 
                    break;
            }
        });
    });
    
    // Закрытие по клику вне модального окна
    const shareOptionsModal = document.getElementById('shareOptions');
    if (shareOptionsModal) {
        shareOptionsModal.addEventListener('click', function(e) {
            if (e.target === this && modules.share) {
                modules.share.hideShareOptions();
            }
        });
    }
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modules.share) {
            modules.share.hideShareOptions();
        }
    });
}

// =====================================================
// 7. ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТНОГО ВЗАИМОДЕЙСТВИЯ
// =====================================================

/**
 * Инициализация событий для связи между компонентами
 */
function initComponentsInteraction() {
    console.log('🔗 Инициализация взаимодействия компонентов');
    
    // Слушаем изменения формы от компонента calculator-form
    document.addEventListener('calculatorFormChanged', (e) => {
        console.log('🔄 Форма изменена (событие от компонента):', e.detail);
        calculateDeposit();
    });
    
    // Слушаем выбор банка
    document.addEventListener('bankSelected', (e) => {
        console.log('🏦 Банк выбран (событие от компонента):', e.detail);
        // Здесь можно добавить логику обработки выбора банка
    });

        // Слушаем навигацию из футера
    document.addEventListener('footer-navigate', (e) => {
        console.log('📍 Навигация из футера:', e.detail.section);
        this.handleFooterNavigation(e.detail.section);
    });

    
    // Слушаем запросы экспорта от компонента export-panel
    document.addEventListener('exportToExcelRequested', () => {
        console.log('📊 Запрос экспорта в Excel от компонента');
        exportToExcel();
    });
    
    document.addEventListener('exportToPDFRequested', () => {
        console.log('📄 Запрос экспорта в PDF от компонента');
        exportToPDF();
    });
    
    document.addEventListener('captureScreenshotRequested', () => {
        console.log('📸 Запрос скриншота от компонента');
        if (modules.chartUi) {
            modules.chartUi.takeChartScreenshot();
        }
    });
    
    document.addEventListener('shareAsTextRequested', () => {
        console.log('📝 Запрос шаринга текстом от компонента');
        if (modules.share) {
            modules.share.shareAsText();
        }
    });
    
    document.addEventListener('shareAsImageRequested', () => {
        console.log('🖼️ Запрос шаринга изображением от компонента');
        if (modules.share) {
            modules.share.shareAsImage(() => {
                if (modules.chartUi) return modules.chartUi.takeChartScreenshot();
                return null;
            });
        }
    });

        // Добавляем этот обработчик для шаринга скриншота
    document.addEventListener('requestScreenshotForShare', () => {
        console.log('📸 Запрос скриншота для шаринга от компонента');
        
        // Проверяем что модули загружены
        if (!modules.share || !modules.chartUi) {
            console.warn('[FinCalc] Модули для шаринга не загружены');
            return;
        }
        
        // Передаем функцию takeChartScreenshot в shareAsImage
        modules.share.shareAsImage(() => {
            if (modules.chartUi.takeChartScreenshot) {
                return modules.chartUi.takeChartScreenshot();
            }
            return null;
        });
    });
}

// =====================================================
// 8. ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// =====================================================

/**
 * Инициализация приложения при загрузке страницы
 */
async function initApplication() {
    console.group('[FinCalc] Инициализация приложения v0.6.0');
    
    try {
        // 1. Загружаем компоненты
        console.log('1. 📦 Загрузка компонентов...');
        const componentsSuccess = await loadAllComponents();
        
        if (!componentsSuccess) {
            console.warn('⚠️ Не все компоненты загрузились, но продолжаем...');
        }
        
        // 2. Ждем немного чтобы DOM обновился
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 3. Загружаем модули
        console.log('2. 📚 Загрузка модулей...');
        await loadModules();
        
        // 4. Инициализируем взаимодействие компонентов
        console.log('3. 🔗 Инициализация взаимодействия компонентов...');
        initComponentsInteraction();
        
        // 5. Инициализируем базовый функционал
        console.log('4. ⚙️ Инициализация функционала...');
        
        // Инициализация тем
        if (modules.themes) {
            modules.themes.initThemeSwitcher();
        }
        
        // Инициализация графика
        if (modules.chartUi && modules.format) {
            modules.chartUi.initChart(modules.format.formatNumber);
        }
        
        // Инициализация шаринга
        initShareButtons();
        
        // Инициализация банков
        initBanks();
        
        // 6. Настройка капитализации
        const capitalizationTypeElement = document.getElementById('capitalizationType');
        if (capitalizationTypeElement) {
            capitalizationType = capitalizationTypeElement.value;
            capitalizationTypeElement.addEventListener('change', function() {
                capitalizationType = this.value;
                calculateDeposit();
            });
        }
        
        // 7. Добавляем обработчики для полей ввода
        const inputs = ['initialDeposit', 'annualRate', 'taxRate', 'monthlyContribution', 'termMonths', 'startDate'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', calculateDeposit);
                element.addEventListener('change', calculateDeposit);
            }
        });
        
        // 8. Добавляем обработчики для кнопок экспорта (если они есть в DOM)
        setTimeout(() => {
            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) {
                exportBtn.addEventListener('click', exportToExcel);
            }
            
            const exportPdfBtn = document.getElementById('exportPdfBtn');
            if (exportPdfBtn) {
                exportPdfBtn.addEventListener('click', exportToPDF);
            }
            
            const screenshotBtn = document.getElementById('screenshotBtn');
            if (screenshotBtn && modules.chartUi) {
                screenshotBtn.addEventListener('click', modules.chartUi.takeChartScreenshot);
            }
        }, 1000);
        
        // 9. Первоначальный расчет с задержкой
        console.log('5. 🧮 Первоначальный расчет...');
        setTimeout(() => {
            try {
                calculateDeposit();
                console.log('✅ Расчет выполнен успешно');
            } catch (error) {
                console.error('❌ Ошибка при расчете:', error);
            }
        }, 1500);
        
        console.log('🎉 Приложение инициализировано!');
        console.groupEnd();
        
    } catch (error) {
        console.error('💥 Критическая ошибка при инициализации:', error);
        console.groupEnd();
        
        // Показываем сообщение об ошибке
        showErrorMessage('Ошибка загрузки приложения', error.message);
    }
}

// Вспомогательная функция для показа ошибок
function showErrorMessage(title, message) {
    const appContainer = document.querySelector('.calculator-area') || document.body;
    if (appContainer) {
        appContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; max-width: 600px; margin: 50px auto; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; color: #721c24;">
                <h2 style="margin-top: 0;">⚠️ ${title}</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 20px;">
                    Перезагрузить приложение
                </button>
                <p style="margin-top: 20px; font-size: 14px;">
                    Если проблема persists, пожалуйста, сообщите об ошибке.
                </p>
            </div>
        `;
    }
}

// =====================================================
// 9. ЗАПУСК ПРИЛОЖЕНИЯ
// =====================================================

// Запускаем приложение когда DOM готов
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplication);
} else {
    // DOM уже загружен
    initApplication();
}

// Экспортируем ключевые функции для использования в компонентах
export {
    calculateDeposit,
    calculateWithCapitalization,
    calculateAllCapitalizationScenarios,
    modules
};