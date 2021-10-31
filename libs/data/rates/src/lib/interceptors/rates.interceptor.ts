import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RATES_API_KEY } from '@currency-exchange/data/rates';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class RatesInterceptor implements HttpInterceptor {
  constructor(@Inject(RATES_API_KEY) public apiKey: string) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    request = request.clone({
      params: new HttpParams().set('key', this.apiKey),
    });

    return next.handle(request);
  }
}
