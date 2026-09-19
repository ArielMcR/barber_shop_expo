import { Cores, Fontes } from '@/constants/design';
import { useAppSelector } from '@/hooks/useRedux';
import Feather from '@expo/vector-icons/Feather';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
    const loja = useAppSelector((state) => state.loja.loja);
    return (
        <GestureHandlerRootView className="flex-1">
            <Drawer
                screenOptions={{
                    drawerActiveTintColor: Cores.brandDeep,
                    drawerInactiveTintColor: Cores.inkMuted,
                    drawerActiveBackgroundColor: Cores.brandSoft,
                    drawerStyle: {
                        backgroundColor: Cores.canvas,
                    },
                    drawerLabelStyle: {
                        fontFamily: Fontes.medium,
                        fontSize: 15,
                        // O Drawer aplica uma margem negativa padrão que encosta
                        // o texto no ícone; 0 devolve o respiro do gap real.
                        marginLeft: 0,
                    },
                    drawerItemStyle: {
                        borderRadius: 12,
                        paddingLeft: 4,
                    },
                    // Header agora é o próprio creme da tela, sem faixa colorida:
                    // o cabeçalho vira uma continuação do papel, não um carimbo.
                    headerStyle: {
                        backgroundColor: Cores.canvas,
                        shadowColor: 'transparent',
                        elevation: 0,
                        borderBottomWidth: 0,
                    },
                    headerTintColor: Cores.ink,
                    headerTitleStyle: {
                        fontFamily: Fontes.display,
                        fontSize: 19,
                        letterSpacing: 1.1,
                        color: Cores.ink,
                    },
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        drawerLabel: 'Início',
                        title: loja ? loja.tradeName.toUpperCase() : 'INÍCIO',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="perfil"
                    options={{
                        drawerLabel: 'Perfil',
                        title: 'MEU PERFIL',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="user" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="configuracoes"
                    options={{
                        drawerLabel: 'Configurações',
                        title: 'CONFIGURAÇÕES',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="settings" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
