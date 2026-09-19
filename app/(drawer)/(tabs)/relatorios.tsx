import CabecalhoTela from '@/components/CabecalhoTela';
import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { requestDashboard, requestPeriodo, setPeriodo, type PeriodoRelatorio } from '@/redux/actions/actionsRelatorio';
import { formatarMoeda } from '@/utils/formatadores';
import Feather from '@expo/vector-icons/Feather';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

const OPCOES_PERIODO: { id: PeriodoRelatorio; label: string }[] = [
    { id: 'hoje', label: 'Hoje' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mês' },
];

/** As chaves de `byDayOfWeek` vêm em inglês minúsculo do back-end. */
const DIAS_SEMANA: Record<string, string> = {
    sunday: 'domingo',
    monday: 'segunda-feira',
    tuesday: 'terça-feira',
    wednesday: 'quarta-feira',
    thursday: 'quinta-feira',
    friday: 'sexta-feira',
    saturday: 'sábado',
};

/** Números em coluna alinham verticalmente — aqui a largura fixa de dígito ajuda. */
const numeroTabular = { fontVariant: ['tabular-nums' as const] };

const Tile = ({ rotulo, valor }: { rotulo: string; valor: string | number }) => (
    <View className="flex-1 bg-surface rounded-card p-3.5" style={Sombra.nivel1}>
        <Text className="font-sans text-[12px] text-ink-muted">{rotulo}</Text>
        {/* Valor de tile usa figuras proporcionais, não tabulares. */}
        <Text className="font-semibold text-[22px] text-ink mt-1">{valor}</Text>
    </View>
);

const Linha = ({ rotulo, valor, perda }: { rotulo: string; valor: string; perda?: boolean }) => (
    <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-1.5">
            {perda && <Feather name="trending-down" size={13} color={Cores.danger} />}
            <Text className="font-sans text-[13.5px] text-ink-muted">{rotulo}</Text>
        </View>
        <Text
            className={`font-semibold text-[14.5px] ${perda ? 'text-danger' : 'text-ink'}`}
            style={numeroTabular}
        >
            {valor}
        </Text>
    </View>
);

/** Linha do ranking: posição, nome, quantas vezes e quanto rendeu. */
const LinhaRanking = ({
    posicao,
    nome,
    vezes,
    valor,
}: {
    posicao: number;
    nome: string;
    vezes: number;
    valor: string;
}) => (
    <View className="flex-row items-center gap-3">
        <Text className="font-display text-[13px] text-ink-subtle w-4">{posicao}</Text>
        <View className="flex-1">
            <Text className="font-medium text-[13.5px] text-ink" numberOfLines={1}>
                {nome}
            </Text>
            <Text className="font-sans text-[11.5px] text-ink-muted mt-0.5">
                {vezes} {vezes === 1 ? 'vez' : 'vezes'}
            </Text>
        </View>
        <Text className="font-semibold text-[13.5px] text-ink" style={numeroTabular}>
            {valor}
        </Text>
    </View>
);

export default function RelatoriosScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();

    const dashboard = useAppSelector((state) => state.relatorios.dashboard);
    const faturamento = useAppSelector((state) => state.relatorios.faturamento);
    const servicos = useAppSelector((state) => state.relatorios.servicos);
    const atendimentos = useAppSelector((state) => state.relatorios.atendimentos);
    const periodo = useAppSelector((state) => state.relatorios.periodo);
    const carregando = useAppSelector((state) => state.relatorios.carregando);
    const erro = useAppSelector((state) => state.relatorios.erro);

    const carregarDados = (periodoSelecionado: PeriodoRelatorio = periodo) => {
        dispatch(requestDashboard());
        dispatch(requestPeriodo(periodoSelecionado));
    };

    // Top 5 basta: a lista completa é trabalho do detalhamento.
    const ranking = (servicos?.ranking ?? []).slice(0, 5);

    const melhorDia = Object.entries(atendimentos?.byDayOfWeek ?? {}).sort(
        (a, b) => b[1] - a[1],
    )[0];

    // Ref para o período: se ele entrasse nas dependências, trocar de período
    // dispararia o efeito além do dispatch que `selecionarPeriodo` já faz,
    // duplicando a requisição.
    const periodoRef = useRef(periodo);
    periodoRef.current = periodo;

    // Faturamento muda quando um atendimento é concluído em outra tela ou pelo
    // assistente — sem recarregar ao focar, o relatório fica congelado.
    useFocusEffect(
        useCallback(() => {
            dispatch(requestDashboard());
            dispatch(requestPeriodo(periodoRef.current));
        }, [dispatch]),
    );

    const selecionarPeriodo = (novoPeriodo: PeriodoRelatorio) => {
        if (novoPeriodo === periodo) return;
        dispatch(setPeriodo(novoPeriodo));
        dispatch(requestPeriodo(novoPeriodo));
    };

    return (
        <ScreenWrapper className="flex-1 bg-canvas" withTopInset={false}>
            <CabecalhoTela titulo="RELATÓRIOS" subtitulo="Acompanhe seus resultados" />

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 12 }}
                refreshControl={
                    <RefreshControl
                        refreshing={carregando}
                        onRefresh={() => carregarDados()}
                        colors={[Cores.brand]}
                        tintColor={Cores.brand}
                    />
                }
            >
                {erro && (
                    <View className="bg-danger-soft border border-danger-border rounded-card p-3.5 flex-row items-center gap-2">
                        <Feather name="alert-circle" size={16} color={Cores.danger} />
                        <Text className="font-sans text-[13.5px] text-danger flex-1">{erro}</Text>
                    </View>
                )}

                {/* Figura-herói: um número por tela, na mesma sans do resto —
                    fonte display aqui lê como decoração, não como dado. */}
                <View className="bg-surface rounded-card p-5" style={Sombra.nivel1}>
                    <View className="flex-row items-center gap-2">
                        <View className="w-6 h-px bg-brand" />
                        <Text className="font-sans text-[12.5px] text-ink-muted">Faturamento hoje</Text>
                    </View>
                    <Text className="font-bold text-[44px] leading-[52px] text-ink mt-1">
                        {formatarMoeda(dashboard?.today?.revenue)}
                    </Text>
                    <Text className="font-sans text-[13px] text-ink-muted">
                        {dashboard?.today?.appointments ?? 0} atendimento(s) hoje
                    </Text>
                </View>

                <View className="flex-row gap-3">
                    <Tile rotulo="Atendimentos na semana" valor={dashboard?.week?.appointments ?? 0} />
                    <Tile rotulo="Atendimentos no mês" valor={dashboard?.month?.appointments ?? 0} />
                </View>

                {/* Filtro numa linha só, acima do bloco que ele escopa — e não
                    dentro do card, senão fica ambíguo se ele afeta o resto da tela.
                    Ele escopa os três cards abaixo e o detalhamento; o herói e os
                    tiles acima são sempre hoje/semana/mês fixos. */}
                <View className="pt-2">
                    <Text className="font-display text-[11px] tracking-[2px] text-ink-muted mb-2.5">
                        ANÁLISE POR PERÍODO
                    </Text>
                    <View className="flex-row gap-2 mb-3">
                        {OPCOES_PERIODO.map((opcao) => {
                            const ativo = periodo === opcao.id;
                            return (
                                <Pressable
                                    key={opcao.id}
                                    onPress={() => selecionarPeriodo(opcao.id)}
                                    className={`px-4 py-2 rounded-full border ${ativo ? 'bg-brand border-brand' : 'bg-surface border-line'
                                        }`}
                                >
                                    <Text
                                        className={`font-medium text-[13px] ${ativo ? 'text-ink-inverse' : 'text-ink-muted'
                                            }`}
                                    >
                                        {opcao.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View className="bg-surface rounded-card p-4" style={Sombra.nivel1}>
                        {carregando && !faturamento ? (
                            <Text className="font-sans text-[13.5px] text-ink-subtle text-center py-4">
                                Carregando...
                            </Text>
                        ) : (
                            <View className="gap-3.5">
                                <Linha rotulo="Faturamento total" valor={formatarMoeda(faturamento?.totalRevenue)} />
                                <View className="h-px bg-line" />
                                <Linha
                                    rotulo="Atendimentos concluídos"
                                    valor={String(faturamento?.completedAppointments ?? 0)}
                                />
                                <View className="h-px bg-line" />
                                <Linha rotulo="Ticket médio" valor={formatarMoeda(faturamento?.averageTicket)} />
                                <View className="h-px bg-line" />
                                <Linha
                                    rotulo="Perdas por cancelamento"
                                    valor={formatarMoeda(faturamento?.lostRevenueByCancellation)}
                                    perda
                                />
                            </View>
                        )}
                    </View>

                    {/* Serviços mais realizados — o ranking já existia pronto na
                        API (/reports/services) e nunca tinha sido consumido. */}
                    <Text className="font-display text-[11px] tracking-[2px] text-ink-muted mt-5 mb-2.5">
                        SERVIÇOS MAIS REALIZADOS
                    </Text>
                    <View className="bg-surface rounded-card p-4" style={Sombra.nivel1}>
                        {ranking.length === 0 ? (
                            <Text className="font-sans text-[13px] text-ink-subtle text-center py-3">
                                Nenhum serviço concluído no período.
                            </Text>
                        ) : (
                            <View className="gap-3.5">
                                {ranking.map((servico, indice) => (
                                    <View key={servico.serviceId}>
                                        {indice > 0 && <View className="h-px bg-line mb-3.5" />}
                                        <LinhaRanking
                                            posicao={indice + 1}
                                            nome={servico.name}
                                            vezes={servico.count}
                                            valor={formatarMoeda(servico.totalRevenue)}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <Text className="font-display text-[11px] tracking-[2px] text-ink-muted mt-5 mb-2.5">
                        ATENDIMENTOS
                    </Text>
                    <View className="bg-surface rounded-card p-4" style={Sombra.nivel1}>
                        <View className="flex-row">
                            <View className="flex-1">
                                <Text className="font-sans text-[12px] text-ink-muted">Concluídos</Text>
                                <Text
                                    className="font-semibold text-[20px] text-success mt-0.5"
                                    style={numeroTabular}
                                >
                                    {atendimentos?.completed ?? 0}
                                </Text>
                            </View>
                            <View className="w-px bg-line" />
                            <View className="flex-1 pl-4">
                                <Text className="font-sans text-[12px] text-ink-muted">Cancelados</Text>
                                <Text
                                    className="font-semibold text-[20px] text-danger mt-0.5"
                                    style={numeroTabular}
                                >
                                    {atendimentos?.cancelled ?? 0}
                                </Text>
                            </View>
                        </View>

                        {melhorDia && (
                            <>
                                <View className="h-px bg-line my-3.5" />
                                <Linha
                                    rotulo="Dia mais movimentado"
                                    valor={`${DIAS_SEMANA[melhorDia[0]] ?? melhorDia[0]} (${melhorDia[1]})`}
                                />
                            </>
                        )}
                    </View>

                    {/* Tela própria, não modal: a lista pode ser longa e precisa
                        de scroll e pull-to-refresh próprios. */}
                    <Pressable
                        onPress={() => router.push('/detalhamento')}
                        className="bg-surface rounded-card p-4 mt-5 flex-row items-center justify-between active:bg-surface-alt"
                        style={Sombra.nivel1}
                    >
                        <View className="flex-row items-center gap-2.5">
                            <Feather name="list" size={16} color={Cores.brand} />
                            <View>
                                <Text className="font-medium text-[14px] text-ink">
                                    Ver detalhamento
                                </Text>
                                <Text className="font-sans text-[12px] text-ink-muted mt-0.5">
                                    Cliente, serviços, duração e valor
                                </Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={18} color={Cores.inkSubtle} />
                    </Pressable>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
