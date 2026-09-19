import { Cores } from '@/constants/design';
import ModalAviso from '@/modais/ModalAviso';
import ModalFormulario from '@/modais/ModalFormulario';
// Importados por subpath, um peso por vez, de propósito: o barrel do pacote
// (`@expo-google-fonts/inter`) arrasta os 19 pesos + itálicos para o bundle,
// ~7 MB de .ttf para usar 7 arquivos.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Oswald_400Regular } from '@expo-google-fonts/oswald/400Regular';
import { Oswald_500Medium } from '@expo-google-fonts/oswald/500Medium';
import { Oswald_600SemiBold } from '@expo-google-fonts/oswald/600SemiBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import '../global.css';
import store from '../redux/store';

// Segura a splash até as fontes estarem prontas, senão a primeira renderização
// sai na fonte do sistema e "pula" para Oswald/Inter na frente do usuário.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontesCarregadas, erroFontes] = useFonts({
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Em caso de erro ao baixar/registrar as fontes, libera a splash mesmo
    // assim — o app cai na fonte do sistema em vez de travar no splash.
    if (fontesCarregadas || erroFontes) {
      SplashScreen.hideAsync();
    }
  }, [fontesCarregadas, erroFontes]);

  if (!fontesCarregadas && !erroFontes) return null;

  return (
    <Provider store={store}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Cores.canvas } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        {/* Empilhada sobre o drawer, e não dentro dele: é um detalhe de onde
            se volta, não um destino do menu. */}
        <Stack.Screen name="detalhamento" options={{ headerShown: false }} />
      </Stack>
      <ModalAviso />
      <ModalFormulario />
    </Provider>
  );
}
