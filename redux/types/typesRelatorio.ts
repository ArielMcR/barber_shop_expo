export const types = {
    REQUEST_DASHBOARD: "@relatorio/request_dashboard",
    SET_DASHBOARD: "@relatorio/set_dashboard",
    /**
     * Uma ação para os três relatórios escopados pelo filtro (faturamento,
     * serviços e atendimentos). Separadas, cada uma mexeria no mesmo
     * `carregando` e o refresh piscaria conforme as respostas chegassem.
     */
    REQUEST_PERIODO: "@relatorio/request_periodo",
    SET_FATURAMENTO: "@relatorio/set_faturamento",
    SET_SERVICOS: "@relatorio/set_servicos",
    SET_ATENDIMENTOS: "@relatorio/set_atendimentos",
    REQUEST_DETALHAMENTO: "@relatorio/request_detalhamento",
    SET_DETALHAMENTO: "@relatorio/set_detalhamento",
    SET_PERIODO: "@relatorio/set_periodo",
    SET_CARREGANDO: "@relatorio/set_carregando",
    SET_ERRO: "@relatorio/set_erro",
}
