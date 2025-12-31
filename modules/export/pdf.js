//
//  pdf.js
//  
//
//  Created by SUM TJK on 31.12.25.
//

// modules/export/pdf.js
// HTML-based PDF export (print to PDF)

export function generatePDFHtmlReport({
  title,
  generatedAt,
  inputData,
  summaryData,
  tableRowsHtml
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }
    th { background-color: #f8f9fa; font-weight: bold; }
    th:first-child, td:first-child { text-align: center; }
    .highlight { background-color: #fff3cd; font-weight: bold; }
    .footer { margin-top: 40px; text-align: center; font-style: italic; color: #666; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>

<div class="header">
  <h1>Калькулятор депозита</h1>
  <p>Отчет создан: ${generatedAt}</p>
</div>

<div class="section">
  <h2>Входные данные</h2>
  <table>
    <tr><th>Параметр</th><th>Значение</th></tr>
    ${inputData}
  </table>
</div>

<div class="section">
  <h2>Расчетные показатели</h2>
  <table>
    <tr><th>Параметр</th><th>Значение</th></tr>
    ${summaryData}
  </table>
</div>

<div class="section">
  <h2>Помесячный прогноз (первые 12 месяцев)</h2>
  <table>
    <tr>
      <th>Месяц</th>
      <th>Начало</th>
      <th>%</th>
      <th>Конец</th>
    </tr>
    ${tableRowsHtml}
  </table>
</div>

<div class="footer">
  <p>FinCalc.TJ</p>
</div>

</body>
</html>
`;
}
export function exportToPDF({
  title,
  initialDeposit,
  annualRate,
  taxRate,
  monthlyContribution,
  termMonths,
  calculations,
  formatNumber
}) {
  // предположим, что расчеты выполнены и доступны необходимые переменные
  const totalContributions = initialDeposit + monthlyContribution * termMonths;
  const finalAmount = calculations.length ? calculations[calculations.length - 1].endAmount : initialDeposit;
  const totalInterest = finalAmount - totalContributions;

  const inputData = `
  <tr><td>Начальная сумма</td><td>${formatNumber(initialDeposit)} TJS</td></tr>
  <tr><td>Годовая ставка</td><td>${annualRate}%</td></tr>
  <tr><td>Налог</td><td>${taxRate}%</td></tr>
  <tr><td>Пополнение</td><td>${formatNumber(monthlyContribution)} TJS</td></tr>
  <tr><td>Срок</td><td>${termMonths} месяцев</td></tr>
`;

  const summaryData = `
  <tr><td>Общий вклад</td><td>${formatNumber(totalContributions)} TJS</td></tr>
  <tr><td>Итоговая сумма</td><td>${formatNumber(finalAmount)} TJS</td></tr>
  <tr><td>Доход</td><td>${formatNumber(totalInterest)} TJS</td></tr>
`;

  const tableRowsHtml = calculations.slice(0, 12).map(calc => `
  <tr>
    <td>${calc.month}</td>
    <td>${formatNumber(calc.startAmount)}</td>
    <td>${formatNumber(calc.interestEarned)}</td>
    <td>${formatNumber(calc.endAmount)}</td>
  </tr>
`).join('');

  const generatedAt = new Date().toLocaleString();

  const htmlReport = generatePDFHtmlReport({
    title,
    generatedAt,
    inputData,
    summaryData,
    tableRowsHtml
  });

  return htmlReport;
}

