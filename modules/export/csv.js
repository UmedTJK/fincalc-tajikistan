//
//  csv.js
//  
//
//  Created by SUM TJK on 31.12.25.
//
// modules/export/csv.js
// CSV export logic for FinCalc.TJ
// Pure function: no DOM, no side effects

export function generateCSVReport({
  initialDeposit,
  annualRate,
  taxRate,
  monthlyContribution,
  termMonths,
  calculations,
  formatNumber
}) {
  let csvContent = "\uFEFF"; // BOM for UTF-8

  // Header
  csvContent += "КАЛЬКУЛЯТОР ДЕПОЗИТА\n\n";

  // Part 1: Input data
  csvContent += "ЧАСТЬ 1: ВВОД ДАННЫХ\n";
  csvContent += "Параметр;Значение\n";
  csvContent += `Начальная сумма депозита;${initialDeposit}\n`;
  csvContent += `Годовая ставка (%);${annualRate}\n`;
  csvContent += `Налог на доход (%);${taxRate}\n`;
  csvContent += `Ежемесячное пополнение;${monthlyContribution}\n`;
  csvContent += `Срок (мес.);${termMonths}\n\n`;

  // Part 2: Monthly forecast
  csvContent += "ЧАСТЬ 2: ПОМЕСЯЧНЫЙ ПРОГНОЗ\n";
  csvContent += "Месяц;Дата;Начало;Начислено %;Налог;Капитализация;Пополнение;Конец\n";

  calculations.forEach(calc => {
    csvContent += [
      calc.month,
      calc.date,
      calc.startAmount.toFixed(2),
      calc.interestEarned.toFixed(2),
      calc.taxAmount.toFixed(2),
      calc.capitalizedAmount.toFixed(2),
      calc.monthlyContribution.toFixed(2),
      calc.endAmount.toFixed(2)
    ].join(";") + "\n";
  });

  return csvContent;
}

