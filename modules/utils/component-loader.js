// modules/utils/component-loader.js
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
            // 1. Загружаем HTML
            const htmlPath = `${this.componentsPath}${componentName}/${componentName}.html`;
            console.log(`📄 HTML путь: ${htmlPath}`);
            
            const htmlResponse = await fetch(htmlPath);
            if (!htmlResponse.ok) {
                throw new Error(`HTTP ${htmlResponse.status}: ${htmlResponse.statusText}`);
            }
            
            const htmlContent = await htmlResponse.text();
            console.log(`✅ HTML получен (${htmlContent.length} байт)`);
            
            // 2. Вставляем HTML
            container.innerHTML = htmlContent;
            console.log(`✅ HTML вставлен в ${containerSelector}`);
            
            // 3. Пробуем загрузить JS (но не падаем если не получится)
            const jsPath = `${this.componentsPath}${componentName}/${componentName}.js`;
            console.log(`📜 Пробуем JS: ${jsPath}`);
            
            try {
                const module = await import(jsPath);
                console.log(`✅ ${componentName}.js загружен`);
                
                // Если у модуля есть метод init, вызываем его
                if (module && module.init) {
                    await module.init();
                    console.log(`✅ ${componentName} инициализирован`);
                }
                
            } catch (jsError) {
                console.warn(`⚠️ JS для ${componentName} не загружен:`, jsError.message);
                // Продолжаем без JS, но с HTML
            }
            
            return true;
            
        } catch (error) {
            console.error(`💥 Ошибка загрузки ${componentName}:`, error.message);
            
            // Fallback без падения
            container.innerHTML = `
                <div style="padding: 20px; background: #f0f9ff; border: 2px dashed #0ea5e9; border-radius: 8px;">
                    <h3 style="color: #0369a1; margin-top: 0;">${componentName}</h3>
                    <p>Компонент загружается...</p>
                </div>
            `;
            
            return false;
        }
    }
}