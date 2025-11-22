import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setModalAviso } from '@/redux/actions/actionsModais';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const ModalAviso = () => {
    const dispatch = useAppDispatch();
    const modalAviso = useAppSelector((state) => state.modais.modal_aviso);

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
                    iconColor: '#10b981',
                    bgColor: '#d1fae5',
                    borderColor: '#10b981',
                    btnColor: '#10b981',
                };
            case 'erro':
                return {
                    icon: 'x-circle' as const,
                    iconColor: '#ef4444',
                    bgColor: '#fee2e2',
                    borderColor: '#ef4444',
                    btnColor: '#ef4444',
                };
            case 'aviso':
                return {
                    icon: 'alert-triangle' as const,
                    iconColor: '#f59e0b',
                    bgColor: '#fef3c7',
                    borderColor: '#f59e0b',
                    btnColor: '#f59e0b',
                };
            case 'info':
                return {
                    icon: 'info' as const,
                    iconColor: '#3b82f6',
                    bgColor: '#dbeafe',
                    borderColor: '#3b82f6',
                    btnColor: '#3b82f6',
                };
            default:
                return {
                    icon: 'alert-circle' as const,
                    iconColor: '#6b7280',
                    bgColor: '#f3f4f6',
                    borderColor: '#6b7280',
                    btnColor: '#6b7280',
                };
        }
    };

    const config = getTipoConfig();

    return (
        <Modal
            visible={modalAviso.statusAtivo}
            transparent
            animationType="fade"
            onRequestClose={fecharModal}
        >
            <Pressable
                style={styles.overlay}
                onPress={fecharModal}
            >
                <Pressable
                    style={styles.container}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header com ícone */}
                    <View style={[styles.header, { backgroundColor: config.bgColor, borderBottomColor: config.borderColor }]}>
                        <View style={styles.iconCircle}>
                            <Feather name={config.icon} size={56} color={config.iconColor} />
                        </View>
                    </View>

                    {/* Conteúdo */}
                    <View style={styles.content}>
                        <Text
                            style={[styles.message, { textAlign: modalAviso.textAlign as any || 'center' }]}
                        >
                            {modalAviso.mensagem}
                        </Text>
                    </View>

                    {/* Botões */}
                    <View style={styles.buttonContainer}>
                        {modalAviso.textoBotaoCancelar && modalAviso.textoBotaoConfirmar ? (
                            // Dois botões (Cancelar e Confirmar)
                            <View style={styles.buttonRow}>
                                <Pressable
                                    onPress={handleCancelar}
                                    style={[styles.button, styles.buttonCancel]}
                                >
                                    <Text style={styles.buttonTextCancel}>
                                        {modalAviso.textoBotaoCancelar}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleConfirmar}
                                    style={[
                                        styles.button,
                                        { backgroundColor: modalAviso.inverterCoresBotaoInfo ? '#6b7280' : config.btnColor }
                                    ]}
                                >
                                    <Text style={styles.buttonText}>
                                        {modalAviso.textoBotaoConfirmar}
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            // Um botão apenas
                            <Pressable
                                onPress={handleConfirmar}
                                style={[
                                    styles.button,
                                    styles.buttonSingle,
                                    { backgroundColor: modalAviso.inverterCoresBotaoInfo ? '#6b7280' : config.btnColor }
                                ]}
                            >
                                <Text style={styles.buttonText}>
                                    {modalAviso.textoBotao || 'OK'}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        borderBottomWidth: 4,
    },
    iconCircle: {
        backgroundColor: '#ffffff',
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    content: {
        padding: 24,
    },
    message: {
        fontSize: 18,
        color: '#1f2937',
        lineHeight: 26,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSingle: {
        width: '100%',
        height: 48,
    },
    buttonCancel: {
        backgroundColor: '#e5e7eb',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonTextCancel: {
        color: '#374151',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ModalAviso;