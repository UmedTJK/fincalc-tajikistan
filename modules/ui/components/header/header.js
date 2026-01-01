// Компонент Header для FinCalc.TJ
// modules/ui/components/header/header.js

console.log('📦 Header.js загружается...');

class HeaderComponent {
  constructor() {
    console.log('🚀 HeaderComponent создается');
    this.init();
  }

  init() {
    console.log('🔧 HeaderComponent инициализация');
    this.bindEvents();
    this.initNavigation();
  }

  bindEvents() {
    console.log('🔗 HeaderComponent: привязка событий');

    // Навигация
    const navLinks = document.querySelectorAll('[data-nav]');
    console.log(`Найдено ${navLinks.length} навигационных ссылок`);

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-nav');
        console.log(`🔀 Навигация на страницу: ${page}`);
        this.navigateTo(page);
      });
    });

    // Кнопка входа
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        console.log('🔐 Кнопка "Войти"');
        alert('Функция входа в разработке');
      });
    }

    // CTA на hero
    const calcBtn = document.getElementById('heroCalculateBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => {
        console.log('📊 CTA: Рассчитать депозит');
        this.scrollToCalculator();
      });
    }
  }

  initNavigation() {
    console.log('📍 HeaderComponent: инициализация навигации');

    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.nav-bar');
      if (!nav) return console.warn('⚠️ .nav-bar отсутствует при скролле');

      nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    console.log('✨ Навигация активирована');
  }

  scrollToCalculator() {
    console.log('⬇️ Прокрутка к калькулятору');
    const calculator = document.querySelector('.calculator-area');
    if (calculator) calculator.scrollIntoView({ behavior: 'smooth' });
  }

  navigateTo(page) {
    console.log(`📌 Навигация на: ${page}`);
    // позже — router / переключение секций
  }
}

/** 
 * 📍 Экспорт init(), который вызывает загрузчик компонентов
 * ComponentLoader вызывает init() только когда HTML уже вставлен в DOM
 */
export function init() {
  try {
    window.headerComponent = new HeaderComponent();
    console.log('⚙️ HeaderComponent init() выполнен успешно');
  } catch (error) {
    console.error('❌ Ошибка в HeaderComponent init():', error);
  }
}

