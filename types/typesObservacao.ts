export type TipoObservacao = 'CANCELAMENTO' | 'PREFERENCIA' | 'OUTRO';

export interface Observacao {
    id: number;
    clientId: number;
    content: string;
    type: TipoObservacao;
    createdAt: string;
    updatedAt: string;
}
