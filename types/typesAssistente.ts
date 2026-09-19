export type StatusComando =
    | 'SUCCESS'
    | 'INTERPRETATION_ERROR'
    | 'EXECUTION_ERROR'
    | 'UNSUPPORTED_INTENT';

export type FerramentaComando =
    | 'QUERY_SCHEDULE'
    | 'CREATE_APPOINTMENT'
    | 'REGISTER_CLIENT'
    | 'GENERATE_REPORT';

export type Mensagem = {
    id: string;
    autor: 'usuario' | 'assistente';
    texto: string;
    status?: StatusComando;
    ferramenta?: FerramentaComando | null;
    /**
     * Balão de voz ainda sem transcrição. O texto só existe depois que o
     * backend responde, então a bolha aparece vazia e é preenchida em seguida.
     */
    aguardandoTranscricao?: boolean;
    /**
     * Resposta a um comando **falado**. Quem falou espera ouvir de volta; quem
     * digitou, não — por isso a leitura automática olha esta marca em vez de
     * falar toda resposta.
     */
    porVoz?: boolean;
    /**
     * ISO string, e nao Date: o store do Redux precisa ser serializavel, e um
     * Date cru aqui dispara o aviso de valor nao-serializavel do Redux Toolkit.
     */
    criadaEm: string;
};

export type RespostaComando = {
    response: string;
    toolExecuted: FerramentaComando | null;
    status: StatusComando;
    commandId: number;
    /** Só presente na rota de áudio: o que o Gemini entendeu da fala. */
    transcription?: string;
};
