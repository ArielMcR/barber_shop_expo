import { useModalAviso } from '@/hooks/useModalAviso';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { realizarLogin } from '@/redux/actions/actionsUsuario';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import { BackHandler, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import logo from "../assets/images/LogoAri.jpg";
import Copyright from "../components/Copyright/index";


export default function App() {
    const dispatch = useAppDispatch();
    const usuario = useAppSelector((state) => state.usuario);
    const modalAviso = useModalAviso();

    const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
    const [user, setUser] = useState<{ name: string, password: string }>({ name: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const realizarLogin_ = () => {
        if (!user.name.trim()) {
            modalAviso.mostrarAviso('Por favor, digite seu usuário');
            return;
        }
        if (!user.password.trim()) {
            modalAviso.mostrarAviso('Por favor, digite sua senha');
            return;
        }
        dispatch(realizarLogin({ name: user.name, password: user.password, companyId: null, unitId: null }));
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
            colors={['#ffffff', '#f5f5f5']}
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
                                <Text style={styles.title}>Bem-vindo!</Text>
                                <Text style={styles.subtitle}>Faça login para continuar</Text>

                                {/* Input Usuário */}
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputWrapper}>
                                        <Feather name="user" size={20} color="#6b7280" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Usuário"
                                            placeholderTextColor="#9ca3af"
                                            value={user.name}
                                            onChangeText={(text) => setUser(prev => ({ ...prev, name: text }))}
                                            autoCapitalize="none"
                                            editable={!usuario?.isLoading}
                                        />
                                    </View>
                                </View>

                                {/* Input Senha */}
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputWrapper}>
                                        <Feather name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Senha"
                                            placeholderTextColor="#9ca3af"
                                            value={user.password}
                                            onChangeText={(text) => setUser(prev => ({ ...prev, password: text }))}
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
                                                size={20}
                                                color="#6b7280"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Botão Entrar */}
                                <TouchableOpacity
                                    onPress={realizarLogin_}
                                    disabled={usuario?.isLoading}
                                    style={[styles.buttonLogin, usuario?.isLoading && styles.buttonDisabled]}
                                >
                                    {usuario?.isLoading ? (
                                        <Text style={styles.buttonText}>Entrando...</Text>
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Entrar</Text>
                                            <Feather name="arrow-right" size={20} color="#fff" />
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
                                    <Feather name="x" size={18} color="#ef4444" />
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
        padding: 20,
    },
    contentKeyboard: {
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logoWrapper: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#fff',
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 62,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
    },
    eyeIcon: {
        padding: 4,
    },
    buttonLogin: {
        backgroundColor: '#10b981',
        borderRadius: 12,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 16,
        shadowColor: '#10b981',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#9ca3af',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    buttonExit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    buttonExitText: {
        color: '#ef4444',
        fontSize: 14,
        marginLeft: 6,
    },
});
