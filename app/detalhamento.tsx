import CabecalhoTela from '@/components/CabecalhoTela';
import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { requestDetalhamento } from '@/redux/actions/actionsRelatorio';
import type { AgendamentoDetalhado, StatusAgendamento } from '@/types/typesRelatorio';
import {
    diaDaSemanaCurto,
    formatarDiaMes,
    formatarDuracao,
    formatarMoeda,
} from '@/utils/formatadores';
import Feather from '@expo/vector-icons/Feather';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

type FiltroStatus = 'todos' | StatusAgendamento;

const FILTROS: { id: FiltroStatus; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'COMPLETED', label: 'Concluídos' },
    { id: 'SCHEDULED', label: 'Agendados' },
    { id: 'CANCELLED', label: 'Cancelados' },
];

/**
 * Cor tem significado no projeto: verde é só "concluído", vermelho só
 * destrutivo/cancelado. Agendado é estado neutro e não ganha cor — ficaria
 * competindo com os dois que realmente comunicam desfecho.
 */
const ESTILO_STATUS: Record<StatusAgendamento, { texto: string; cor: string; classe: string }> = {
    COMPLETED: { texto: 'concluído', cor: Cores.success, classe: 'text-success' },
    SCHEDULED: { texto: 'agendado', cor: Cores.inkSubtle, classe: 'text-ink-subtle' },
    CANCELLED: { texto: 'cancelado', cor: Cores.danger, classe: 'text-danger' },
};

const PERIODO_LABEL: Record<string, string> = {
    hoje: 'Hoje',
    semana: 'Esta semana',
    mes: 'Este mês',
};

const Cartao = ({ item }: { item: AgendamentoDetalhado }) => {
    const status = ESTILO_STATUS[item.status] ?? ESTILO_STATUS.SCHEDULED;
    const cancelado = item.status === 'CANCELLED';

    return (
        <View className="bg-surface rounded-card p-4 mb-2.5" style={Sombra.nivel1}>
            <View className="flex-row items-start justify-between">
                <View className="flex-row items-baseline gap-2">
                    <Text className="font-display text-[12px] tracking-[1.5px] text-ink-subtle">
                        {diaDaSemanaCurto(item.date)} {formatarDiaMes(item.date)}
                    </Text>
                    <Text className="font-display text-[17px] text-ink">{item.startTime}</Text>
                </View>

                <View className="flex-row items-center gap-1.5">
                    <Feather name="clock" size={11} color={Cores.inkSubtle} />
                    <Text className="font-sans text-[12px] text-ink-muted">
                        {formatarDuracao(item.durationMinutes)}
                    </Text>
                </View>
            </View>

            <Text className="font-semibold text-[15px] text-ink mt-2">{item.clientName}</Text>

            {/* Um item por linha com o preço congelado ao lado: é o que explica
                o total, e o preço do cadastro pode já ter mudado desde então. */}
            <View className="mt-2.5 gap-1">
                {item.services.map((servico, indice) => (
                    <View key={`${item.id}-${indice}`} className="flex-row justify-between">
                        <Text className="font-sans text-[13px] text-ink-muted flex-1 pr-3" numberOfLines={1}>
                            {servico.name}
                        </Text>
                        <Text
                            className="font-sans text-[13px] text-ink-muted"
                            style={{ fontVariant: ['tabular-nums'] }}
                        >
                            {formatarMoeda(servico.unitPrice)}
                        </Text>
                    </View>
                ))}
            </View>

            <View className="h-px bg-line my-3" />

            <View className="flex-row items-center justify-between">
                <Text className={`font-display text-[11px] tracking-[1.5px] ${status.classe}`}>
                    {status.texto.toUpperCase()}
                </Text>
                <Text
                    className={`font-semibold text-[16px] ${cancelado ? 'text-ink-subtle' : 'text-ink'}`}
                    style={{
                        fontVariant: ['tabular-nums'],
                        // Cancelado não rendeu: riscar evita que o valor seja
                        // lido como faturamento na varredura vertical.
                        textDecorationLine: cancelado ? 'line-through' : 'none',
                    }}
                >
                    {formatarMoeda(item.total)}
                </Text>
            </View>
        </View>
    );
};

