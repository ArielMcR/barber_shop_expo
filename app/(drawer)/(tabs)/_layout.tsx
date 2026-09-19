import { Cores, Fontes } from '@/constants/design';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Cores.brandDeep,
                tabBarInactiveTintColor: Cores.inkSubtle,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Cores.surface,
                    borderTopWidth: 1,
                    borderTopColor: Cores.line,
                    height: 62 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontFamily: Fontes.medium,
                    // 10px porque sao 5 abas: em 11px "Relatorios" e "Assistente"
                    // quebram ou truncam em telas estreitas.
                    fontSize: 10,
                    letterSpacing: 0.1,
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Agenda',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="clientes"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="users" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="servicos"
                options={{
                    title: 'Serviços',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="scissors" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="relatorios"
                options={{
                    title: 'Relatórios',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="bar-chart-2" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="assistente"
                options={{
                    title: 'Assistente',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="message-circle" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
