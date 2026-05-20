import type { SolicitationStatus } from './components/solicitation-row/solicitation-row';
import type { StatusManutencao } from './models/cliente-integracao.model';

export interface SolicitationStatusTheme {
  bg: string;
  text: string;
  subText: string;
}

function createTheme(bgVar: string, textVar: string): SolicitationStatusTheme {
  return {
    bg: `var(${bgVar})`,
    text: `var(${textVar})`,
    subText: `color-mix(in srgb, var(${textVar}) 70%, transparent)`
  };
}

export const API_STATUS_THEMES: Record<StatusManutencao, SolicitationStatusTheme> = {
  ABERTA: createTheme('--color-row-open-bg', '--color-row-open-text'),
  ORCADA: createTheme('--color-row-quoted-bg', '--color-row-quoted-text'),
  APROVADA: createTheme('--color-row-approved-bg', '--color-row-approved-text'),
  REJEITADA: createTheme('--color-row-rejected-bg', '--color-row-rejected-text'),
  REDIRECIONADA: createTheme('--color-row-redirected-bg', '--color-row-redirected-text'),
  ARRUMADA: createTheme('--color-row-fixed-bg', '--color-row-fixed-text'),
  PAGA: createTheme('--color-row-paid-bg', '--color-row-paid-text'),
  FINALIZADA: createTheme('--color-row-finished-bg', '--color-row-finished-text')
};

export const UI_STATUS_THEMES: Record<SolicitationStatus, SolicitationStatusTheme> = {
  aberta: API_STATUS_THEMES.ABERTA,
  orcada: API_STATUS_THEMES.ORCADA,
  aprovada: API_STATUS_THEMES.APROVADA,
  rejeitada: API_STATUS_THEMES.REJEITADA,
  redirecionada: API_STATUS_THEMES.REDIRECIONADA,
  arrumada: API_STATUS_THEMES.ARRUMADA,
  paga: API_STATUS_THEMES.PAGA,
  finalizada: API_STATUS_THEMES.FINALIZADA,
  resgatada: createTheme('--color-row-rescued-bg', '--color-row-rescued-text')
};

export function getApiStatusTheme(status: StatusManutencao): SolicitationStatusTheme {
  return API_STATUS_THEMES[status];
}

export function getUiStatusTheme(status: SolicitationStatus): SolicitationStatusTheme {
  return UI_STATUS_THEMES[status];
}
