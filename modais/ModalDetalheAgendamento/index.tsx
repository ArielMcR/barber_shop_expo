import { Cores, Fontes, Raio, Sombra } from '@/constants/design';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    onConcluirAgendamento: () => void;
    concluido?: boolean;
};

const ModalDetalheAgendamento = ({
    visible,
    slot,
    onFechar,
    onTrocarCliente,
    onTrocarServico,
    onCancelarAgendamento,
    onConcluirAgendamento,
    concluido,
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
                        <View style={styles.grabber} />
                        <View style={styles.headerRow}>
                            <View style={styles.headerLeft}>
                                {/* Horário como o próprio selo: é a identidade do slot. */}
                                <View style={styles.horarioBadge}>
                                    <Text style={styles.horarioText}>{slot.horario}</Text>
                                </View>
                                <View style={styles.headerTexts}>
                                    <Text style={styles.title}>AGENDAMENTO</Text>
                                    {concluido && (
                                        <View style={styles.statusRow}>
                                            <Feather name="check-circle" size={12} color={Cores.success} />
                                            <Text style={styles.statusText}>Concluído</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity onPress={onFechar} style={styles.closeButton}>
                                <Feather name="x" size={20} color={Cores.inkMuted} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.infoSection}>
                            <View style={styles.infoCard}>
                                <View style={styles.infoCardIcon}>
                                    <Feather name="user" size={17} color={Cores.brandDeep} />
                                </View>
                                <View style={styles.infoCardContent}>
                                    <Text style={styles.infoCardLabel}>CLIENTE</Text>
                                    <Text style={styles.infoCardValue}>{slot.cliente?.nome}</Text>
                                    {slot.cliente?.telefone && (
                                        <Text style={styles.infoCardDetalhe}>{slot.cliente.telefone}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.infoCard}>
                                <View style={styles.infoCardIcon}>
                                    <Feather name="scissors" size={17} color={Cores.brandDeep} />
                                </View>
                                <View style={styles.infoCardContent}>
                                    <Text style={styles.infoCardLabel}>
                                        {(slot.servico?.itens?.length ?? 0) > 1 ? 'SERVIÇOS' : 'SERVIÇO'}
                                    </Text>

                                    {/* Um atendimento pode ter vários serviços: lista item a
                                        item com o preço congelado de cada, e o total embaixo. */}
                                    {slot.servico?.itens?.length ? (
                                        slot.servico.itens.map((item: any, i: number) => (
                                            <View key={`${item.id}-${i}`} style={styles.servicoItem}>
                                                <Text style={styles.infoCardValue}>{item.nome}</Text>
                                                <Text style={styles.servicoItemDetalhe}>
                                                    {item.duracao} · {item.preco}
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.infoCardValue}>{slot.servico?.nome}</Text>
                                    )}

                                    <View style={styles.infoCardTags}>
                                        <View style={styles.tag}>
                                            <Feather name="clock" size={11} color={Cores.inkMuted} />
                                            <Text style={styles.tagText}>{slot.servico?.duracao}</Text>
                                        </View>
                                        <View style={styles.tag}>
                                            <Text style={styles.tagTextForte}>{slot.servico?.preco}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.actionsSection}>
                            <Text style={styles.actionsTitle}>AÇÕES</Text>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    onFechar();
                                    setTimeout(onTrocarCliente, 200);
                                }}
                                activeOpacity={0.7}
                            >
                                <Feather name="user-plus" size={17} color={Cores.inkMuted} />
                                <View style={styles.actionContent}>
                                    <Text style={styles.actionText}>Trocar Cliente</Text>
                                    <Text style={styles.actionSubtext}>Alterar o cliente deste agendamento</Text>
                                </View>
                                <Feather name="chevron-right" size={17} color={Cores.inkSubtle} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    onFechar();
                                    setTimeout(onTrocarServico, 200);
                                }}
                                activeOpacity={0.7}
                            >
                                <Feather name="refresh-cw" size={17} color={Cores.inkMuted} />
                                <View style={styles.actionContent}>
                                    <Text style={styles.actionText}>Trocar Serviço</Text>
                                    <Text style={styles.actionSubtext}>Alterar o serviço agendado</Text>
                                </View>
                                <Feather name="chevron-right" size={17} color={Cores.inkSubtle} />
                            </TouchableOpacity>

                            {concluido ? (
                                <View style={[styles.actionButton, styles.actionButtonSuccess]}>
                                    <Feather name="check-circle" size={17} color={Cores.success} />
                                    <View style={styles.actionContent}>
                                        <Text style={[styles.actionText, { color: Cores.success }]}>
                                            Atendimento concluído
                                        </Text>
                                        <Text style={styles.actionSubtext}>Este agendamento já foi finalizado</Text>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.actionButtonSuccess]}
                                    onPress={() => {
                                        onFechar();
                                        setTimeout(onConcluirAgendamento, 200);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="check-circle" size={17} color={Cores.success} />
                                    <View style={styles.actionContent}>
                                        <Text style={[styles.actionText, { color: Cores.success }]}>
                                            Concluir Atendimento
                                        </Text>
                                        <Text style={styles.actionSubtext}>Marcar este agendamento como concluído</Text>
                                    </View>
                                    <Feather name="chevron-right" size={17} color={Cores.successBorder} />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.actionButton, styles.actionButtonDanger]}
                                onPress={() => {
                                    onFechar();
                                    setTimeout(onCancelarAgendamento, 200);
                                }}
                                activeOpacity={0.7}
                            >
                                <Feather name="trash-2" size={17} color={Cores.danger} />
                                <View style={styles.actionContent}>
                                    <Text style={[styles.actionText, { color: Cores.danger }]}>
                                        Cancelar Agendamento
                                    </Text>
                                    <Text style={styles.actionSubtext}>Remover este agendamento</Text>
                                </View>
                                <Feather name="chevron-right" size={17} color={Cores.dangerBorder} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

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
        backgroundColor: 'rgba(26, 26, 24, 0.55)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: Cores.surface,
        borderTopLeftRadius: Raio.sheet,
        borderTopRightRadius: Raio.sheet,
        maxHeight: '90%',
        ...Sombra.nivel3,
    },

    /* Header */
    header: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Cores.line,
    },
    grabber: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: Cores.lineStrong,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 14,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    horarioBadge: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: Raio.chip,
        backgroundColor: Cores.brandSoft,
        borderWidth: 1,
        borderColor: Cores.brandBorder,
    },
    horarioText: {
        fontFamily: Fontes.display,
        fontSize: 16,
        letterSpacing: 0.5,
        color: Cores.brandDeep,
    },
    headerTexts: {
        flex: 1,
    },
    title: {
        fontFamily: Fontes.display,
        fontSize: 17,
        letterSpacing: 1.4,
        color: Cores.ink,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    statusText: {
        fontFamily: Fontes.medium,
        fontSize: 12,
        color: Cores.success,
    },
    closeButton: {
        padding: 4,
    },

    /* Info */
    infoSection: {
        padding: 20,
        gap: 10,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: Raio.card,
        backgroundColor: Cores.canvas,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    infoCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Cores.brandSoft,
        borderWidth: 1,
        borderColor: Cores.brandBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoCardContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoCardLabel: {
        fontFamily: Fontes.display,
        fontSize: 10,
        color: Cores.inkSubtle,
        letterSpacing: 1.5,
    },
    infoCardValue: {
        fontFamily: Fontes.bold,
        fontSize: 15,
        color: Cores.ink,
        marginTop: 2,
    },
    infoCardDetalhe: {
        fontFamily: Fontes.regular,
        fontSize: 12.5,
        color: Cores.inkMuted,
        marginTop: 1,
    },
    servicoItem: {
        marginTop: 4,
    },
    servicoItemDetalhe: {
        fontFamily: Fontes.regular,
        fontSize: 12,
        color: Cores.inkMuted,
        marginTop: 1,
    },
    infoCardTags: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 6,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Cores.surfaceAlt,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    tagText: {
        fontFamily: Fontes.regular,
        fontSize: 11.5,
        color: Cores.inkMuted,
    },
    tagTextForte: {
        fontFamily: Fontes.display,
        fontSize: 12.5,
        color: Cores.ink,
    },

    /* Ações */
    actionsSection: {
        paddingHorizontal: 20,
        paddingBottom: 8,
        gap: 8,
    },
    actionsTitle: {
        fontFamily: Fontes.display,
        fontSize: 10.5,
        color: Cores.inkSubtle,
        letterSpacing: 2,
        marginBottom: 2,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderRadius: Raio.card,
        backgroundColor: Cores.surface,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    actionButtonDanger: {
        borderColor: Cores.dangerBorder,
        backgroundColor: Cores.dangerSoft,
    },
    actionButtonSuccess: {
        borderColor: Cores.successBorder,
        backgroundColor: Cores.successSoft,
    },
    actionContent: {
        flex: 1,
    },
    actionText: {
        fontFamily: Fontes.semibold,
        fontSize: 14.5,
        color: Cores.ink,
    },
    actionSubtext: {
        fontFamily: Fontes.regular,
        fontSize: 11.5,
        color: Cores.inkMuted,
        marginTop: 1,
    },

    /* Rodapé */
    buttonContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Cores.line,
    },
    buttonClose: {
        paddingVertical: 14,
        borderRadius: Raio.control,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Cores.surface,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    buttonCloseText: {
        fontFamily: Fontes.semibold,
        color: Cores.inkMuted,
        fontSize: 15,
    },
});

export default ModalDetalheAgendamento;
