import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setModalAviso } from '@/redux/actions/actionsModais';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const ModalAviso = () => {
    const dispatch = useAppDispatch();
    const modalAviso = useAppSelector((state) => state.modais.modal_aviso);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const iconBounce = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (modalAviso.statusAtivo) {
            scaleAnim.setValue(0.7);
            opacityAnim.setValue(0);
            iconBounce.setValue(0.3);

            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 6,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(iconBounce, {
                    toValue: 1,
                    friction: 4,
                    tension: 80,
                    delay: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [modalAviso.statusAtivo]);

    const fecharModal = () => {
        if (!modalAviso.desabilitaFecharPorTouch) {
            dispatch(setModalAviso({
                ...modalAviso,
                statusAtivo: false
            }));
        }
    };

    const handleConfirmar = () => {
        if (modalAviso.onPress) {
            modalAviso.onPress();
        }
        fecharModal();
    };

    const handleCancelar = () => {
        if (modalAviso.onPressCancel) {
            modalAviso.onPressCancel();
        }
        fecharModal();
    };

    const getTipoConfig = () => {
        switch (modalAviso.tipo) {
            case 'sucesso':
                return {
                    icon: 'check-circle' as const,
                    gradient: ['#34d399', '#059669'] as const,
                    lightBg: 'rgba(16, 185, 129, 0.08)',
                    accentColor: '#059669',
                    title: 'Sucesso!',
                };
            case 'erro':
                return {
                    icon: 'x-circle' as const,
                    gradient: ['#f87171', '#dc2626'] as const,
                    lightBg: 'rgba(239, 68, 68, 0.08)',
                    accentColor: '#dc2626',
                    title: 'Erro!',
                };
            case 'aviso':
                return {
                    icon: 'alert-triangle' as const,
                    gradient: ['#fbbf24', '#d97706'] as const,
                    lightBg: 'rgba(245, 158, 11, 0.08)',
                    accentColor: '#d97706',
                    title: 'Atenção!',
                };
            case 'info':
                return {
                    icon: 'info' as const,
                    gradient: ['#60a5fa', '#2563eb'] as const,
                    lightBg: 'rgba(59, 130, 246, 0.08)',
                    accentColor: '#2563eb',
                    title: 'Informação',
                };
            default:
                return {
                    icon: 'alert-circle' as const,
                    gradient: ['#9ca3af', '#6b7280'] as const,
                    lightBg: 'rgba(107, 114, 128, 0.08)',
                    accentColor: '#6b7280',
                    title: 'Aviso',
                };
        }
    };

    const config = getTipoConfig();

    return (
        <Modal
            visible={modalAviso.statusAtivo}
            transparent
            animationType="none"
            onRequestClose={fecharModal}
        >
            <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
                <Pressable style={styles.overlayPress} onPress={fecharModal}>
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <Animated.View
                            style={[
                                styles.container,
                                {
                                    transform: [{ scale: scaleAnim }],
                                    opacity: opacityAnim,
                                },
                            ]}
                        >
                            {/* Floating Icon Badge */}
                            <View style={styles.iconWrapper}>
                                <Animated.View
                                    style={{
                                        transform: [{ scale: iconBounce }],
                                    }}
                                >
                                    <LinearGradient
                                        colors={config.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.iconBadge}
                                    >
                                        <Feather
                                            name={config.icon}
                                            size={40}
                                            color="#ffffff"
                                        />
                                    </LinearGradient>
                                </Animated.View>
                            </View>

                            {/* Content */}
                            <View style={styles.content}>
                                <Text style={[styles.title, { color: config.accentColor }]}>
                                    {config.title}
                                </Text>

                                <View style={[styles.divider, { backgroundColor: config.accentColor }]} />

                                <Text
                                    style={[
                                        styles.message,
                                        { textAlign: (modalAviso.textAlign as any) || 'center' },
                                    ]}
                                >
                                    {modalAviso.mensagem}
                                </Text>
                            </View>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {modalAviso.textoBotaoCancelar && modalAviso.textoBotaoConfirmar ? (
                                    <View style={styles.buttonRow}>
                                        <Pressable
                                            onPress={handleCancelar}
                                            style={({ pressed }) => [
                                                styles.button,
                                                styles.buttonCancel,
                                                pressed && styles.buttonPressed,
                                            ]}
                                        >
                                            <Text style={styles.buttonTextCancel}>
                                                {modalAviso.textoBotaoCancelar}
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={handleConfirmar}
                                            style={({ pressed }) => [
                                                styles.button,
                                                pressed && styles.buttonPressed,
                                            ]}
                                        >
                                            <LinearGradient
                                                colors={
                                                    modalAviso.inverterCoresBotaoInfo
                                                        ? ['#9ca3af', '#6b7280']
                                                        : config.gradient
                                                }
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={styles.buttonGradient}
                                            >
                                                <Text style={styles.buttonText}>
                                                    {modalAviso.textoBotaoConfirmar}
                                                </Text>
                                            </LinearGradient>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <Pressable
                                        onPress={handleConfirmar}
                                        style={({ pressed }) => [
                                            styles.button,
                                            styles.buttonSingle,
                                            pressed && styles.buttonPressed,
                                        ]}
                                    >
                                        <LinearGradient
                                            colors={
                                                modalAviso.inverterCoresBotaoInfo
                                                    ? ['#9ca3af', '#6b7280']
                                                    : config.gradient
                                            }
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.buttonGradient}
                                        >
                                            <Text style={styles.buttonText}>
                                                {modalAviso.textoBotao || 'OK'}
                                            </Text>
                                        </LinearGradient>
                                    </Pressable>
                                )}
                            </View>
                        </Animated.View>
                    </Pressable>
                </Pressable>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    overlayPress: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        width: '100%',
        maxWidth: 380,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.2,
        shadowRadius: 32,
        elevation: 24,
    },

    /* ── Icon Badge (floats above card) ── */
    iconWrapper: {
        alignItems: 'center',
        marginTop: -38,
    },
    iconBadge: {
        width: 76,
        height: 76,
        borderRadius: 38,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 12,
        borderWidth: 4,
        borderColor: '#ffffff',
    },

    /* ── Content ── */
    content: {
        paddingHorizontal: 28,
        paddingTop: 18,
        paddingBottom: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    divider: {
        width: 40,
        height: 3,
        borderRadius: 2,
        marginTop: 10,
        marginBottom: 16,
        opacity: 0.4,
    },
    message: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
        fontWeight: '400',
    },

    /* ── Buttons ── */
    buttonContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    buttonSingle: {
        width: '100%',
    },
    buttonCancel: {
        backgroundColor: '#f3f4f6',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.3,
    },
    buttonTextCancel: {
        color: '#6b7280',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ModalAviso;