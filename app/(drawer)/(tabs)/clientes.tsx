import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { requestClients } from '@/redux/actions/actionsClients';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';

type Cliente = {
    id: number;
    nome: string;
    telefone: string;
    ultimaVisita: string;
};

export default function ClientesScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();
    const clientes = useAppSelector((state) => state.clientes.clients) || [];


    const [searchQuery, setSearchQuery] = useState('');

    const filteredClientes: Cliente[] = clientes.filter((cliente: Cliente) =>
        cliente.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        dispatch(requestClients());
    }, []);

    return (
        <ScreenWrapper className="flex-1 bg-gray-50" withTopInset={false}>
            <View className="bg-green-500 p-4 pb-6">
                <Text className="text-white text-2xl font-bold">Clientes</Text>
                <View className="bg-white rounded-lg flex-row items-center px-3 mt-3">
                    <Feather name="search" size={20} color="#6b7280" />
                    <TextInput
                        className="flex-1 p-3 text-gray-800"
                        placeholder="Buscar cliente..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View className="gap-3 p-4">
                <FlatList
                    data={filteredClientes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item: cliente }) => (
                        <Pressable
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center">
                                    <Feather name="user" size={24} color="#10b981" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-800">{cliente.nome}</Text>
                                    <Text className="text-gray-600 text-sm mt-1">{cliente.telefone}</Text>
                                    <Text className="text-gray-500 text-xs mt-1">
                                        Última visita: {cliente.ultimaVisita}
                                    </Text>
                                </View>
                                <Feather name="chevron-right" size={20} color="#6b7280" />
                            </View>
                        </Pressable>
                    )}
                    contentContainerStyle={{ gap: 12 }}
                    refreshControl={<RefreshControl onRefresh={() => dispatch(requestClients())} refreshing={false} />}
                />
            </View>

            <Pressable className="absolute right-6 bg-green-500 w-14 h-14 rounded-full items-center justify-center shadow-lg" style={{ bottom: insets.bottom + 24 }}>
                <Feather name="user-plus" size={24} color="white" />
            </Pressable>
        </ScreenWrapper>
    );
}
