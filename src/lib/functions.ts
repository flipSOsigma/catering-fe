export function dateFormating(isoDate: string): string {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('id-ID', options);
}
