import Feather from '@expo/vector-icons/Feather';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView className="flex-1">
            <Drawer
                screenOptions={{
                    drawerActiveTintColor: '#10b981',
                    drawerInactiveTintColor: '#6b7280',
                    headerStyle: {
                        backgroundColor: '#10b981',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        drawerLabel: 'Início',
                        title: 'Barber Shop',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="perfil"
                    options={{
                        drawerLabel: 'Perfil',
                        title: 'Meu Perfil',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="user" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="configuracoes"
                    options={{
                        drawerLabel: 'Configurações',
                        title: 'Configurações',
                        drawerIcon: ({ color, size }) => (
                            <Feather name="settings" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
