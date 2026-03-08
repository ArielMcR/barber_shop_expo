import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    visible: boolean;
    slot: {
        horario: string;
        cliente: any;
        servico: any;
        duracaoMin: number;
    } | null;
    onFechar: () => void;
    onTrocarCliente: () => void;
    onTrocarServico: () => void;
    onCancelarAgendamento: () => void;
};

const ModalDetalheAgendamento = ({
    visible,
    slot,
    onFechar,
    onTrocarCliente,
    onTrocarServico,
    onCancelarAgendamento,
}: Props) => {
    if (!slot) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onFechar}
        >
            <Pressable style={styles.overlay} onPress={onFechar}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <LinearGradient
                                colors={['#34d399', '#059669']}
                                style={styles.headerIcon}
                            >
                                <Feather name="calendar" size={20} color="#fff" />
                            </LinearGradient>
                            <View>
                                <Text style={styles.title}>Detalhes do Agendamento</Text>
                                <Text style={styles.subtitle}>Horário: {slot.horario}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onFechar} style={styles.closeButton}>
                            <Feather name="x" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoSection}>
                        <View style={styles.infoCard}>
                            <View style={styles.infoCardIcon}>
                                <Feather name="user" size={20} color="#059669" />
                            </View>
                            <View style={styles.infoCardContent}>
                                <Text style={styles.infoCardLabel}>Cliente</Text>
                                <Text style={styles.infoCardValue}>{slot.cliente?.nome}</Text>
                                {slot.cliente?.telefone && (
                                    <Text style={styles.infoCardDetalhe}>{slot.cliente.telefone}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <View style={styles.infoCardIcon}>
                                <Feather name="scissors" size={20} color="#059669" />
                            </View>
                            <View style={styles.infoCardContent}>
                                <Text style={styles.infoCardLabel}>Serviço</Text>
                                <Text style={styles.infoCardValue}>{slot.servico?.nome}</Text>
                                <View style={styles.infoCardTags}>
                                    <View style={styles.tag}>
                                        <Feather name="clock" size={12} color="#6b7280" />
                                        <Text style={styles.tagText}>{slot.servico?.duracao}</Text>
                                    </View>
                                    <View style={styles.tag}>
                                        <Feather name="dollar-sign" size={12} color="#059669" />
                                        <Text style={[styles.tagText, { color: '#059669', fontWeight: '700' }]}>
                                            {slot.servico?.preco}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actionsSection}>
                        <Text style={styles.actionsTitle}>Ações</Text>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                onFechar();
                                setTimeout(onTrocarCliente, 200);
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#eff6ff' }]}>
                                <Feather name="user-plus" size={18} color="#3b82f6" />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionText}>Trocar Cliente</Text>
                                <Text style={styles.actionSubtext}>Alterar o cliente deste agendamento</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                onFechar();
                                setTimeout(onTrocarServico, 200);
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#f0fdf4' }]}>
                                <Feather name="refresh-cw" size={18} color="#059669" />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={styles.actionText}>Trocar Serviço</Text>
                                <Text style={styles.actionSubtext}>Alterar o serviço agendado</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonDanger]}
                            onPress={() => {
                                onFechar();
                                setTimeout(onCancelarAgendamento, 200);
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#fef2f2' }]}>
                                <Feather name="trash-2" size={18} color="#ef4444" />
                            </View>
                            <View style={styles.actionContent}>
                                <Text style={[styles.actionText, { color: '#ef4444' }]}>Cancelar Agendamento</Text>
                                <Text style={styles.actionSubtext}>Remover este agendamento</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="#fca5a5" />
                        </TouchableOpacity>
                    </View>

                    {/* Botão Fechar */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onFechar} style={styles.buttonClose}>
                            <Text style={styles.buttonCloseText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    closeButton: {
        padding: 4,
    },

    /* Info Section */
    infoSection: {
        padding: 20,
        gap: 12,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    infoCardIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoCardContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoCardLabel: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoCardValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 2,
    },
    infoCardDetalhe: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 1,
    },
    infoCardTags: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#6b7280',
    },

    /* Actions Section */
    actionsSection: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    actionsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#f9fafb',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    actionButtonDanger: {
        borderColor: '#fee2e2',
        backgroundColor: '#fff5f5',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionContent: {
        flex: 1,
        marginLeft: 12,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    actionSubtext: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 2,
    },

    /* Button */
    buttonContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    buttonClose: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
    buttonCloseText: {
        color: '#6b7280',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ModalDetalheAgendamento;
