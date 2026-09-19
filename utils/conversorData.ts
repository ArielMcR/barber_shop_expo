/**
 * Data no formato YYYY-MM-DD a partir dos componentes **locais**.
 *
 * Não troque por `toISOString().split('T')[0]`: aquilo devolve a data em UTC, e
 * no Brasil (UTC−3) qualquer horário a partir das 21h já caiu no dia seguinte.
 * Como as chaves da agenda são geradas assim, o app inteiro passava a apontar
 * para o dia errado à noite, e os agendamentos sumiam da tela.
 */
export const paraDataLocalISO = (date: Date): string => {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

export const startOfDay = (date: Date): Date => {
    return new Date(date.setHours(0, 0, 0, 0));
};

export const endOfDay = (date: Date): Date => {
    return new Date(date.setHours(23, 59, 59, 999));
};