import { banksData } from '../data/banks.js';

export function initBankSelect() {
  const bankSelect = document.getElementById('bankSelect');
  if (!bankSelect) return;

  bankSelect.innerHTML = `
    <option value="">— выбрать банк —</option>
    ${Object.entries(banksData).map(([key, bank]) => `
      <option value="${key}">${bank.name}</option>
    `).join('')}
  `;
}
