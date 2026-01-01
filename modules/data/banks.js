// modules/data/banks.js
// ВРЕМЕННАЯ версия для UI-связки — позже заменим на полную базу

export const banksData = {
  alif: {
    name: "Алиф Банк",
    products: {
      storing:   { rate: 11, currency: "TJS", type: "Хранение" },
      mukhlatnok: { rate: 16, currency: "TJS", type: "Срочный (Мухлатнок)" },
      dilhoh:    { rate: 15, currency: "TJS", type: "Дилхох (закрыт для новых)" }
    },
  },
  humo: {
    name: "Хумо",
    products: {
      sarchashma: { rate: 16, currency: "TJS", type: "Пополнимый" },
      kafolat: { rate: 16.5, currency: "TJS", type: "Срочный" }
    },
  },
  imon: {
    name: "Имон Интернешнл",
    products: {
      kafolat: { rate: 16, currency: "TJS", type: "Срочный" },
      olikha: { rate: 16.5, currency: "TJS", type: "Гибкий" },
      pursamar: { rate: 16.5, currency: "TJS", type: "Смешанный" }
    },
  },
};
