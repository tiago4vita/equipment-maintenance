export const DESCRICAO_EQUIPAMENTO_EXIBICAO_MAX = 30;

export function truncarTexto(
  texto: string | null | undefined,
  limite = DESCRICAO_EQUIPAMENTO_EXIBICAO_MAX
): string {
  const t = texto ?? '';
  return t.length > limite ? `${t.slice(0, limite)}...` : t;
}
