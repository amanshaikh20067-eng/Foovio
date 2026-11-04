export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return `₹${Math.round(amount)}`;
}

export function formatGrams(grams: number): string {
  if (isNaN(grams)) return '0g';
  return `${Number(grams.toFixed(1))}g`;
}

export function formatCalories(kcal: number): string {
  if (isNaN(kcal)) return '0 kcal';
  return `${Math.round(kcal)} kcal`;
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
