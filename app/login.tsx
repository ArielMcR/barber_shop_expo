import { Cores, Fontes, Raio, Sombra } from '@/constants/design';
import { useModalAviso } from '@/hooks/useModalAviso';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { realizarLogin } from '@/redux/actions/actionsUsuario';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import { BackHandler, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import logo from "../assets/images/LogoAri.jpg";
import Copyright from "../components/Copyright/index";


export default function LoginScreen() {
    const dispatch = useAppDispatch();
    const usuario = useAppSelector((state) => state.usuario);
    const modalAviso = useModalAviso();

    const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
    const [user, setUser] = useState<{ name: string, password: string }>({ name: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [campoFocado, setCampoFocado] = useState<'name' | 'password' | null>(null);

    const realizarLogin_ = () => {
        if (!user.name.trim()) {
            modalAviso.mostrarAviso('Por favor, digite seu usuário');
            return;
        }
        if (!user.password.trim()) {
            modalAviso.mostrarAviso('Por favor, digite sua senha');
            return;
        }
        dispatch(realizarLogin({ name: user.name, password: user.password }));
    }

    useEffect(() => {
        if (usuario?.error) {
            modalAviso.mostrarErro(usuario.error);
        }
    }, [usuario?.error]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
            setIsKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardVisible(false);
            setKeyboardHeight(0);
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <LinearGradient
            colors={[Cores.canvas, Cores.surfaceAlt]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
                        <View style={[
                            styles.content,
                            isKeyboardVisible && styles.contentKeyboard,
                            isKeyboardVisible && { paddingBottom: keyboardHeight / 3 }
                        ]}>
                            {/* Logo */}
                            {!isKeyboardVisible && (
                                <View style={styles.logoContainer}>
                                    <View style={styles.logoWrapper}>
                                        <Image source={logo} style={styles.logo} />
                                    </View>
                                </View>
                            )}

                            {/* Card de Login */}
                            <View style={styles.card}>
                                <Text style={styles.title}>BEM-VINDO</Text>
                                <View style={styles.titleRule} />
                                <Text style={styles.subtitle}>Faça login para continuar</Text>

                                {/* Input Usuário */}
                                <View style={styles.inputContainer}>
                                    <View style={[
                                        styles.inputWrapper,
                                        campoFocado === 'name' && styles.inputWrapperFocado,
                                    ]}>
                                        <Feather
                                            name="user"
                                            size={18}
                                            color={campoFocado === 'name' ? Cores.brand : Cores.inkSubtle}
                                            style={styles.inputIcon}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Usuário"
                                            placeholderTextColor={Cores.inkSubtle}
                                            value={user.name}
                                            onChangeText={(text) => setUser(prev => ({ ...prev, name: text }))}
                                            onFocus={() => setCampoFocado('name')}
                                            onBlur={() => setCampoFocado(null)}
                                            autoCapitalize="none"
                                            editable={!usuario?.isLoading}
                                        />
                                    </View>
                                </View>

                                {/* Input Senha */}
                                <View style={styles.inputContainer}>
                                    <View style={[
                                        styles.inputWrapper,
                                        campoFocado === 'password' && styles.inputWrapperFocado,
                                    ]}>
                                        <Feather
                                            name="lock"
                                            size={18}
                                            color={campoFocado === 'password' ? Cores.brand : Cores.inkSubtle}
                                            style={styles.inputIcon}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Senha"
                                            placeholderTextColor={Cores.inkSubtle}
                                            value={user.password}
                                            onChangeText={(text) => setUser(prev => ({ ...prev, password: text }))}
                                            onFocus={() => setCampoFocado('password')}
                                            onBlur={() => setCampoFocado(null)}
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            editable={!usuario?.isLoading}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <Feather
                                                name={showPassword ? "eye" : "eye-off"}
                                                size={18}
                                                color={Cores.inkSubtle}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Botão Entrar */}
                                <TouchableOpacity
                                    onPress={realizarLogin_}
                                    disabled={usuario?.isLoading}
                                    activeOpacity={0.85}
                                    style={[styles.buttonLogin, usuario?.isLoading && styles.buttonDisabled]}
                                >
                                    {usuario?.isLoading ? (
                                        <Text style={styles.buttonText}>ENTRANDO...</Text>
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>ENTRAR</Text>
                                            <Feather name="arrow-right" size={18} color={Cores.inkInverse} />
                                        </>
                                    )}
                                </TouchableOpacity>

                                {/* Botão Sair */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (typeof BackHandler !== "undefined") {
                                            BackHandler.exitApp();
                                        }
                                    }}
                                    style={styles.buttonExit}
                                >
                                    <Text style={styles.buttonExitText}>Sair do aplicativo</Text>
                                </TouchableOpacity>
                            </View>

                            {!isKeyboardVisible && <Copyright />}
                        </View>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    contentKeyboard: {
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    logoContainer: {
        marginBottom: 28,
    },
    logoWrapper: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: Cores.surface,
        padding: 6,
        borderWidth: 1,
        borderColor: Cores.line,
        ...Sombra.nivel2,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 58,
    },
    card: {
        backgroundColor: Cores.surface,
        borderRadius: Raio.sheet,
        borderWidth: 1,
        borderColor: Cores.line,
        padding: 28,
        width: '100%',
        maxWidth: 400,
        ...Sombra.nivel2,
    },
    title: {
        fontFamily: Fontes.display,
        fontSize: 30,
        letterSpacing: 2,
        color: Cores.ink,
        textAlign: 'center',
    },
    /** Fio de cobre sob o título — único uso da marca acima da dobra. */
    titleRule: {
        width: 40,
        height: 2,
        backgroundColor: Cores.brand,
        alignSelf: 'center',
        marginTop: 10,
    },
    subtitle: {
        fontFamily: Fontes.regular,
        fontSize: 14,
        color: Cores.inkMuted,
        marginTop: 12,
        marginBottom: 28,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 14,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Cores.canvas,
        borderRadius: Raio.control,
        borderWidth: 1,
        borderColor: Cores.line,
        paddingHorizontal: 14,
        height: 52,
    },
    inputWrapperFocado: {
        borderColor: Cores.brand,
        backgroundColor: Cores.surface,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontFamily: Fontes.regular,
        fontSize: 15,
        color: Cores.ink,
    },
    eyeIcon: {
        padding: 4,
    },
    buttonLogin: {
        backgroundColor: Cores.brand,
        borderRadius: Raio.control,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
        marginBottom: 6,
        ...Sombra.nivel2,
    },
    buttonDisabled: {
        backgroundColor: Cores.inkSubtle,
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        fontFamily: Fontes.display,
        color: Cores.inkInverse,
        fontSize: 16,
        letterSpacing: 1.5,
    },
    buttonExit: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    buttonExitText: {
        fontFamily: Fontes.medium,
        color: Cores.inkSubtle,
        fontSize: 13,
    },
});
