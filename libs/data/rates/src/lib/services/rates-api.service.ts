import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExchangeRate, ExchangeRateHistory } from '../models';
import { RATES_API_URL } from '../tokens';

@Injectable()
export class RatesApiService {
  constructor(
    @Inject(RATES_API_URL) private apiUrl: string,
    private http: HttpClient
  ) {}

  public fetchExchangeRates() {
    return this.http.get<ExchangeRate[]>(`${this.apiUrl}/exchange-rates`);
  }

  public fetchCurrencyHistory(
    currency: string,
    fromDate: string,
    toDate: string
  ) {
    return this.http.get<ExchangeRateHistory[]>(
      `${this.apiUrl}/exchange-rates/history?currency=${currency}&start=${fromDate}&end=${toDate}`
    );
  }
}
