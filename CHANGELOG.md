# 🧱 VERSIONING.md — правила версий

Формат версий:  
`vМАЙОР.МИН0Р.ПАТЧ`

### 🎛 Значения

| Часть | Что меняется | Пример |
|-------|---------------|---------|
| MAJOR | архитектура / новые принципы | v1.0 → v2.0 |
| MINOR | новый функционал / модули | v0.4 → v0.5 |
| PATCH | исправления, правки | v0.4.0 → v0.4.1 |

---

## 🚀 Текущая версия проекта

# 🧱 CHANGELOG.md — история изменений

## v0.6.1 — Pre-Design Snapshot (Safe Checkpoint)
**Release date:** 2026-01-01

### Purpose
- 🔒 Создан безопасный чекпоинт перед началом редизайна интерфейса
- 🎨 Подготовка к интеграции нового бизнес-минималистичного дизайна (v2)

### Notes
- Нет изменений в логике / UI
- Это точка возврата, если дизайн потребует отката


## v0.6.0 — Bank Integration 2.0 & Calculation Fixes
**Release date:** 2025-01-01

### Added
- **Bank Integration 2.0**: Полная интеграция банковских продуктов с формой калькулятора
- **Новый модуль `applyProductRules.js`**: Автоматическое заполнение полей формы при выборе депозита
- **Защита правил продуктов**: Блокировка полей согласно условиям депозита (ставка, валюта, пополнение)

### Fixed
- **Критический баг**: Исправлена пустая таблица помесячного прогноза
- **Исправлен график**: Теперь корректно отображает сравнение трех типов капитализации
- **Синхронизация расчетов**: Итоговые суммы теперь согласованы с данными в таблице
- **Правило первого месяца**: Проценты корректно не начисляются в первый месяц депозита

### Changed
- **Архитектура**: Убраны неиспользуемые импорты, оптимизирован `script.js`
- **Логика расчета**: Единообразное использование `interest.js` для всех расчетов
- **Инициализация**: Улучшена последовательность загрузки модулей

### Technical
- **Модульная структура**: Все UI-компоненты полностью разделены по модулям
- **Обработка ошибок**: Добавлены try-catch блоки и консоль-логирование
- **Совместимость**: Сохранена работа всех существующих функций (экспорт, темы, шаринг)

### Notes
- Бизнес-логика расчета процентов и налогов осталась неизменной
- Все формулы расчета проверены на корректность
- Проект готов к дальнейшему развитию и добавлению новых банков

---

## v0.5.2 — Structural Cleanup
**Release date:** 2024-12-31

### Changed
- Reorganized `script.js` into clear logical sections
- Removed chaotic function order and improved file predictability
- Centralized UI updates in `calculateDeposit()`

### Notes
- No behavior changes
- No business logic changes
- No formula, rate, tax, or capitalization changes

[остальная история изменений...]

## v0.5.2 — Structural Cleanup

### Changed
- Reorganized `script.js` into clear logical sections
- Removed chaotic function order and improved file predictability
- Centralized UI updates in `calculateDeposit()`

### Notes
- No behavior changes
- No business logic changes
- No formula, rate, tax, or capitalization changes


## v0.5.1 — Stability & UI Fixes

### Fixed
- Fixed broken data flow causing empty monthly forecast table
- Fixed empty deposit growth chart after UI refactor
- Fixed critical syntax error in `share.js` that stopped JS execution
- Removed broken template literal fragment from share module
- Replaced undefined `showToast` with `showNotification`

### Improved
- Added safety checks to prevent rendering table with empty data
- Added runtime assertions to validate calculation and chart data flow
- Standardized Share UI logic and fallback behavior

### Notes
- No business logic or financial formulas were changed
- Calculations, interest, taxes, and capitalization logic remain intact


## v0.5.0 — UI Refactor & Stabilization
**Release date:** 2025-12-31

### Changed
- UI logic fully extracted into `/modules/ui`
  - Chart rendering (`chart-ui.js`)
  - Calculations table rendering (`table.js`)
  - Theme switcher (`themes.js`)
  - Share / Web Share API logic (`share.js`)
- `script.js` reduced to orchestration layer only
- Application initialization stabilized (single DOMContentLoaded entry point)
- Improved separation of concerns (UI vs business logic)
- Project structure aligned for long-term maintainability and AI-assisted refactoring

### Fixed
- UI initialization order issues
- Chart and table rendering inconsistencies
- Theme application timing issues
- Share logic causing JS runtime errors

### Notes
- No changes to calculation formulas or business logic
- This release is a structural refactor focused on code quality and stability


## v0.4.5 – Refactor only

### Changed
- Structured `script.js` into clear architectural sections
- Improved readability and maintainability
- No logic or behavior changes


## v0.4.6
### Added
- Live demo deployed via GitHub Pages (https://umedtjk.github.io/fincalc-tajikistan/)


## v0.4.5
### Changed
- Extracted PDF export logic into `modules/export/pdf.js`
- Unified export architecture (CSV & PDF)


## v0.4.4
### Changed
- Stabilized modular architecture after CSV and charts refactor
- Extracted chart data preparation into `modules/charts.js`
- Extracted CSV export logic into `modules/export/csv.js`
- Implemented proper comparison of capitalization scenarios


## v0.4.3
### Changed
- Extracted CSV export logic into `modules/export/csv.js`
- Simplified `exportToExcel()` UI controller

## v0.4.2
### Changed
- Extracted bank deposit data into `modules/banks.js`
- Improved modular structure without changing calculation logic

## v0.4.1
- refactor: moved monthly interest calculation to interest module

v0.4.0 — расчетный движок + графики + экспорт


## 📈 Ближайшие версии

| Версия | Цель |
|--------|------|
| v0.5.0 | перевод TJ + модульные функции (начало) |
| v0.6.0 | ES Modules + структура `/modules` |
| v0.7.0 | PWA + кэширование |
| v1.0.0 | публичный релиз, GitHub Pages стабильный |
| v2.0.0 | API курсов, JSON вкладов, обновления |

---

## 📌 Пример, как принимать решение

> Если мы добавим капитализацию “годовую”?  
Это **MINOR** → v0.5 → v0.6

> Если перепишем архитектуру на модули?  
Это **MAJOR** → v1.0

> Если исправим ошибку в формуле?  
Это **PATCH** → v0.4.1

---

📌 **Правило: версия растёт при каждом GitHub Release.**
```

---


