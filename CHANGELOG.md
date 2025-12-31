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