export default function DetalhamentoScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();

    const detalhamento = useAppSelector((state) => state.relatorios.detalhamento);
    const periodo = useAppSelector((state) => state.relatorios.periodo);
    const carregando = useAppSelector((state) => state.relatorios.carregando);
    const erro = useAppSelector((state) => state.relatorios.erro);

    const [filtro, setFiltro] = useState<FiltroStatus>('todos');

    useFocusEffect(
        useCallback(() => {
            dispatch(requestDetalhamento(periodo));
        }, [dispatch, periodo]),
    );

    const todos = useMemo(
        () => detalhamento?.appointments ?? [],
        [detalhamento],
    );

    const lista = useMemo(
        () => (filtro === 'todos' ? todos : todos.filter((a) => a.status === filtro)),
        [todos, filtro],
    );

    // Só o que rendeu dinheiro entra no total do cabeçalho — somar agendado e
    // cancelado daria um número que não bate com o faturamento da tela anterior.
    const totalConcluido = useMemo(
        () =>
            lista
                .filter((a) => a.status === 'COMPLETED')
                .reduce((soma, a) => soma + a.total, 0),
        [lista],
    );

    const contagem = (id: FiltroStatus) =>
        id === 'todos' ? todos.length : todos.filter((a) => a.status === id).length;

    return (
        <ScreenWrapper className="flex-1 bg-canvas">
            <Pressable
                onPress={() => router.back()}
                hitSlop={8}
                className="px-5 pt-2 flex-row items-center gap-1 active:opacity-60"
            >
                <Feather name="chevron-left" size={18} color={Cores.inkMuted} />
                <Text className="font-sans text-[13.5px] text-ink-muted">Relatórios</Text>
            </Pressable>

            <CabecalhoTela
                titulo="DETALHAMENTO"
                subtitulo={`${PERIODO_LABEL[periodo] ?? ''} · ${lista.length} ${lista.length === 1 ? 'agendamento' : 'agendamentos'
                    } · ${formatarMoeda(totalConcluido)} concluído`}
            />

            {/* Chips de status: a contagem em cada um evita que o usuário
                precise trocar de filtro só para descobrir se há algo lá. */}
            <View className="flex-row gap-2 px-4 pb-3 flex-wrap">
                {FILTROS.map((opcao) => {
                    const ativo = filtro === opcao.id;
                    return (
                        <Pressable
                            key={opcao.id}
                            onPress={() => setFiltro(opcao.id)}
                            className={`px-3.5 py-2 rounded-full border ${ativo ? 'bg-brand border-brand' : 'bg-surface border-line'
                                }`}
                        >
                            <Text
                                className={`font-medium text-[12.5px] ${ativo ? 'text-ink-inverse' : 'text-ink-muted'
                                    }`}
                            >
                                {opcao.label} ({contagem(opcao.id)})
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {erro && (
                <View className="mx-4 mb-2 bg-danger-soft border border-danger-border rounded-card p-3.5 flex-row items-center gap-2">
                    <Feather name="alert-circle" size={16} color={Cores.danger} />
                    <Text className="font-sans text-[13.5px] text-danger flex-1">{erro}</Text>
                </View>
            )}

            <FlatList
                data={lista}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <Cartao item={item} />}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: insets.bottom + 24,
                    flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={carregando}
                        onRefresh={() => dispatch(requestDetalhamento(periodo))}
                        colors={[Cores.brand]}
                        tintColor={Cores.brand}
                    />
                }
                ListEmptyComponent={
                    carregando ? null : (
                        <View className="flex-1 items-center justify-center py-16 px-6">
                            <View className="w-12 h-12 rounded-full bg-surface-alt items-center justify-center">
                                <Feather name="calendar" size={20} color={Cores.inkSubtle} />
                            </View>
                            <Text className="font-sans text-[13.5px] text-ink-muted text-center mt-3">
                                Nenhum agendamento
                                {filtro === 'todos' ? ' no período.' : ' com esse status no período.'}
                            </Text>
                        </View>
                    )
                }
            />
        </ScreenWrapper>
    );
}
