import ModalAviso from '@/modais/ModalAviso';
import ModalFormulario from '@/modais/ModalFormulario';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import '../global.css';
import store from '../redux/store';
export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="selecao-empresa" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
      <ModalAviso />
      <ModalFormulario />
    </Provider>
  );
}
