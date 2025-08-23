
export function formatCurrency(value: number | string, locale = 'pt-BR', currency = 'BRL'): string {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numberValue)) return 'R$ 0,00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(numberValue);
}
