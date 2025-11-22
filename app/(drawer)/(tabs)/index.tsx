import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import Feather from '@expo/vector-icons/Feather';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

type Agendamento = {
    id: number;
    cliente: string;
    servico: string;
    horario: string;
    status: 'confirmado' | 'pendente' | 'concluido';
    data: string; // formato: 'YYYY-MM-DD'
};

type DiaSemana = {
    dia: string;
    diaSemana: string;
    data: string;
    hoje: boolean;
};

export default function AgendamentosScreen() {
    const insets = useInsets();
    const [semanaOffset, setSemanaOffset] = useState(0); // 0 = semana atual, 1 = próxima, -1 = anterior

    // Gerar dias da semana (Segunda a Sábado) com base no offset
    const diasSemana = useMemo(() => {
        const hoje = new Date();
        const dias: DiaSemana[] = [];
        const diaSemanaAtual = hoje.getDay(); // 0 = domingo, 1 = segunda, etc.

        // Calcular segunda-feira da semana atual
        const diferencaParaSegunda = diaSemanaAtual === 0 ? -6 : 1 - diaSemanaAtual;
        const segundaFeira = new Date(hoje);
        segundaFeira.setDate(hoje.getDate() + diferencaParaSegunda + (semanaOffset * 7));

        // Gerar Segunda a Sábado
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
        const hoje = new Date().toISOString().split('T')[0];
        return hoje;
    });

    // Mock de dados - em produção viriam do backend
    const todosAgendamentos = useMemo(() => {
        const agendamentos: Agendamento[] = [];
        const hoje = new Date();

        diasSemana.forEach((dia, index) => {
            // Gerar agendamentos aleatórios para cada dia
            const numAgendamentos = Math.floor(Math.random() * 6) + 2;
            const clientes = ['João Silva', 'Pedro Santos', 'Carlos Oliveira', 'Lucas Ferreira', 'Rafael Costa', 'Bruno Alves', 'Marcos Paulo', 'André Lima'];
            const servicos = ['Corte + Barba', 'Corte Simples', 'Barba', 'Platinado', 'Corte Infantil'];
            const horarios = ['09:00', '10:00', '10:30', '11:00', '14:00', '15:00', '15:30', '16:00', '17:00', '18:00'];
            const statuses: ('confirmado' | 'pendente' | 'concluido')[] = ['confirmado', 'pendente', 'concluido'];

            for (let i = 0; i < numAgendamentos; i++) {
                agendamentos.push({
                    id: index * 10 + i,
                    cliente: clientes[Math.floor(Math.random() * clientes.length)],
                    servico: servicos[Math.floor(Math.random() * servicos.length)],
                    horario: horarios[i % horarios.length],
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    data: dia.data
                });
            }
        });

        return agendamentos;
    }, [diasSemana]);

    const agendamentosDoDia = useMemo(() => {
        return todosAgendamentos
            .filter(a => a.data === diaSelecionado)
            .sort((a, b) => a.horario.localeCompare(b.horario));
    }, [todosAgendamentos, diaSelecionado]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmado':
                return 'bg-green-100 border-green-500';
            case 'pendente':
                return 'bg-yellow-100 border-yellow-500';
            case 'concluido':
                return 'bg-gray-100 border-gray-500';
            default:
                return 'bg-gray-100 border-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmado':
                return 'text-green-700';
            case 'pendente':
                return 'text-yellow-700';
            case 'concluido':
                return 'text-gray-700';
            default:
                return 'text-gray-700';
        }
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

            {/* Seletor de dias da semana */}
            <View className="bg-white border-b border-gray-200">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-2 py-3"
                    contentContainerStyle={{ gap: 8 }}
                >
                    {diasSemana.map((dia) => (
                        <Pressable
                            key={dia.data}
                            onPress={() => setDiaSelecionado(dia.data)}
                            className={`items-center justify-center px-4 py-3 rounded-xl min-w-[70px] ${diaSelecionado === dia.data
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
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Lista de agendamentos */}
            <View className="flex-1 p-2 bg-gray-100">
                {agendamentosDoDia.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Feather name="calendar" size={64} color="#d1d5db" />
                        <Text className="text-gray-400 text-lg mt-4">Nenhum agendamento</Text>
                        <Text className="text-gray-400 text-sm">para este dia</Text>
                    </View>
                ) : (
                    <FlatList
                        data={agendamentosDoDia}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ gap: 12 }}
                        renderItem={({ item: agendamento }) => (
                            <Pressable
                                className={`bg-white rounded-xl p-4 border-l-4 ${getStatusColor(agendamento.status)} shadow-sm`}
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-800">{agendamento.cliente}</Text>
                                        <Text className="text-gray-600 mt-1">{agendamento.servico}</Text>
                                    </View>
                                    <View className="bg-green-500 px-3 py-1 rounded-full">
                                        <Text className="text-white font-bold">{agendamento.horario}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                    <Text className={`text-sm font-semibold capitalize ${getStatusText(agendamento.status)}`}>
                                        {agendamento.status}
                                    </Text>
                                    <View className="flex-row gap-2">
                                        <Pressable className="bg-blue-500 p-2 rounded-lg">
                                            <Feather name="phone" size={16} color="white" />
                                        </Pressable>
                                        <Pressable className="bg-green-500 p-2 rounded-lg">
                                            <Feather name="check" size={16} color="white" />
                                        </Pressable>
                                        <Pressable className="bg-red-500 p-2 rounded-lg">
                                            <Feather name="x" size={16} color="white" />
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        ListEmptyComponent={() => (
                            <View className="flex-1 items-center justify-center py-20">
                                <Feather name="calendar" size={64} color="#d1d5db" />
                                <Text className="text-gray-400 text-lg mt-4">Nenhum agendamento</Text>
                                <Text className="text-gray-400 text-sm">para este dia</Text>
                            </View>
                        )}
                    />
                )}
            </View>

            <Pressable className="absolute right-6 bg-green-500 w-14 h-14 rounded-full items-center justify-center shadow-lg" style={{ bottom: insets.bottom + 24 }}>
                <Feather name="plus" size={24} color="white" />
            </Pressable>
        </ScreenWrapper>
    );
}
