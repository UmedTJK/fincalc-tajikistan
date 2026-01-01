// Компонент: Панель экспорта
// modules/ui/components/export-panel/export-panel.js
console.log('📦 ExportPanel.js загружается...');

// ============================
// Класс компонента
// ============================
class ExportPanelComponent {
    constructor() {
        console.log('🚀 ExportPanelComponent создается');
        this.init();
    }

    init() {
        console.log('🔧 ExportPanelComponent инициализация');
        this.bindEvents();
    }

    bindEvents() {
        console.log('🔗 Привязка событий ExportPanel');

        const bind = (id, handler) => {
            const el = document.getElementById(id);
            if (!el) return console.warn(`⚠️ Элемент не найден: #${id}`);
            el.addEventListener('click', handler);
        };

        bind('exportBtn',    () => this.exportToExcel());
        bind('exportPdfBtn', () => this.exportToPDF());
        bind('screenshotBtn',() => this.captureScreenshot());
        bind('shareBtn',     () => this.showShareOptions());
        bind('closeShareBtn',() => this.hideShareOptions());

        document.querySelectorAll('.share-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-type');
                this.handleShareOption(type);
            });
        });
    }

    // 📤 Триггеры для обработки в основном приложении
    exportToExcel() {
        console.log('📊 Запрос экспорта в Excel');
        document.dispatchEvent(new Event('exportToExcelRequested'));
    }

    exportToPDF() {
        console.log('📄 Запрос экспорта в PDF');
        document.dispatchEvent(new Event('exportToPDFRequested'));
    }

    captureScreenshot() {
        console.log('📸 Запрос создания скриншота');
        document.dispatchEvent(new Event('captureScreenshotRequested'));
    }

    showShareOptions() {
        console.log('📱 Открытие меню шаринга');
        const modal = document.getElementById('shareOptions');
        if (modal) modal.style.display = 'flex';
    }

    hideShareOptions() {
        console.log('❌ Закрытие меню шаринга');
        const modal = document.getElementById('shareOptions');
        if (modal) modal.style.display = 'none';
    }

    handleShareOption(type) {
        console.log(`🌐 Запрос шаринга: ${type}`);

        const eventMap = {
            text:  'shareAsTextRequested',
            image: 'shareAsImageRequested',
            social:'shareToSocialRequested'
        };

        if (eventMap[type]) {
            document.dispatchEvent(new Event(eventMap[type]));
        }

        this.hideShareOptions();
    }

    shareToSocial() {
        console.log('🌐 Шаринг через Web Share API');

        if (!navigator.share) {
            alert('Браузер не поддерживает Web Share API.');
            return;
        }

        navigator.share({
            title: 'FinCalc.TJ - Расчет депозита',
            text:  'Посмотри мой расчет депозита 👇',
            url: window.location.href
        })
        .then(()  => console.log('✨ Успешный шаринг'))
        .catch(err => console.log('❌ Ошибка шаринга:', err));
    }
}


// ============================
// 📌 ТОЧКА ВХОДА ДЛЯ COMPONENT-LOADER
// ============================
export function init() {
    try {
        window.exportPanelComponent = new ExportPanelComponent();
        console.log('⚙️ ExportPanel init() выполнен');
    } catch (err) {
        console.error('❌ Ошибка init ExportPanelComponent:', err);
    }
}
