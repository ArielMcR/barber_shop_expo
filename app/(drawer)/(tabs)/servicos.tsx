import CabecalhoTela from '@/components/CabecalhoTela';
import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import { useModalFormulario } from '@/hooks/useModalFormulario';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createServico, requestServico } from '@/redux/actions/actionsServico';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

type Servico = {
    id: number;
    nome: string;
    duracao: string;
    preco: string;
};

export default function ServicosScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();
    const modalFormulario = useModalFormulario();
    const servicos = useAppSelector((state) => state.servicos.servicos) || [];



    const abrirCadastroServico = () => {
        modalFormulario.abrirFormulario(
            'Novo Serviço',
            [
                {
                    name: 'nome',
                    label: 'Nome do Serviço',
                    placeholder: 'Ex: Corte Masculino',
                    icone: 'scissors',
                    obrigatorio: true,
                },
                {
                    name: 'preco',
                    label: 'Preço',
                    placeholder: 'R$ 000.000,00',
                    icone: 'dollar-sign',
                    tipo: 'currency', // Máscara automática de moeda
                    obrigatorio: true,
                },
                {
                    name: 'duracao',
                    label: 'Duração (minutos)',
                    placeholder: 'Ex: 30',
                    icone: 'clock',
                    tipo: 'number',
                    obrigatorio: true,
                },
            ],
            {
                onConfirmar: (valores) => {
                    const servico = {
                        nome: valores.nome,
                        preco: parseFloat(valores.preco) / 100, // Converter centavos para reais
                        duracao: parseInt(valores.duracao),
                    };
                    dispatch(createServico(servico));
                },
            }
        );
    };


    useFocusEffect(
        useCallback(() => {
            dispatch(requestServico());
        }, [dispatch]),
    );


    return (
        <ScreenWrapper className="flex-1 bg-canvas" withTopInset={false}>
            <CabecalhoTela
                titulo="SERVIÇOS"
                subtitulo={`${servicos.length} serviço${servicos.length === 1 ? '' : 's'} no catálogo`}
            />

            <View className="flex-1 px-4">
                <FlatList
                    data={servicos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item: servico }: { item: Servico }) => (
                        <Pressable
                            className="bg-surface rounded-card p-3.5"
                            style={Sombra.nivel1}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="bg-brand-soft border border-brand-border w-11 h-11 rounded-full items-center justify-center">
                                    <Feather name="scissors" size={18} color={Cores.brandDeep} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-[15px] text-ink" numberOfLines={1}>
                                        {servico.nome}
                                    </Text>
                                    <View className="flex-row items-center gap-1.5 mt-1">
                                        <Feather name="clock" size={11} color={Cores.inkSubtle} />
                                        <Text className="font-sans text-[12.5px] text-ink-muted">
                                            {servico.duracao}
                                        </Text>
                                    </View>
                                </View>
                                {/* Preço em Oswald: alinha verticalmente com os
                                    valores da agenda e vira uma coluna de leitura. */}
                                <Text className="font-display text-[17px] tracking-[0.3px] text-ink">
                                    {servico.preco}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                    ListEmptyComponent={
                        <View className="items-center pt-16 gap-2">
                            <Feather name="scissors" size={28} color={Cores.inkSubtle} />
                            <Text className="font-sans text-[14px] text-ink-subtle">
                                Nenhum serviço cadastrado
                            </Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => dispatch(requestServico())}
                            refreshing={false}
                            colors={[Cores.brand]}
                            tintColor={Cores.brand}
                        />
                    }
                    contentContainerStyle={{ gap: 10, paddingBottom: insets.bottom + 96 }}
                />
            </View>

            <Pressable
                className="absolute right-5 bg-brand w-14 h-14 rounded-full items-center justify-center active:bg-brand-strong"
                style={[{ bottom: insets.bottom + 24 }, Sombra.nivel3]}
                onPress={abrirCadastroServico}
            >
                <Feather name="plus" size={22} color={Cores.inkInverse} />
            </Pressable>
        </ScreenWrapper>
    );
}
