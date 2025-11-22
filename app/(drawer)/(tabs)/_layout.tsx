import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#10b981',
                tabBarInactiveTintColor: '#6b7280',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Agendamentos',
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
        </Tabs>
    );
}
