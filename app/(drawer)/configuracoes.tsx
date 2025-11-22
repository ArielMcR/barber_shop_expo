import ScreenWrapper from '@/components/ScreenWrapper';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

export default function ConfiguracoesScreen() {
    const [notificacoes, setNotificacoes] = useState(true);
    const [modoEscuro, setModoEscuro] = useState(false);
    const [lembretes, setLembretes] = useState(true);

    return (
        <ScreenWrapper className="flex-1 bg-gray-50" topOffset={16}>
            <ScrollView className="flex-1 p-4">
                <View className="gap-4">
                    <View className="bg-white rounded-xl shadow-sm">
                        <View className="p-4 border-b border-gray-200">
                            <Text className="text-lg font-bold text-gray-800">Preferências</Text>
                        </View>

                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <View className="flex-row items-center gap-3">
                                <Feather name="bell" size={20} color="#6b7280" />
                                <Text className="text-gray-800">Notificações</Text>
                            </View>
                            <Switch
                                value={notificacoes}
                                onValueChange={setNotificacoes}
                                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                                thumbColor={notificacoes ? '#10b981' : '#f3f4f6'}
                            />
                        </View>

                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <View className="flex-row items-center gap-3">
                                <Feather name="moon" size={20} color="#6b7280" />
                                <Text className="text-gray-800">Modo Escuro</Text>
                            </View>
                            <Switch
                                value={modoEscuro}
                                onValueChange={setModoEscuro}
                                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                                thumbColor={modoEscuro ? '#10b981' : '#f3f4f6'}
                            />
                        </View>

                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center gap-3">
                                <Feather name="clock" size={20} color="#6b7280" />
                                <Text className="text-gray-800">Lembretes de Agendamento</Text>
                            </View>
                            <Switch
                                value={lembretes}
                                onValueChange={setLembretes}
                                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                                thumbColor={lembretes ? '#10b981' : '#f3f4f6'}
                            />
                        </View>
                    </View>

                    <View className="bg-white rounded-xl shadow-sm">
                        <View className="p-4 border-b border-gray-200">
                            <Text className="text-lg font-bold text-gray-800">Negócio</Text>
                        </View>

                        <Pressable className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <View className="flex-row items-center gap-3">
                                <Feather name="briefcase" size={20} color="#6b7280" />
                                <Text className="text-gray-800">Informações da Barbearia</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>

                        <Pressable className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <View className="flex-row items-center gap-3">
                                <Feather name="calendar" size={20} color="#6b7280" />
                                <Text className="text-gray-800">Horário de Funcionamento</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>

                        <Pressable className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center gap-3">
                                <Feather name="dollar-sign" size={20} color="#6b7280" />
                                <Text className="text-gray-800">Formas de Pagamento</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>
                    </View>

                    <View className="bg-white rounded-xl shadow-sm">
                        <View className="p-4 border-b border-gray-200">
                            <Text className="text-lg font-bold text-gray-800">Sobre</Text>
                        </View>

                        <View className="p-4 border-b border-gray-200">
                            <Text className="text-gray-600 text-sm">Versão do App</Text>
                            <Text className="text-gray-800 font-semibold mt-1">1.0.0</Text>
                        </View>

                        <Pressable className="flex-row items-center justify-between p-4">
                            <Text className="text-gray-800">Termos de Uso</Text>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
