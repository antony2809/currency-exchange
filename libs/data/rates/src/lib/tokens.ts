import { InjectionToken } from '@angular/core';

export const RATES_API_URL = new InjectionToken<string>(
  'Nomics API endpoint url'
);

export const RATES_API_KEY = new InjectionToken<string>('Nomics API key');
