export interface ConversionResult {
  id?: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  amountConverted: number;
  oneFromCurrencyConverted: number;
  oneToCurrencyConverted: number;
  date?: Date;
}
