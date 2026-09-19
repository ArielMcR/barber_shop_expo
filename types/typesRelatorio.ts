/** Espelha os contratos de `/reports/*` do back-end. */

export type StatusAgendamento = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export type ServicoRanking = {
    serviceId: number;
    name: string;
    /** Quantas vezes o serviço foi executado no período. */
    count: number;
    /** Soma dos preços congelados na marcação. */
    totalRevenue: number;
};

export type RelatorioServicos = {
    period: { from: string; to: string };
    ranking: ServicoRanking[];
};

export type RelatorioAtendimentos = {
    period: { from: string; to: string };
    totalAppointments: number;
    completed: number;
    cancelled: number;
    /** Chaves em inglês minúsculo: `monday`, `friday`... */
    byDayOfWeek: Record<string, number>;
};

export type ServicoDoDetalhe = {
    name: string;
    unitPrice: number;
    durationMinutes: number;
};

export type AgendamentoDetalhado = {
    id: number;
    /** `YYYY-MM-DD` em dia local — já vem pronto do back-end. */
    date: string;
    startTime: string;
    endTime: string;
    status: StatusAgendamento;
    clientName: string;
    durationMinutes: number;
    total: number;
    services: ServicoDoDetalhe[];
};

export type RelatorioDetalhamento = {
    period: { from: string; to: string };
    appointments: AgendamentoDetalhado[];
};
