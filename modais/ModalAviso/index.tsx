import { Cores, Fontes, Raio, Sombra } from '@/constants/design';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setModalAviso } from '@/redux/actions/actionsModais';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

    // Sem gradiente: um disco de cor suave com borda e ícone sólido. O gradiente
    // brilhante era o detalhe que mais datava o modal.
    //
    // `corTexto` é o rótulo do botão sólido preenchido com `cor`. Quase toda cor
    // de status é escura o bastante para o creme, mas o dourado do aviso não é:
    // creme sobre #C9971C dá 2,5:1 de contraste (o mínimo legível é 4,5:1) e o
    // texto some dentro do botão. Sobre ele o rótulo vai em tinta escura — 6,5:1.
    const getTipoConfig = () => {
        switch (modalAviso.tipo) {
            case 'sucesso':
                return {
                    icon: 'check-circle' as const,
                    cor: Cores.success,
                    corSoft: Cores.successSoft,
                    corBorda: Cores.successBorder,
                    corTexto: Cores.inkInverse,
                    title: 'SUCESSO',
                };
            case 'erro':
                return {
                    icon: 'x-circle' as const,
                    cor: Cores.danger,
                    corSoft: Cores.dangerSoft,
                    corBorda: Cores.dangerBorder,
                    corTexto: Cores.inkInverse,
                    title: 'ERRO',
                };
            case 'aviso':
                return {
                    icon: 'alert-triangle' as const,
                    cor: Cores.warning,
                    corSoft: Cores.warningSoft,
                    corBorda: Cores.warningBorder,
                    corTexto: Cores.ink,
                    title: 'ATENÇÃO',
                };
            case 'info':
                return {
                    icon: 'info' as const,
                    cor: Cores.info,
                    corSoft: Cores.infoSoft,
                    corBorda: Cores.infoBorder,
                    corTexto: Cores.inkInverse,
                    title: 'INFORMAÇÃO',
                };
            default:
                return {
                    icon: 'alert-circle' as const,
                    cor: Cores.inkMuted,
                    corSoft: Cores.surfaceAlt,
                    corBorda: Cores.line,
                    corTexto: Cores.inkInverse,
                    title: 'AVISO',
                };
        }
    };

    const config = getTipoConfig();
    const corBotao = modalAviso.inverterCoresBotaoInfo ? Cores.inkMuted : config.cor;
    const corTextoBotao = modalAviso.inverterCoresBotaoInfo
        ? Cores.inkInverse
        : config.corTexto;

    return (
        <Modal
            visible={modalAviso.statusAtivo}
            transparent
            animationType="none"
            onRequestClose={fecharModal}
        >
            <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
                <Pressable style={styles.overlayPress} onPress={fecharModal}>
                    {/* O wrapper precisa de largura própria: `overlayPress` centraliza
                        com `alignItems: 'center'`, então este Pressable não estica e
                        fica com largura automática. Sem isso o `width: '100%'` do card
                        resolve contra um pai indefinido, vira `auto`, e o modal encolhe
                        até o tamanho do texto em vez de chegar nos 360. */}
                    <Pressable style={styles.cardWrapper} onPress={(e) => e.stopPropagation()}>
                        <Animated.View
                            style={[
                                styles.container,
                                {
                                    transform: [{ scale: scaleAnim }],
                                    opacity: opacityAnim,
                                },
                            ]}
                        >
                            {/* Selo flutuante sobre o card */}
                            <View style={styles.iconWrapper}>
                                <Animated.View
                                    style={[
                                        styles.iconBadge,
                                        {
                                            backgroundColor: config.corSoft,
                                            borderColor: config.corBorda,
                                            transform: [{ scale: iconBounce }],
                                        },
                                    ]}
                                >
                                    <Feather name={config.icon} size={32} color={config.cor} />
                                </Animated.View>
                            </View>

                            {/* Conteúdo */}
                            <View style={styles.content}>
                                <Text style={[styles.title, { color: config.cor }]}>
                                    {config.title}
                                </Text>

                                <Text
                                    style={[
                                        styles.message,
                                        { textAlign: (modalAviso.textAlign as any) || 'center' },
                                    ]}
                                >
                                    {modalAviso.mensagem}
                                </Text>
                            </View>

                            {/* Botões.

                                TouchableOpacity com estilo em ARRAY, como nos
                                outros modais. `Pressable` com estilo em função
                                (`({pressed}) => [...]`) não funciona aqui: o
                                projeto compila o JSX com `jsxImportSource:
                                "nativewind"`, e o interop do NativeWind não
                                repassa a forma de função — o estilo inteiro era
                                descartado, deixando o botão sem cor de fundo e
                                sem centralização, com o rótulo creme sumindo
                                sobre o branco do card. */}
                            <View style={styles.buttonContainer}>
                                {modalAviso.textoBotaoCancelar && modalAviso.textoBotaoConfirmar ? (
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity
                                            onPress={handleCancelar}
                                            activeOpacity={0.85}
                                            style={[styles.button, styles.buttonFlex, styles.buttonCancel]}
                                        >
                                            <Text style={styles.buttonTextCancel}>
                                                {modalAviso.textoBotaoCancelar}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={handleConfirmar}
                                            activeOpacity={0.85}
                                            style={[
                                                styles.button,
                                                styles.buttonFlex,
                                                styles.buttonSolid,
                                                { backgroundColor: corBotao },
                                            ]}
                                        >
                                            <Text style={[styles.buttonText, { color: corTextoBotao }]}>
                                                {modalAviso.textoBotaoConfirmar}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleConfirmar}
                                        activeOpacity={0.85}
                                        style={[
                                            styles.button,
                                            styles.buttonSolid,
                                            { backgroundColor: corBotao },
                                        ]}
                                    >
                                        <Text style={[styles.buttonText, { color: corTextoBotao }]}>
                                            {modalAviso.textoBotao || 'OK'}
                                        </Text>
                                    </TouchableOpacity>
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
        backgroundColor: 'rgba(26, 26, 24, 0.55)',
    },
    overlayPress: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
    },
    cardWrapper: {
        width: '100%',
        maxWidth: 360,
    },
    container: {
        backgroundColor: Cores.surface,
        borderRadius: Raio.sheet,
        width: '100%',
        overflow: 'visible',
        ...Sombra.nivel3,
    },

    /* ── Selo (flutua acima do card) ── */
    iconWrapper: {
        alignItems: 'center',
        marginTop: -32,
    },
    iconBadge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        // A cor da borda vem inline, do tipo do aviso.
        borderWidth: 2,
        ...Sombra.nivel1,
    },

    /* ── Conteúdo ── */
    content: {
        paddingHorizontal: 26,
        paddingTop: 14,
        paddingBottom: 4,
        alignItems: 'center',
    },
    title: {
        fontFamily: Fontes.display,
        fontSize: 18,
        letterSpacing: 2,
    },
    message: {
        fontFamily: Fontes.regular,
        fontSize: 14.5,
        color: Cores.inkMuted,
        lineHeight: 22,
        marginTop: 10,
    },

    /* ── Botões ── */
    buttonContainer: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        // Sem `flex: 1` aqui. Como estilo compartilhado, ele também caía no
        // botão único — que é filho de uma COLUNA, onde `flex: 1` vale
        // `flexBasis: 0` no eixo vertical: a altura deixa de vir do conteúdo e
        // passa a vir da distribuição de espaço livre. O botão perdia a altura
        // real (sobrava só o padding, 28pt — abaixo do alvo de toque de 44) e o
        // rótulo escapava da caixa. Dividir a linha é trabalho do `buttonFlex`,
        // aplicado só quando existem dois botões, aí sim no eixo horizontal.
        minHeight: 50,
        borderRadius: Raio.control,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    /** Só na linha de dois botões: divide a largura em partes iguais. */
    buttonFlex: {
        flex: 1,
    },
    buttonSolid: {
        borderWidth: 1,
        borderColor: 'transparent',
    },
    buttonCancel: {
        backgroundColor: Cores.surface,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    buttonText: {
        fontFamily: Fontes.semibold,
        // Cor real vem inline, do tipo do aviso: sobre o dourado o creme só
        // rende 2,5:1 de contraste e o rótulo some.
        color: Cores.inkInverse,
        fontSize: 15,
    },
    buttonTextCancel: {
        fontFamily: Fontes.semibold,
        color: Cores.inkMuted,
        fontSize: 15,
    },
});

export default ModalAviso;
