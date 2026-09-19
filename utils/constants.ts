
export const PRODUCAO = true;

/** Tira barra final para não gerar `//auth/login` ao concatenar a rota. */
const normalizar = (url: string) => url.replace(/\/+$/, '');


export const CONEXAO = {
    URL: normalizar(
        PRODUCAO
            ? "https://api.barbearia.tekobit.com.br"
            : "http://192.168.1.9:3025",
    ),
};

export const ERROS = {
    USUARIO_NAO_ENCONTRADO: "USUÁRIO NÃO ENCONTRADO",
};

/**
 * Grade de horários da barbearia — fonte única.
 *
 * A tela de agenda e a saga mantinham cópias divergentes: a saga começava às
 * 09:00 e desconhecia 08:00, 08:30 e 13:15. Como ela usa `indexOf(startTime)`
 * para marcar os slots seguintes de serviços com mais de 30 min, um horário
 * ausente virava índice -1 e a ocupação era pintada nos slots errados.
 *
 * Espelha o AppointmentScheduleValidator do back-end (08:00–12:00 e 13:15–19:30).
 */
export const SLOTS_MANHA = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
];

export const SLOTS_TARDE = [
    '13:15', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

export const TODOS_SLOTS = [...SLOTS_MANHA, ...SLOTS_TARDE];
