import CabecalhoTela from '@/components/CabecalhoTela';
import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import { useModalFormulario } from '@/hooks/useModalFormulario';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import ModalObservacoes from '@/modais/ModalObservacoes';
import { createClient, requestClients } from '@/redux/actions/actionsClients';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';



export default function ClientesScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();
    const modalFormulario = useModalFormulario();
    const clientes = useAppSelector((state) => state.clientes.clients) || [];


    const [searchQuery, setSearchQuery] = useState('');
    const [clienteObservacoes, setClienteObservacoes] = useState<any>(null);

    const filteredClientes = clientes.filter((cliente: any) =>
        cliente.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const abrirCadastroCliente = () => {
        modalFormulario.abrirFormulario(
            'Novo Cliente',
            [
                {
                    name: 'name',
                    label: 'Nome Completo',
                    placeholder: 'Digite o nome do cliente',
                    icone: 'user',
                    obrigatorio: true,
                },
                {
                    name: 'lastName',
                    label: 'Sobrenome',
                    placeholder: 'Digite o sobrenome do cliente',
                    icone: 'user',
                    obrigatorio: true,
                },
                {
                    name: 'cellPhone',
                    label: 'Telefone',
                    placeholder: '(00) 00000-0000',
                    icone: 'phone',
                    tipo: 'phone', // Máscara automática: (00) 00000-0000
                    obrigatorio: true,
                },
                {
                    name: 'email',
                    label: 'E-mail',
                    placeholder: 'cliente@email.com',
                    icone: 'mail',
                    tipo: 'email',
                    obrigatorio: false,
                },

            ],
            {
                textoBotaoConfirmar: 'Cadastrar Cliente',
                textoBotaoCancelar: 'Cancelar',
                onConfirmar: (valores) => {
                    dispatch(createClient(valores));
                },
            }
        );
    };


    // Recarrega ao focar: um cliente cadastrado pelo assistente precisa
    // aparecer aqui sem o usuário ter que dar pull-to-refresh.
    useFocusEffect(
        useCallback(() => {
            dispatch(requestClients());
        }, [dispatch]),
    );

    return (
        <ScreenWrapper className="flex-1 bg-canvas" withTopInset={false}>
            <CabecalhoTela
                titulo="CLIENTES"
                subtitulo={`${clientes.length} cadastrado${clientes.length === 1 ? '' : 's'}`}
            />

            <View className="px-4 pb-3">
                <View className="bg-surface rounded-control flex-row items-center px-3.5 border border-line">
                    <Feather name="search" size={17} color={Cores.inkSubtle} />
                    <TextInput
                        className="flex-1 py-3 px-2.5 font-sans text-[14px] text-ink"
                        placeholder="Buscar cliente..."
                        placeholderTextColor={Cores.inkSubtle}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                            <Feather name="x" size={16} color={Cores.inkSubtle} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View className="flex-1 px-4">
                <FlatList
                    data={filteredClientes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item: cliente }) => (
                        <TouchableOpacity
                            className="bg-surface rounded-card p-3.5"
                            style={Sombra.nivel1}
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center gap-3">
                                {/* Inicial no lugar do ícone genérico: com muitos
                                    clientes, a letra diferencia as linhas de relance. */}
                                <View className="bg-brand-soft border border-brand-border w-11 h-11 rounded-full items-center justify-center">
                                    <Text className="font-display text-[17px] text-brand-deep">
                                        {cliente.name?.charAt(0)?.toUpperCase() || '?'}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-[15px] text-ink" numberOfLines={1}>
                                        {cliente.name + ' ' + cliente.lastName}
                                    </Text>
                                    <Text className="font-sans text-[13px] text-ink-muted mt-0.5">
                                        {cliente.cellPhone}
                                    </Text>
                                    <Text className="font-sans text-[11.5px] text-ink-subtle mt-0.5">
                                        Última visita: {cliente.updatedAt ? new Date(cliente.updatedAt).toLocaleDateString() : '—'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    className="w-9 h-9 rounded-full border border-line items-center justify-center active:bg-surface-alt"
                                    onPress={() => setClienteObservacoes(cliente)}
                                >
                                    <Feather name="file-text" size={16} color={Cores.inkMuted} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View className="items-center pt-16 gap-2">
                            <Feather name="users" size={28} color={Cores.inkSubtle} />
                            <Text className="font-sans text-[14px] text-ink-subtle">
                                {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                            </Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, paddingBottom: insets.bottom + 96 }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => dispatch(requestClients())}
                            refreshing={false}
                            colors={[Cores.brand]}
                            tintColor={Cores.brand}
                        />
                    }
                />
            </View>

            <Pressable
                className="absolute right-5 bg-brand w-14 h-14 rounded-full items-center justify-center active:bg-brand-strong"
                style={[{ bottom: insets.bottom + 24 }, Sombra.nivel3]}
                onPress={abrirCadastroCliente}
            >
                <Feather name="user-plus" size={22} color={Cores.inkInverse} />
            </Pressable>

            <ModalObservacoes
                visible={!!clienteObservacoes}
                cliente={clienteObservacoes}
                onFechar={() => setClienteObservacoes(null)}
            />
        </ScreenWrapper>
    );
}
