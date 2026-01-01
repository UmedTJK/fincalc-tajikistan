import { banksData } from '../data/banks.js';

export function initProductSelect() {
  const bankSelect = document.getElementById('bankSelect');
  const productSelect = document.getElementById('productSelect');

  if (!bankSelect || !productSelect) return;

  bankSelect.addEventListener('change', () => {
    const bankKey = bankSelect.value;
    const bank = banksData[bankKey];

    if (!bank) {
      productSelect.innerHTML = '<option>— Сначала выберите банк —</option>';
      return;
    }

    productSelect.innerHTML = `
      ${Object.entries(bank.products).map(([key, p]) => `
        <option value="${key}">${p.type} — ${p.rate}% годовых</option>
      `).join('')}
    `;
  });
}
