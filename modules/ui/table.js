// modules/ui/table.js

/**
 * Render calculations table
 * @param {Array} calculations
 * @param {Function} formatNumber
 */
export function renderCalculationsTable(calculations, formatNumber) {
  const tbody = document.getElementById('calculationsBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  calculations.forEach(calc => {
    const row = tbody.insertRow();

    // Icon by capitalization type
    let icon = '💳';
    if (calc.capitalizationType === 'auto') icon = '⚡';
    if (calc.capitalizationType === 'manual') icon = '👐';

    row.innerHTML = `
      <td style="text-align: center; font-weight: 600;">${calc.month}</td>
      <td style="text-align: center;">${calc.date}</td>
      <td>${formatNumber(calc.startAmount)}</td>
      <td class="interest-cell">${formatNumber(calc.interestEarned)}</td>
      <td class="tax-cell" style="color:#dc3545;">-${formatNumber(calc.taxAmount)}</td>
      <td class="capitalization-cell" style="color:#28a745;">
        ${icon} ${formatNumber(calc.capitalizedAmount)}
      </td>
      <td class="contribution-cell">+${formatNumber(calc.monthlyContribution)}</td>
      <td class="amount-cell" style="font-weight:700;">
        ${formatNumber(calc.endAmount)}
      </td>
    `;
  });
}
