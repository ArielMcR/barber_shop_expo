/**
 * Formatação de valores exibidos. Fica fora das telas porque relatórios e
 * detalhamento mostram os mesmos números — duas cópias divergiriam na primeira
 * mudança de casa decimal.
 */

export const formatarMoeda = (valor: number | undefined | null): string =>
    `R$ ${Number(valor ?? 0).toFixed(2).replace('.', ',')}`;

/** `40` → `40 min`; `90` → `1h30`; `120` → `2h`. */
export const formatarDuracao = (minutos: number | undefined | null): string => {
    const total = Number(minutos ?? 0);
    if (total < 60) return `${total} min`;

    const horas = Math.floor(total / 60);
    const resto = total % 60;
    return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, '0')}`;
};

/** `2026-08-21` → `21/08`. A data já vem em dia local do back-end. */
export const formatarDiaMes = (dataISO: string): string => {
    const [, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}`;
};

const DIAS_CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

/** `2026-08-21` → `SEX`. Monta a data em local para não escorregar de dia. */
export const diaDaSemanaCurto = (dataISO: string): string => {
    const [ano, mes, dia] = dataISO.split('-').map(Number);
    return DIAS_CURTOS[new Date(ano, mes - 1, dia).getDay()];
};
