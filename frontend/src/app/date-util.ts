/**
 * Parseia string "dd/MM/yyyy HH:mm" ou "dd/MM/yyyy HHhMM" em Date.
 * Aceita tanto o formato do backend (com :) quanto o de exibição (com h).
 * Retorna Invalid Date se o formato não corresponder.
 */
export function parseBrDateTime(value: string | null | undefined): Date {
  if (!value) return new Date(NaN);
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2})[:h](\d{2})$/);
  if (!m) return new Date(NaN);
  const [, day, month, year, hour, minute] = m;
  return new Date(+year, +month - 1, +day, +hour, +minute);
}

/**
 * Formata uma string "dd/MM/yyyy HH:mm" do backend para exibição "dd/MM/yyyy HHhMM".
 * Se já estiver no formato de exibição ou for inválida, retorna '—'.
 */
export function formatBrDateTime(value: string | null | undefined): string {
  const d = parseBrDateTime(value);
  if (isNaN(d.getTime())) return '—';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}h${pad(d.getMinutes())}`;
}

/**
 * Compara duas strings "dd/MM/yyyy HH:mm" para ordenação.
 * Datas inválidas são tratadas como o menor valor possível.
 */
export function compareBrDateTime(a: string | null | undefined, b: string | null | undefined): number {
  const ta = parseBrDateTime(a).getTime();
  const tb = parseBrDateTime(b).getTime();
  return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
}
