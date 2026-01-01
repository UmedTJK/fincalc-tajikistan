// Компонент: Калькуляторная форма
// modules/ui/components/calculator-form/calculator-form.js
console.log('📦 CalculatorForm.js загружается...');

// ============================
// Класс компонента
// ============================
class CalculatorFormComponent {
    constructor() {
        console.log('🚀 CalculatorFormComponent создается');
        this.init();
    }

    init() {
        console.log('🔧 CalculatorFormComponent инициализация');
        this.bindEvents();
        this.initBankSelector();
    }

    bindEvents() {
        console.log('🔗 CalculatorFormComponent: привязка событий формы');

        const formInputs = document.querySelectorAll(
            '#initialDeposit, #annualRate, #taxRate, #monthlyContribution, #termMonths, #capitalizationType, #startDate, #currency'
        );

        formInputs.forEach(input => {
            input.addEventListener('input', () => this.onFormChange());
            input.addEventListener('change', () => this.onFormChange());
        });

        const bankSelect = document.getElementById('bankSelect');
        if (bankSelect) {
            bankSelect.addEventListener('change', (e) => {
                this.onBankSelect(e.target.value);
            });
        }
    }

    initBankSelector() {
        console.log('🏦 Инициализация выбора банка (пока заглушка)');
    }

    onFormChange() {
        const detail = this.getFormData();
        console.log('🔄 Форма изменена → calculatorFormChanged', detail);

        document.dispatchEvent(new CustomEvent('calculatorFormChanged', { detail }));
    }

    onBankSelect(bankId) {
        console.log(`🏦 Выбран банк: ${bankId}`);
        document.dispatchEvent(new CustomEvent('bankSelected', { detail: { bankId } }));
    }

    getFormData() {
        return {
            initialDeposit: parseFloat(document.getElementById('initialDeposit')?.value) || 0,
            currency: document.getElementById('currency')?.value || 'TJS',
            annualRate: parseFloat(document.getElementById('annualRate')?.value) || 0,
            taxRate: parseFloat(document.getElementById('taxRate')?.value) || 0,
            monthlyContribution: parseFloat(document.getElementById('monthlyContribution')?.value) || 0,
            termMonths: parseInt(document.getElementById('termMonths')?.value) || 0,
            capitalizationType: document.getElementById('capitalizationType')?.value,
            startDate: document.getElementById('startDate')?.value
        };
    }

    updateResults(results) {
        console.log('📊 Обновление результатов расчета', results);

        const update = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        update('netAnnualRate', results.netAnnualRate);
        update('netMonthlyRate', results.netMonthlyRate);
        update('monthlyIncome', results.monthlyIncome);
        update('totalContributions', results.totalContributions);
        update('totalInterest', results.totalInterest);
        update('finalAmount', results.finalAmount);
    }

    setBankOptions(banks) {
        const bankSelect = document.getElementById('bankSelect');
        if (!bankSelect) return;

        bankSelect.innerHTML = `<option value="">-- Выберите банк --</option>`;

        banks.forEach(bank => {
            const option = document.createElement('option');
            option.value = bank.id;
            option.textContent = bank.name;
            bankSelect.appendChild(option);
        });
    }
}


// ============================
// 📌 ТОЧКА ВХОДА ДЛЯ COMPONENT-LOADER
// ============================
export function init() {
    try {
        window.calculatorFormComponent = new CalculatorFormComponent();
        console.log('⚙️ CalculatorFormComponent init() выполнен');
    } catch (err) {
        console.error('❌ Ошибка init CalculatorFormComponent:', err);
    }
}
