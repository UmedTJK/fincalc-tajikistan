// modules/ui/applyProductRules.js

/**
 * Применяет правила продукта (депозита) к полям формы
 * @param {Object} deposit - объект продукта из banksData
 */
export function applyProductRules(deposit) {
  if (!deposit) return;

  const fields = {
    rate: document.getElementById("annualRate"),
    currency: document.getElementById("currency"),
    initial: document.getElementById("initialDeposit"),
    term: document.getElementById("termMonths"),
    contribution: document.getElementById("monthlyContribution"),
    capType: document.getElementById("capitalizationType"),
    tax: document.getElementById("taxRate"),
  };

  // Если поля не найдены, выходим
  if (!Object.values(fields).every(field => field)) {
    console.warn("[applyProductRules] Не все поля формы найдены");
    return;
  }

  // Процентная ставка (обязательное поле в текущей структуре)
  if (deposit.rate !== undefined) {
    fields.rate.value = deposit.rate;
    fields.rate.disabled = false; // Оставляем возможность менять
  }

  // Валюта
  if (deposit.currency) {
    fields.currency.value = deposit.currency;
  }

  // Минимальный вклад (если не задано, используем текущее значение)
  if (deposit.minAmount) {
    fields.initial.value = deposit.minAmount;
  }

  // Для текущей структуры устанавливаем фиксированные значения
  if (!fields.initial.value || fields.initial.value < 10000) {
    fields.initial.value = 100000; // минимальная сумма по умолчанию
  }
  
  fields.term.value = 12; // стандартный срок
  fields.tax.value = 12; // стандартный налог
}

/**
 * Защита от некорректных вводов для продукта
 * @param {Object} deposit - объект продукта
 */
export function attachProductGuards(deposit) {
  if (!deposit) return;
  
  const rateField = document.getElementById("annualRate");
  
  if (rateField) {
    // При изменении ставки показываем уведомление, но не блокируем
    rateField.addEventListener("input", (e) => {
      if (deposit.rate && Math.abs(e.target.value - deposit.rate) > 1) {
        console.log(`Банковская ставка: ${deposit.rate}%, ваша ставка: ${e.target.value}%`);
      }
    });
  }
}