export class ComponentLoader {
    constructor() {
        this.componentsPath = './modules/ui/components/';
    }

    async load(componentName, containerSelector) {
        console.log(`📦 Загружаем компонент: ${componentName}`);
        
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`❌ Контейнер не найден: ${containerSelector}`);
            return false;
        }

        try {
            // Загружаем HTML
            const htmlPath = `${this.componentsPath}${componentName}/${componentName}.html`;
            console.log(`📄 HTML путь: ${htmlPath}`);
            
            const htmlResponse = await fetch(htmlPath);
            if (!htmlResponse.ok) {
                throw new Error(`HTTP ${htmlResponse.status}: ${htmlResponse.statusText}`);
            }
            
            const htmlContent = await htmlResponse.text();
            console.log(`✅ HTML получен (${htmlContent.length} байт)`);
            
            // Вставляем HTML
            container.innerHTML = htmlContent;
            console.log(`✅ HTML вставлен в ${containerSelector}`);
            
            // Загружаем JS
            const jsPath = `${this.componentsPath}${componentName}/${componentName}.js`;
            console.log(`📜 JS путь: ${jsPath}`);
            
            try {
                const module = await import(jsPath);
                console.log(`✅ ${componentName}.js загружен`);
                
                // Если у модуля есть метод init, вызываем его
                if (module && module.init) {
                    await module.init();
                    console.log(`✅ ${componentName} инициализирован`);
                }
                
                return true;
            } catch (jsError) {
                console.warn(`⚠️ JS для ${componentName} не загружен или нет init():`, jsError.message);
                // Продолжаем без JS, но с HTML
                return true;
            }
            
        } catch (error) {
            console.error(`💥 Ошибка загрузки ${componentName}:`, error);
            container.innerHTML = `<div class="error">Ошибка загрузки компонента ${componentName}</div>`;
            return false;
        }
    }
}