/**
 * Calculate monthly interest for a deposit with:
 * - фиксированной ставкой (годовая)
 * - без капитализации (простой расчёт)
 * - с капитализацией (сложный %)
 *
 * @param {number} principal - начальная сумма вклада
 * @param {number} annualRate - годовая ставка в %, например 16
 * @param {number} month - номер месяца (для отчетов)
 * @param {boolean} capitalization - если true → капитализация
 * @param {number} taxRate - ставка НДФЛ (дефолт 12% → 0.12)
 * @returns {object} { month, interest, tax, net, newBalance }
 */

export function calculateMonthlyInterest(
  principal,
  annualRate,
  month = 1,
  capitalization = true,
  taxRate = 0.12
) {
  if (!principal || !annualRate) return null;

  const monthlyRate = annualRate / 12 / 100;

  // 💰 Проценты за месяц
  const interest = principal * monthlyRate;

  // 🧾 Налог
  const tax = interest * taxRate;

  // 🟢 Чистый доход за месяц
  const net = interest - tax;

  // 🧱 Новая сумма (только при капитализации)
  const newBalance = capitalization ? principal + net : principal;

  return {
    month,
    interest: +interest.toFixed(2),
    tax: +tax.toFixed(2),
    net: +net.toFixed(2),
    newBalance: +newBalance.toFixed(2),
  };
}

/**
 * 🧮 Helper: расчёт плана на N месяцев
 * Возвращает массив с результатами по месяцам
 */
export function calculateDepositPlan(
  principal,
  annualRate,
  months,
  capitalization = true,
  taxRate = 0.12
) {
  let results = [];
  let current = principal;

  for (let month = 1; month <= months; month++) {
    const data = calculateMonthlyInterest(
      current,
      annualRate,
      month,
      capitalization,
      taxRate
    );
    results.push(data);
    current = data.newBalance;
  }

  return results;
}
