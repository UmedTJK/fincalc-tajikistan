// modules/ui/themes.js

/**
 * Themes UI
 * Controls visual themes and persistence in localStorage
 */

const themes = {
  default: {
    body: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    container: 'white'
  },
  'dark-gradient': {
    body: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    container: 'rgba(18, 18, 18, 0.95)',
    text: '#ffffff'
  },
  futuristic: {
    body: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
    container: 'rgba(255, 255, 255, 0.95)'
  },
  glass: {
    body: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    container: 'rgba(255, 255, 255, 0.95)',
    backdrop: 'blur(20px)'
  },
  premium: {
    body: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
    container: 'rgba(255, 255, 255, 0.98)'
  }
};

/**
 * Apply selected theme
 * @param {string} themeName
 */
export function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const body = document.body;
  const container = document.querySelector('.container');

  body.style.background = theme.body;
  container.style.background = theme.container;

  if (theme.backdrop) {
    container.style.backdropFilter = theme.backdrop;
  } else {
    container.style.backdropFilter = 'none';
  }

  if (theme.text) {
    container.style.color = theme.text;
  } else {
    container.style.color = '#333';
  }

  if (themeName === 'dark-gradient' || themeName === 'futuristic') {
    container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  } else {
    container.style.border = 'none';
  }
}

/**
 * Initialize theme switcher buttons
 */
export function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  if (!themeButtons.length) return;

  const savedTheme = localStorage.getItem('selectedTheme') || 'default';
  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    const theme = btn.getAttribute('data-theme');

    if (theme === savedTheme) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      applyTheme(theme);
      localStorage.setItem('selectedTheme', theme);

      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
