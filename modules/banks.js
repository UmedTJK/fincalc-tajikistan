//
//  banks.js
//  
//
//  Created by SUM TJK on 31.12.25.
//

// modules/banks.js
// Bank deposit data for FinCalc.TJ
// Educational project, data may be outdated

export const banksData = {
  "АО МДО «Хумо»": [
    {
      depositName: "Сарчашма",
      minAmount: { TJS: 10, RUB: 10, USD: 1 },
      capitalization: true,
      replenishment: true,
      options: [
        { term: 6,  rates: { TJS: 14, RUB: 9,  USD: 4 } },
        { term: 12, rates: { TJS: 16, RUB: 10, USD: 5 } },
        { term: 24, rates: { TJS: 18, RUB: 11, USD: 6 } }
      ]
    }
  ],

  "Амонатбанк": [
    {
      depositName: "Имруз",
      minAmount: { TJS: 100 },
      capitalization: true,
      replenishment: false,
      options: [
        { term: 12, rates: { TJS: 15 } },
        { term: 24, rates: { TJS: 16 } },
        { term: 36, rates: { TJS: 17 } }
      ]
    }
  ],

  "Банк Эсхата": [
    {
      depositName: "Имконият",
      minAmount: { TJS: 200, USD: 20 },
      capitalization: true,
      replenishment: true,
      options: [
        { term: 6,  rates: { TJS: 13, USD: 4 } },
        { term: 12, rates: { TJS: 14, USD: 5 } },
        { term: 24, rates: { TJS: 15, USD: 6 } }
      ]
    }
  ],

  "Ориёнбанк": [
    {
      depositName: "Боварӣ",
      minAmount: { TJS: 100, RUB: 500 },
      capitalization: false,
      replenishment: true,
      options: [
        { term: 6,  rates: { TJS: 18, RUB: 8 } },
        { term: 12, rates: { TJS: 19, RUB: 9 } },
        { term: 24, rates: { TJS: 20, RUB: 10 } }
      ]
    }
  ]
};
