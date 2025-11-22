import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { requestServico } from '@/redux/actions/actionsServico';
import Feather from '@expo/vector-icons/Feather';
import { useEffect } from 'react';
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
    const servicos = useAppSelector((state) => state.servicos.servicos) || [];


    useEffect(() => {
        dispatch(requestServico());
    }, []);


    return (
        <ScreenWrapper className="flex-1 bg-gray-50" withTopInset={false}>
            <View className="bg-green-500 p-4 pb-6">
                <Text className="text-white text-2xl font-bold">Serviços</Text>
                <Text className="text-white text-sm mt-1">Gerencie seus serviços</Text>
            </View>

            <View className="gap-3 flex-1 p-4">
                <FlatList
                    data={servicos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item: servico }) => (
                        <Pressable
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3 flex-1">
                                    <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center">
                                        <Feather name="scissors" size={24} color="#10b981" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-800">{servico.nome}</Text>
                                        <Text className="text-gray-600 text-sm mt-1">
                                            <Feather name="clock" size={12} color="#6b7280" /> {servico.duracao}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-xl font-bold text-green-600">{servico.preco}</Text>
                            </View>
                        </Pressable>
                    )}
                    refreshControl={<RefreshControl onRefresh={() => dispatch(requestServico())} refreshing={false} />}
                    contentContainerStyle={{ gap: 12 }}
                />
            </View>

            <Pressable className="absolute right-6 bg-green-500 w-14 h-14 rounded-full items-center justify-center shadow-lg" style={{ bottom: insets.bottom + 24 }}>
                <Feather name="plus" size={24} color="white" />
            </Pressable>
        </ScreenWrapper>
    );
}
