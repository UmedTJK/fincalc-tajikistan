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
export function prepareShareData(params) {
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
    formatNumber,
    url: window.location.href,
    timestamp: new Date().toLocaleString('ru-RU')
  };

  return shareData;
}

/* =======================
   Helpers
======================= */

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
  navigator.clipboard
    .writeText(text)
    .then(() => showNotification('✅ Текст скопирован в буфер обмена!'))
    .catch(() => alert('📋 Скопируйте текст:\n\n' + text));
}

/* =======================
   Share actions
======================= */

export function shareCalculation(text) {
  if (navigator.share) {
    navigator.share({
      title: 'Расчёт депозита — FinCalc.TJ',
      text
    });
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

  const text = `💰 РАСЧЕТ ДЕПОЗИТА — FinCalc.TJ

📊 Параметры:
• Начальная сумма: ${formatNumber(shareData.initialDeposit)} TJS
• Годовая ставка: ${shareData.annualRate}%
• Налог: ${shareData.taxRate}%
• Пополнение: ${formatNumber(shareData.monthlyContribution)} TJS/мес
• Срок: ${shareData.termMonths} месяцев

📈 Результаты:
• Итоговая сумма: ${formatNumber(shareData.finalAmount)} TJS
• Общий доход: ${formatNumber(shareData.totalInterest)} TJS
• Дата расчёта: ${shareData.timestamp}

🔗 ${shareData.url}`;

  if (navigator.share) {
    navigator.share({
      title: 'Мой расчёт депозита',
      text,
      url: shareData.url
    });
  } else {
    fallbackShare(text);
  }

  hideShareOptions();
}

export function shareAsImage(takeChartScreenshot) {
  if (typeof takeChartScreenshot !== 'function') return;

  takeChartScreenshot();
  showNotification('📸 Скриншот графика сохранён!');
  hideShareOptions();
}

export function shareToSocial() {
  if (!shareData) return;

  const message = encodeURIComponent(
    `Посмотри мой расчёт депозита на FinCalc.TJ:\n${shareData.url}`
  );
  const url = encodeURIComponent(shareData.url);

  const services = {
    telegram:  `https://t.me/share/url?url=${url}&text=${message}`,
    whatsapp:  `https://wa.me/?text=${message}`,
    viber:     `viber://forward?text=${message}`,
    vk:        `https://vk.com/share.php?url=${url}&title=${message}`,
    messenger: `fb-messenger://share/?link=${url}`,
    instagram: null // ⚠️ Нельзя напрямую — предложим копирование
  };

  // Если браузер поддерживает системный Web Share API → даем шанс
  if (navigator.share) {
    navigator.share({ text: message, url: shareData.url })
      .catch(err => console.log('WebShare API error:', err));
    hideShareOptions();
    return;
  }

  // 🧠 Выбор соцсети через prompt (временно)
  const choice = prompt(
    "Куда поделиться?\n" +
    "1️⃣ Telegram\n2️⃣ WhatsApp\n3️⃣ Viber\n4️⃣ VK\n5️⃣ Messenger\n6️⃣ Instagram (копировать текст)"
  );

  const map = {
    1: 'telegram',
    2: 'whatsapp',
    3: 'viber',
    4: 'vk',
    5: 'messenger',
    6: 'instagram'
  };

  const key = map[choice];

  if (!key) return hideShareOptions();

  if (key === 'instagram') {
    fallbackShare(decodeURIComponent(message));
    return;
  }

  window.open(services[key], '_blank');

  hideShareOptions();
}
