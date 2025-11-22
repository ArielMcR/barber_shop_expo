import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function RelatoriosScreen() {
    const insets = useInsets();

    return (
        <ScreenWrapper className="flex-1 bg-gray-50" withTopInset={false}>
            <View className="bg-green-500 p-4 pb-6">
                <Text className="text-white text-2xl font-bold">Relatórios</Text>
                <Text className="text-white text-sm mt-1">Acompanhe seus resultados</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="gap-3">
                    <View className="bg-white rounded-xl p-4 shadow-sm">
                        <Text className="text-gray-600 text-sm">Faturamento Hoje</Text>
                        <Text className="text-3xl font-bold text-green-600 mt-2">R$ 450,00</Text>
                        <View className="flex-row items-center mt-2">
                            <Feather name="trending-up" size={16} color="#10b981" />
                            <Text className="text-green-600 text-sm ml-1">+15% vs ontem</Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-xl p-4 shadow-sm">
                        <Text className="text-gray-600 text-sm">Atendimentos Hoje</Text>
                        <Text className="text-3xl font-bold text-blue-600 mt-2">12</Text>
                        <View className="flex-row items-center mt-2">
                            <Feather name="users" size={16} color="#3b82f6" />
                            <Text className="text-blue-600 text-sm ml-1">5 agendados restantes</Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-xl p-4 shadow-sm">
                        <Text className="text-gray-600 text-sm mb-3">Faturamento Semanal</Text>
                        <View className="gap-2">
                            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => (
                                <View key={dia} className="flex-row items-center gap-2">
                                    <Text className="text-gray-600 w-10">{dia}</Text>
                                    <View className="flex-1 bg-gray-200 h-8 rounded-lg overflow-hidden">
                                        <View
                                            className="bg-green-500 h-full"
                                            style={{ width: `${Math.random() * 100}%` }}
                                        />
                                    </View>
                                    <Text className="text-gray-800 font-semibold w-20 text-right">
                                        R$ {(Math.random() * 500 + 200).toFixed(2)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <Pressable className="bg-green-500 rounded-xl p-4 flex-row items-center justify-center gap-2">
                        <Feather name="download" size={20} color="white" />
                        <Text className="text-white font-bold text-lg">Exportar Relatório</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
