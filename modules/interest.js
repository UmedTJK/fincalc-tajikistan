//
//  interest.js
//  
//
//  Created by SUM TJK on 31.12.25.
//
// 📌 modules/interest.js
// Логика процентов, налогов и капитализации

// modules/interest.js
export function calculateMonthlyInterest(amount, annualRate, taxRate) {
  const gross = amount * (annualRate / 12);
  const tax = gross * taxRate;
  const net = gross - tax;

  return {
    gross,
    tax,
    net
  };
}


