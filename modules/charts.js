//
//  charts.js
//  
//
//  Created by SUM TJK on 31.12.25.
//
// modules/charts.js
// Chart data preparation for FinCalc.TJ
// Pure functions: no DOM, no Chart.js

/**
 * Builds a time series for a single scenario (e.g. with/without capitalization)
 * @param {Array} calculations - monthly calculations array
 * @returns {{labels: string[], values: number[]}}
 */
export function buildTimeSeries(calculations) {
  const labels = [];
  const values = [];

  calculations.forEach(item => {
    labels.push(item.date);
    values.push(item.endAmount);
  });

  return { labels, values };
}

/**
 * Builds comparison series for multiple scenarios
 * @param {Object} scenarios - map { scenarioName: calculations[] }
 * @returns {{labels: string[], series: Object}}
 */
export function buildComparisonSeries(scenarios) {
  const scenarioNames = Object.keys(scenarios);
  const firstScenario = scenarios[scenarioNames[0]] || [];

  const labels = firstScenario.map(item => item.date);
  const series = {};

  scenarioNames.forEach(name => {
    series[name] = scenarios[name].map(item => item.endAmount);
  });

  return { labels, series };
}

