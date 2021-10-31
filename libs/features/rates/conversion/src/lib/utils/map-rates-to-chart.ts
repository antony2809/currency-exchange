import { ExchangeRateHistory } from '@currency-exchange/data/rates';

export const mapRatesToChart = (rates: ExchangeRateHistory[]) => ({
  series: [
    {
      name: 'Rate',
      data: rates.map((item) => item.rate),
    },
  ],
  chart: {
    type: 'area',
    height: 430,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'straight',
  },
  fill: {
    opacity: 0.3,
  },
  yaxis: {
    min: 0,
  },
});
