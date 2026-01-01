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
  "Alif Bank": {
    products: [
      {
        name: "Максад",
        type: "profit_sharing",
        currency: ["TJS","USD"],
        rates: { TJS:"10-11%", USD:"до 5%" },
        profitShare: { client: "35%", bank: "65%" },
        term: "бессрочный / 12 мес рекомендация",
        withdrawal: "свободно",
        replenishment: "без ограничений",
        minAmount: { TJS:1, USD:1 },
        taxable: true,
        riskNotes: [
          "доход зависит от прибыли банка",
          "нет гарантии фиксированного процента"
        ]
      },
      {
        name: "Мухлатнок",
        type: "profit_sharing_fixed",
        currency: ["TJS","USD"],
        rates: { TJS:"до 16%", USD:"до 7%" },
        profitShare: { client: "50%", bank: "50%" },
        term: "12 мес",
        withdrawal: "запрещено до срока",
        replenishment: "первые 3 месяца",
        minAmount: { TJS:1, USD:1 },
        taxable: true
      }
    ]
  },

  "Humo": {
    products: [
      {
        name: "Сарчашма",
        type: "classic",
        currency: ["TJS","RUB","USD"],
        rates: { TJS:"16%", RUB:"10%", USD:"5%" },
        term: "6–24 мес",
        replenishment: "разрешено",
        withdrawal: "по условиям договора",
        minAmount: { TJS:10, RUB:10, USD:1 },
        taxable: true
      },
      {
        name: "Кафолат",
        type: "classic",
        currency: ["TJS","USD"],
        rates: { TJS:"16.5%", USD:"до 6%" },
        term: "12 мес",
        replenishment: "да",
        withdrawal: "есть ограничения",
        taxable: true
      }
    ]
  },

  "Imon International": {
    products: [
      {
        name: "Кафолат",
        type: "classic",
        currency: ["TJS","USD","RUB"],
        rates: { TJS:"16%", USD:"5%", RUB:"10%" },
        term: "13 мес",
        partialWithdrawal: "до 20% 1 раз после 2 мес",
        taxable: true
      },
      {
        name: "Пурсамар",
        type: "flex-fixed",
        currency: ["TJS"],
        rates: {
          "3-6м": "10%",
          "6-12м": "12%",
          "12-24м": "16.5-17%"
        },
        term: "3–24 мес",
        replenishment: "да",
        partialWithdrawal: "да",
        autoProlongation: true,
        taxable: true
      },
      {
        name: "Олиха",
        type: "ladder",
        currency: ["TJS","USD","RUB"],
        rates: {
          "3-6м": {TJS:"10%",USD:"1%",RUB:"3%"},
          "6-9м": {TJS:"12%",USD:"2%",RUB:"5%"},
          "9-13м":{TJS:"12%",USD:"3%",RUB:"7%"},
          "13-24м":{TJS:"16.5%",USD:"6.1%",RUB:"10%"}
        },
        term: "3–24 мес",
        capitalization: true,
        replenishment: "да",
        taxable: true
      }
    ]
  },

  "Коммерцбанк Таджикистана": {
    products: [
      {
        name: "Срочные вклады",
        type: "classic",
        currency: ["TJS","USD","EUR"],
        rates: {
          "до 12м": {TJS:"9%",USD:"5%",EUR:"3%"},
          "12-24м": {TJS:"10%",USD:"6%",EUR:"4%"},
          "24-36м": {TJS:"11%",USD:"7%",EUR:"5%"}
        },
        capitalization: "по запросу",
        taxable: true
      }
    ]
  },

  "IBT — Int.BT": {
    products: [
      {
        name: "Ҷамъ",
        type: "classic",
        currency: ["TJS","USD","RUB","EUR","CNY"],
        rates: "до 14% (в зависимости от валюты и срока)",
        replenishment: "да",
        withdrawal: "да, условия договорные",
        taxable: true
      }
    ]
  }
}
