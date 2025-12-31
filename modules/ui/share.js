// modules/ui/share.js

/**
 * Share UI
 * Web Share API + fallback + modal actions
 */

let shareData = null;

/**
 * Prepare share data from current calculation
 * @param {Object} params
 */
function prepareShareData(params) {
  const {
    initialDeposit,
    annualRate,
    taxRate,
    monthlyContribution,
    termMonths,
    finalAmount,
    totalInterest,
    formatNumber
  } = params;

  shareData = {
    initialDeposit,
    annualRate,
    taxRate,
    monthlyContribution,
    termMonths,
    finalAmount,
    totalInterest,
    url: window.location.href,
    timestamp: new Date().toLocaleString('ru-RU'),
    formatNumber
  };

  return shareData;
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-weight: 500;
    max-width: 300px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

function fallbackShare(text) {
  navigator.clipboard.writeText(text)
    .then(() => showNotification('✅ Текст скопирован в буфер обмена!'))
    .catch(() => alert('📋 Скопируйте текст:\n\n' + text));
}

export function shareCalculation(params) {
  const data = prepareShareData(params);
  const text = `💰 РАСЧЕТ ДЕПОЗИТА - FinCalc.TJ

📊 Параметры:
• Начальная сумма: ${data.formatNumber(data.initialDeposit)} TJS
• Годовая ставка: ${data.annualRate}%
• Налог: ${data.taxRate}%
• Пополнение: ${data.formatNumber(data.monthlyContribution)} TJS/мес
• Срок: ${data.termMonths} месяцев

📈 Результаты:
• Итоговая сумма: ${data.formatNumber(data.finalAmount)} TJS
• Общий доход: ${data.formatNumber(data.totalInterest)} TJS
• Дата расчета: ${data.timestamp}

🔗 ${data.url}`;

  if (navigator.share) {
    navigator.share({
      title: 'Расчет депозита - FinCalc.TJ',
      text,
      url: data.url
    }).catch(() => fallbackShare(text));
  } else {
    fallbackShare(text);
  }
}

export function showShareOptions() {
  document.getElementById('shareOptions').style.display = 'flex';
}

export function hideShareOptions() {
  document.getElementById('shareOptions').style.display = 'none';
}

export function shareAsText() {
  if (!shareData) return;
  const { formatNumber } = shareData;

  const text = `💰 РАСЧЕТ ДЕПОЗИТА - FinCalc.TJ

📊 Параметры:
• Начальная сумма: ${formatNumber(shareData.initialDeposit)} TJS
• Годовая ставка: ${shareData.annualRate}%
• Налог: ${shareData.taxRate}%
• Пополнение: ${formatNumber(shareData.monthlyContribution)} TJS/мес
• Срок: ${shareData.termMonths} месяцев

📈 Результаты:
• Итоговая сумма: ${formatNumber(shareData.finalAmount)} TJS
• Общий доход: ${formatNumber(shareData.totalInterest)} TJS
• Дата расчета: ${shareData.timestamp}

🔗 ${shareData.url}`;

  if (navigator.share) {
    navigator.share({ title: 'Мой расчет депозита', text, url: shareData.url });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('✅ Текст скопирован!');
      hideShareOptions();
    });
  }
}

export function shareAsImage(takeChartScreenshot) {
  takeChartScreenshot();
  hideShareOptions();
  showNotification('📸 Скриншот графика сохранен!');
}

export function shareToSocial() {
  if (!shareData) return;
  const text = encodeURIComponent('Посмотрите мой расчет депозита на FinCalc.TJ!');
  const url = encodeURIComponent(shareData.url);
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  hideShareOptions();
}
