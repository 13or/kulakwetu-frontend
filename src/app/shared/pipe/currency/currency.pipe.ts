import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agricashCurrency',
  standalone: true,
})
export class AgricashCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, currencyCode: string = 'USD', locale: string = 'fr-FR'): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const amount = Number(value);
    if (Number.isNaN(amount)) {
      return '-';
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  }
}
