// modules/ui/components/export-panel/export-panel.js
console.log('📦 ExportPanel.js загружается...');

// Простой компонент без сложной логики
export function init() {
    console.log('✅ ExportPanel инициализирован');
    
    // Находим кнопки и добавляем обработчики
    const shareBtn = document.getElementById('shareBtn');
    const closeShareBtn = document.getElementById('closeShareBtn');
    const shareOptions = document.getElementById('shareOptions');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (shareOptions) {
                shareOptions.style.display = 'flex';
            }
        });
    }
    
    if (closeShareBtn) {
        closeShareBtn.addEventListener('click', () => {
            if (shareOptions) {
                shareOptions.style.display = 'none';
            }
        });
    }
    
    // Обработчики для кнопок в модальном окне
    document.querySelectorAll('.share-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            console.log('🌐 Выбран тип шаринга:', type);
            
            // Закрываем модальное окно
            if (shareOptions) {
                shareOptions.style.display = 'none';
            }
            
            // Обработка в основном скрипте
            switch(type) {
                case 'text':
                    document.dispatchEvent(new Event('shareAsTextRequested'));
                    break;
                case 'image':
                    document.dispatchEvent(new Event('shareAsImageRequested'));
                    break;
                case 'social':
                    document.dispatchEvent(new Event('shareToSocialRequested'));
                    break;
            }
        });
    });
    
    return true;
}