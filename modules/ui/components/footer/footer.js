// modules/ui/components/Footer.js
export class Footer {
  constructor() {
    this.container = null;
  }

  // Метод для рендеринга футера
  render() {
    const currentYear = new Date().getFullYear();
    
    return `
      <footer class="footer" role="contentinfo">
        <div class="footer__container">
          <!-- Логотип и описание -->
          <div class="footer__brand">
            <div class="footer__logo">
              <span class="footer__logo-text">FinCalc.TJ</span>
              <span class="footer__version">v0.6.1</span>
            </div>
            <p class="footer__description">
              Калькулятор депозитов для Таджикистана. Рассчитайте доходность по вкладам в ведущих банках страны.
            </p>
          </div>

          <!-- Основные разделы футера -->
          <div class="footer__sections">
            <!-- Раздел "Навигация" -->
            <div class="footer__section">
              <h3 class="footer__section-title">Навигация</h3>
              <ul class="footer__links">
                <li><button class="footer__link" data-action="scroll-to-calculator">Калькулятор</button></li>
                <li><button class="footer__link" data-action="scroll-to-results">Результаты</button></li>
                <li><button class="footer__link" data-action="scroll-to-chart">График</button></li>
                <li><button class="footer__link" data-action="scroll-to-table">Таблица</button></li>
              </ul>
            </div>

            <!-- Раздел "Образование" -->
            <div class="footer__section">
              <h3 class="footer__section-title">Обучение</h3>
              <ul class="footer__links">
                <li><a href="https://www.investopedia.com/terms/d/deposit.asp" target="_blank" class="footer__link">Как работает депозит</a></li>
                <li><button class="footer__link" data-action="show-tooltips">Финансовые термины</button></li>
                <li><button class="footer__link" data-action="compare-banks">Сравнение банков</button></li>
                <li><button class="footer__link" data-action="show-inflation">Инфляция и доходность</button></li>
              </ul>
            </div>

            <!-- Раздел "О проекте" -->
            <div class="footer__section">
              <h3 class="footer__section-title">О проекте</h3>
              <ul class="footer__links">
                <li><button class="footer__link" data-action="about">О FinCalc.TJ</button></li>
                <li><button class="footer__link" data-action="contact">Обратная связь</button></li>
                <li><button class="footer__link" data-action="privacy">Политика конфиденциальности</button></li>
                <li><button class="footer__link" data-action="terms">Условия использования</button></li>
              </ul>
            </div>

            <!-- Раздел "Банки-партнеры" -->
            <div class="footer__section">
              <h3 class="footer__section-title">Банки Таджикистана</h3>
              <div class="footer__banks">
                <button class="footer__bank-badge" data-bank="amonat">Амонэтбонк</button>
                <button class="footer__bank-badge" data-bank="eskhata">Эсхата</button>
                <button class="footer__bank-badge" data-bank="orien">Ориёнбонк</button>
                <button class="footer__bank-badge" data-bank="savdogar">Савдоғарбонк</button>
                <button class="footer__bank-badge" data-bank="arvand">Арванд</button>
                <button class="footer__bank-badge" data-bank="khatam">Хотам</button>
              </div>
            </div>
          </div>

          <!-- Нижняя часть футера -->
          <div class="footer__bottom">
            <div class="footer__copyright">
              © ${currentYear} FinCalc.TJ. Все права защищены.
              <br>
              Информация предоставляется в ознакомительных целях. Актуальные ставки уточняйте в банках.
            </div>
            
            <div class="footer__social">
              <button class="footer__social-button" aria-label="Поделиться в Facebook" data-action="share-facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button class="footer__social-button" aria-label="Поделиться в Telegram" data-action="share-telegram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.538-.196 1.006.128.832.941z"/>
                </svg>
              </button>
              <button class="footer__share-button" id="footerShareBtn" data-action="share">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                <span>Поделиться</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // Метод для инициализации событий
  initEvents() {
    // Навигация по странице
    document.querySelectorAll('[data-action^="scroll-"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = e.target.closest('button').dataset.action;
        this.handleNavigation(action);
      });
    });

    // Кнопки банков
    document.querySelectorAll('.footer__bank-badge').forEach(badge => {
      badge.addEventListener('click', (e) => {
        const bankName = e.target.textContent;
        const bankCode = e.target.dataset.bank;
        this.handleBankSelect(bankName, bankCode);
      });
    });

    // Социальные кнопки
    document.querySelectorAll('[data-action^="share"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.closest('button').dataset.action;
        this.handleSocialAction(action);
      });
    });

    // Остальные кнопки
    document.querySelectorAll('.footer__link[data-action]').forEach(link => {
      link.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handleAction(action);
      });
    });
  }

  // Обработчик навигации
  handleNavigation(action) {
    console.log(`Навигация: ${action}`);
    
    const scrollToElement = (selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
      return false;
    };

    switch(action) {
      case 'scroll-to-calculator':
        scrollToElement('#calculator-container') || scrollToElement('.input-section');
        break;
      case 'scroll-to-results':
        scrollToElement('.results-section');
        break;
      case 'scroll-to-chart':
        scrollToElement('.chart-container') || scrollToElement('#depositChart');
        break;
      case 'scroll-to-table':
        scrollToElement('.table-container') || scrollToElement('#calculationsTable');
        break;
    }
  }

  // Обработчик выбора банка
  handleBankSelect(bankName, bankCode) {
    console.log(`Выбран банк: ${bankName} (${bankCode})`);
    
    // Ищем селектор банка на странице
    const bankSelect = document.getElementById('bankSelect');
    if (bankSelect) {
      // Пытаемся найти опцию с этим банком
      for (let option of bankSelect.options) {
        if (option.text.includes(bankName) || option.value.includes(bankCode)) {
          bankSelect.value = option.value;
          bankSelect.dispatchEvent(new Event('change'));
          break;
        }
      }
    }
    
    // Прокручиваем к калькулятору
    this.handleNavigation('scroll-to-calculator');
  }

  // Обработчик социальных действий
  handleSocialAction(action) {
    const url = window.location.href;
    const title = 'FinCalc.TJ - Калькулятор депозитов Таджикистана';
    const text = 'Посчитайте доходность по депозитам в банках Таджикистана';
    
    switch(action) {
      case 'share-facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'share-telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: title,
            text: text,
            url: url
          });
        } else {
          // Fallback
          this.handleSocialAction('share-telegram');
        }
        break;
    }
  }

  // Обработчик других действий
  handleAction(action) {
    console.log(`Действие: ${action}`);
    
    switch(action) {
      case 'show-tooltips':
        alert('Подсказки будут показаны при наведении на элементы формы');
        break;
      case 'compare-banks':
        alert('Сравнение банков будет реализовано в следующей версии');
        break;
      case 'show-inflation':
        alert('Расчет с учетом инфляции будет добавлен в v1.0');
        break;
      case 'about':
        alert('FinCalc.TJ - калькулятор депозитов для Таджикистана\nВерсия 0.6.1\n© 2024');
        break;
      case 'contact':
        // Можно открыть форму обратной связи
        window.open('mailto:contact@fincalc.tj?subject=Обратная связь FinCalc.TJ');
        break;
      case 'privacy':
        alert('Политика конфиденциальности будет добавлена в ближайшее время');
        break;
      case 'terms':
        alert('Условия использования будут опубликованы с выпуском v1.0');
        break;
    }
  }

  // Основной метод инициализации
  init(container) {
    this.container = container;
    this.container.innerHTML = this.render();
    this.initEvents();
    console.log('✅ Footer component initialized');
  }
}