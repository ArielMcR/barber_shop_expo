import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { deslogarUsuario } from '@/redux/actions/actionsUsuario';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function PerfilScreen() {
    const router = useRouter();
    const insets = useInsets();
    const dispatch = useAppDispatch();
    const usuario = useAppSelector((state) => state.usuario.usuario);

    return (
        <ScreenWrapper className="flex-1 bg-gray-50" withTopInset={false}>
            <ScrollView className="flex-1">
                <View className="bg-green-500 p-6 pb-16 items-center" style={{ paddingTop: insets.top + 24 }}>
                    <View className="bg-white w-24 h-24 rounded-full items-center justify-center mb-4">
                        <Feather name="user" size={48} color="#10b981" />
                    </View>
                    <Text className="text-white text-2xl font-bold">{usuario?.name || 'Ari Barbeiro'}</Text>
                    <Text className="text-white text-sm mt-1">{usuario?.email || 'ari@barbershop.com'}</Text>
                </View>

                <View className="p-4 -mt-8">
                    <View className="bg-white rounded-xl shadow-sm">
                        <Pressable className="flex-row items-center p-4 border-b border-gray-200">
                            <Feather name="user" size={20} color="#6b7280" />
                            <Text className="flex-1 ml-3 text-gray-800">Editar Perfil</Text>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>

                        <Pressable className="flex-row items-center p-4 border-b border-gray-200">
                            <Feather name="bell" size={20} color="#6b7280" />
                            <Text className="flex-1 ml-3 text-gray-800">Notificações</Text>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>

                        <Pressable className="flex-row items-center p-4 border-b border-gray-200">
                            <Feather name="lock" size={20} color="#6b7280" />
                            <Text className="flex-1 ml-3 text-gray-800">Segurança</Text>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>

                        <Pressable className="flex-row items-center p-4">
                            <Feather name="help-circle" size={20} color="#6b7280" />
                            <Text className="flex-1 ml-3 text-gray-800">Ajuda & Suporte</Text>
                            <Feather name="chevron-right" size={20} color="#6b7280" />
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => dispatch(deslogarUsuario())}
                        className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center gap-2 mt-6"
                    >
                        <Feather name="log-out" size={20} color="white" />
                        <Text className="text-white font-bold text-lg">Sair</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}