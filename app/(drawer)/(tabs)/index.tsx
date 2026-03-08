import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { useModalAviso } from '@/hooks/useModalAviso';
import { useAppDispatch } from '@/hooks/useRedux';
import ModalAgendamento from '@/modais/ModalAgendamento';
import ModalDetalheAgendamento from '@/modais/ModalDetalheAgendamento';
import { requestClients } from '@/redux/actions/actionsClients';
import { setModalAgendamento } from '@/redux/actions/actionsModais';
import { requestServico } from '@/redux/actions/actionsServico';
import Feather from '@expo/vector-icons/Feather';
import { Speech } from 'lucide-react-native';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type DiaSemana = {
    dia: string;
    diaSemana: string;
    data: string;
    hoje: boolean;
};

type AgendamentoSlot = {
    horario: string;
    cliente: any;
    servico: any;
    duracaoMin: number;
    ocupadoPor?: string; // horário do slot principal (para continuações)
};

// Gera os horários fixos do dia
const SLOTS_MANHA = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const SLOTS_TARDE = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
const TODOS_SLOTS = [...SLOTS_MANHA, ...SLOTS_TARDE];

export default function AgendamentosScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();
    const modalAviso = useModalAviso();
    const [semanaOffset, setSemanaOffset] = useState(0);
    const [agendamentos, setAgendamentos] = useState<Record<string, AgendamentoSlot[]>>({});
    const [modalDetalhe, setModalDetalhe] = useState<{ visible: boolean; slot: AgendamentoSlot | null }>({
        visible: false,
        slot: null,
    });

    // Buscar clientes e serviços do Redux
    useEffect(() => {
        dispatch(requestClients());
        dispatch(requestServico());
    }, []);

    const diasSemana = useMemo(() => {
        const hoje = new Date();
        const dias: DiaSemana[] = [];
        const diaSemanaAtual = hoje.getDay();

        const diferencaParaSegunda = diaSemanaAtual === 0 ? -6 : 1 - diaSemanaAtual;
        const segundaFeira = new Date(hoje);
        segundaFeira.setDate(hoje.getDate() + diferencaParaSegunda + (semanaOffset * 7));

        const diasDaSemanaLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        for (let i = 0; i < 6; i++) {
            const data = new Date(segundaFeira);
            data.setDate(segundaFeira.getDate() + i);

            const dataStr = data.toISOString().split('T')[0];
            const hojeStr = hoje.toISOString().split('T')[0];

            dias.push({
                dia: data.getDate().toString(),
                diaSemana: diasDaSemanaLabels[i],
                data: dataStr,
                hoje: dataStr === hojeStr
            });
        }

        return dias;
    }, [semanaOffset]);

    const [diaSelecionado, setDiaSelecionado] = useState<string>(() => {
        return new Date().toISOString().split('T')[0];
    });

    const agendamentosDoDia = useMemo(() => {
        return agendamentos[diaSelecionado] || [];
    }, [agendamentos, diaSelecionado]);

    const getSlotInfo = useCallback((horario: string) => {
        return agendamentosDoDia.find(a => a.horario === horario);
    }, [agendamentosDoDia]);

    const parseDuracaoMinutos = (duracao: string): number => {
        const match = duracao.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 30;
    };

    const adicionarAgendamento = (cliente: any, servico: any, horario: string) => {
        const duracaoMin = parseDuracaoMinutos(servico.duracao);
        const slotsNecessarios = Math.ceil(duracaoMin / 30);
        const indexInicio = TODOS_SLOTS.indexOf(horario);

        if (indexInicio === -1) return;

        // Verificar conflitos
        const slotsParaOcupar = TODOS_SLOTS.slice(indexInicio, indexInicio + slotsNecessarios);
        const atuais = agendamentos[diaSelecionado] || [];

        const conflito = slotsParaOcupar.find(slot =>
            atuais.some(a => a.horario === slot)
        );

        if (conflito) {
            modalAviso.mostrarErro(
                `Conflito de horário! O slot ${conflito} já está ocupado.`
            );
            return;
        }

        // Verificar se ultrapassa o último horário
        if (indexInicio + slotsNecessarios > TODOS_SLOTS.length) {
            modalAviso.mostrarAviso(
                'O serviço ultrapassa o horário de funcionamento.'
            );
            return;
        }

        // Verificar se cruza o almoço (último slot manhã → primeiro slot tarde)
        const indexUltimoManha = SLOTS_MANHA.length - 1;
        const indexPrimeiroTarde = SLOTS_MANHA.length;
        if (indexInicio <= indexUltimoManha && indexInicio + slotsNecessarios > indexPrimeiroTarde) {
            modalAviso.mostrarAviso(
                'O serviço não pode atravessar o horário de almoço (12:00 - 13:00).'
            );
            return;
        }

        // Criar os slots
        const novosSlots: AgendamentoSlot[] = [];

        // Slot principal
        novosSlots.push({
            horario,
            cliente,
            servico,
            duracaoMin,
        });

        // Slots de continuação
        for (let i = 1; i < slotsNecessarios; i++) {
            novosSlots.push({
                horario: TODOS_SLOTS[indexInicio + i],
                cliente,
                servico,
                duracaoMin,
                ocupadoPor: horario,
            });
        }

        setAgendamentos(prev => ({
            ...prev,
            [diaSelecionado]: [...atuais, ...novosSlots],
        }));
    };

    const substituirAgendamento = (horario: string, cliente: any, servico: any) => {
        const duracaoMin = parseDuracaoMinutos(servico.duracao);
        const slotsNecessarios = Math.ceil(duracaoMin / 30);
        const indexInicio = TODOS_SLOTS.indexOf(horario);

        if (indexInicio === -1) return;

        // Verificar se ultrapassa o último horário
        if (indexInicio + slotsNecessarios > TODOS_SLOTS.length) {
            modalAviso.mostrarAviso('O serviço ultrapassa o horário de funcionamento.');
            return;
        }

        // Verificar se cruza o almoço
        const indexUltimoManha = SLOTS_MANHA.length - 1;
        const indexPrimeiroTarde = SLOTS_MANHA.length;
        if (indexInicio <= indexUltimoManha && indexInicio + slotsNecessarios > indexPrimeiroTarde) {
            modalAviso.mostrarAviso('O serviço não pode atravessar o horário de almoço (12:00 - 13:00).');
            return;
        }

        const slotsParaOcupar = TODOS_SLOTS.slice(indexInicio, indexInicio + slotsNecessarios);

        setAgendamentos(prev => {
            const atuais = prev[diaSelecionado] || [];
            // Remove slots antigos desse agendamento
            const semAntigo = atuais.filter(
                a => a.horario !== horario && a.ocupadoPor !== horario
            );

            // Verificar conflitos com outros agendamentos
            const conflito = slotsParaOcupar.find(slot =>
                semAntigo.some(a => a.horario === slot)
            );
            if (conflito) {
                // Não pode substituir, mantém o original
                modalAviso.mostrarErro(`Conflito de horário! O slot ${conflito} já está ocupado.`);
                return prev;
            }

            // Criar novos slots
            const novosSlots: AgendamentoSlot[] = [{
                horario, cliente, servico, duracaoMin,
            }];
            for (let i = 1; i < slotsNecessarios; i++) {
                novosSlots.push({
                    horario: TODOS_SLOTS[indexInicio + i],
                    cliente, servico, duracaoMin,
                    ocupadoPor: horario,
                });
            }

            return { ...prev, [diaSelecionado]: [...semAntigo, ...novosSlots] };
        });
    };

    const onConfirmar = ({ cliente, servico, horario, modo }: {
        cliente: any;
        servico: any;
        horario: string;
        modo: 'novo' | 'trocar_cliente' | 'trocar_servico';
    }) => {
        if (modo === 'novo') {
            adicionarAgendamento(cliente, servico, horario);
        } else {
            substituirAgendamento(horario, cliente, servico);
        }
    };
    const abrirModalAgendamento = (horario: string) => {
        dispatch(setModalAgendamento({
            statusAtivo: true,
            horario,
            data: diaSelecionado,
            modo: 'novo',
        }));
    };

    const abrirDetalhe = (horario: string) => {
        const slot = agendamentosDoDia.find(a => a.horario === horario && !a.ocupadoPor);
        if (slot) {
            setModalDetalhe({ visible: true, slot });
        }
    };

    const trocarCliente = (slot: AgendamentoSlot) => {
        dispatch(setModalAgendamento({
            statusAtivo: true,
            horario: slot.horario,
            data: diaSelecionado,
            modo: 'trocar_cliente',
            servicoAtual: slot.servico,
        }));
    };

    const trocarServico = (slot: AgendamentoSlot) => {
        dispatch(setModalAgendamento({
            statusAtivo: true,
            horario: slot.horario,
            data: diaSelecionado,
            modo: 'trocar_servico',
            clienteAtual: slot.cliente,
        }));
    };

    const removerAgendamento = (horario: string) => {
        modalAviso.mostrarConfirmacao(
            'Deseja remover este agendamento?',
            {
                textoBotaoConfirmar: 'Remover',
                textoBotaoCancelar: 'Cancelar',
                tipo: 'aviso',
                onConfirmar: () => {
                    setAgendamentos(prev => {
                        const atuais = prev[diaSelecionado] || [];
                        // Remove o slot principal e todas as continuações
                        const filtrados = atuais.filter(
                            a => a.horario !== horario && a.ocupadoPor !== horario
                        );
                        return { ...prev, [diaSelecionado]: filtrados };
                    });
                },
            }
        );
    };

    const renderSlot = (horario: string) => {
        const slot = getSlotInfo(horario);

        if (!slot) {
            return (
                <TouchableOpacity
                    key={horario}
                    onPress={() => abrirModalAgendamento(horario)}
                    className="flex-row items-center bg-white rounded-xl mx-3 mb-2 p-4 border border-dashed border-gray-200"
                    activeOpacity={0.6}
                >
                    <View className="w-16 items-center">
                        <Text className="text-gray-400 font-bold text-base">{horario}</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-center gap-2">
                        <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                            <Feather name="plus" size={16} color="#9ca3af" />
                        </View>
                        <Text className="text-gray-400 text-sm">Horário disponível</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        if (slot.ocupadoPor) {
            return (
                <TouchableOpacity
                    key={horario}
                    onPress={() => abrirDetalhe(slot.ocupadoPor!)}
                    className="flex-row items-center bg-green-50 rounded-xl mx-3 mb-2 p-4 border-l-4 border-green-400"
                    activeOpacity={0.7}
                >
                    <View className="w-16 items-center">
                        <Text className="text-green-600 font-bold text-base">{horario}</Text>
                    </View>
                    <View className="flex-1 flex-row items-center gap-2">
                        <Feather name="clock" size={14} color="#16a34a" />
                        <Text className="text-green-700 text-sm font-medium">
                            Agendado — {slot.cliente?.nome}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                key={horario}
                onPress={() => abrirDetalhe(horario)}
                className="bg-white rounded-xl mx-3 mb-2 border-l-4 border-green-500 "
                activeOpacity={0.7}
            >
                <View className="flex-row items-center p-4">
                    <View className="w-16 items-center">
                        <View className="bg-green-500 px-3 py-1.5 rounded-lg">
                            <Text className="text-white font-bold text-sm">{horario}</Text>
                        </View>
                    </View>
                    <View className="flex-1 ml-2">
                        <Text className="text-gray-800 font-bold text-base">{slot.cliente?.nome}</Text>
                        <View className="flex-row items-center gap-3 mt-1.5">
                            <View className="flex-row items-center gap-1">
                                <Feather name="scissors" size={12} color="#6b7280" />
                                <Text className="text-gray-500 text-sm">{slot.servico?.nome}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Feather name="clock" size={12} color="#6b7280" />
                                <Text className="text-gray-500 text-sm">{slot.servico?.duracao}</Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row gap-2">
                        <View className="bg-green-100 px-2.5 py-1 rounded-lg">
                            <Text className="text-green-700 text-xs font-semibold">{slot.servico?.preco}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper className="flex-1 bg-gray-50" withTopInset={false}>
            <View className="bg-green-500 p-4 pb-3">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white text-2xl font-bold">Agendamentos</Text>
                        <Text className="text-white text-sm mt-1">
                            {diasSemana[0] && new Date(diasSemana[0].data).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short'
                            })} - {diasSemana[5] && new Date(diasSemana[5].data).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                    <View className="flex-row gap-2">
                        <Pressable
                            onPress={() => setSemanaOffset(prev => prev - 1)}
                            className="bg-green-600 w-10 h-10 rounded-full items-center justify-center"
                        >
                            <Feather name="chevron-left" size={20} color="white" />
                        </Pressable>
                        <Pressable
                            onPress={() => setSemanaOffset(0)}
                            className="bg-green-600 px-3 h-10 rounded-full items-center justify-center"
                        >
                            <Text className="text-white font-semibold text-xs">Hoje</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setSemanaOffset(prev => prev + 1)}
                            className="bg-green-600 w-10 h-10 rounded-full items-center justify-center"
                        >
                            <Feather name="chevron-right" size={20} color="white" />
                        </Pressable>
                    </View>
                </View>
            </View>

            <View className="bg-white border-b border-gray-200">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-2 py-3"
                    contentContainerStyle={{ gap: 8 }}
                >
                    {diasSemana.map((dia) => (
                        <TouchableOpacity
                            key={dia.data}
                            onPress={() => setDiaSelecionado(dia.data)}
                            className={`items-center justify-center px-4 py-3 rounded-xl min-w-[50px] ${diaSelecionado === dia.data
                                ? 'bg-green-500'
                                : dia.hoje
                                    ? 'bg-green-100 border border-green-300'
                                    : 'bg-gray-100'
                                }`}
                        >
                            <Text
                                className={`text-xs font-semibold ${diaSelecionado === dia.data
                                    ? 'text-white'
                                    : dia.hoje
                                        ? 'text-green-700'
                                        : 'text-gray-600'
                                    }`}
                            >
                                {dia.diaSemana}
                            </Text>
                            <Text
                                className={`text-2xl font-bold mt-1 ${diaSelecionado === dia.data
                                    ? 'text-white'
                                    : dia.hoje
                                        ? 'text-green-700'
                                        : 'text-gray-800'
                                    }`}
                            >
                                {dia.dia}
                            </Text>
                            {dia.hoje && (
                                <View className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full" />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ paddingVertical: 12 }}>

                <View className="flex-row items-center gap-2 mx-5 mb-3">
                    <Feather name="sunrise" size={16} color="#f59e0b" />
                    <Text className="text-gray-500 font-semibold text-sm">Manhã</Text>
                    <View className="flex-1 h-px bg-gray-200" />
                </View>

                {SLOTS_MANHA.map(renderSlot)}

                <View className="flex-row items-center gap-2 mx-5 my-4">
                    <Feather name="coffee" size={16} color="#6b7280" />
                    <Text className="text-gray-400 font-medium text-sm">Almoço — 12:00 às 13:00</Text>
                    <View className="flex-1 h-px bg-gray-200" />
                </View>

                <View className="flex-row items-center gap-2 mx-5 mb-3">
                    <Feather name="sun" size={16} color="#f97316" />
                    <Text className="text-gray-500 font-semibold text-sm">Tarde</Text>
                    <View className="flex-1 h-px bg-gray-200" />
                </View>

                {SLOTS_TARDE.map(renderSlot)}

                <View style={{ height: 80 }} />
            </ScrollView>
            <ModalAgendamento onConfirmar={onConfirmar} />
            <ModalDetalheAgendamento
                visible={modalDetalhe.visible}
                slot={modalDetalhe.slot}
                onFechar={() => setModalDetalhe({ visible: false, slot: null })}
                onTrocarCliente={() => {
                    if (modalDetalhe.slot) trocarCliente(modalDetalhe.slot);
                }}
                onTrocarServico={() => {
                    if (modalDetalhe.slot) trocarServico(modalDetalhe.slot);
                }}
                onCancelarAgendamento={() => {
                    if (modalDetalhe.slot) removerAgendamento(modalDetalhe.slot.horario);
                }}
            />

            <Pressable className="absolute right-6 bg-green-500 w-14 h-14 rounded-full items-center justify-center shadow-lg" style={{ bottom: insets.bottom + 24 }} onPress={() => { }}>
                <Speech size={24} color="white" />
            </Pressable>
        </ScreenWrapper>
    );
}
