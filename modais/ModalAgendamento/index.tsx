import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setModalAgendamento } from '@/redux/actions/actionsModais';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type OnConfirmarParams = {
    cliente: any;
    servico: any;
    horario: string;
    modo: 'novo' | 'trocar_cliente' | 'trocar_servico';
};

const ModalAgendamento = ({ onConfirmar }: { onConfirmar: (params: OnConfirmarParams) => void }) => {
    const dispatch = useAppDispatch();
    const modalAgendamento = useAppSelector((state) => state.modais.modal_agendamento);
    const clientes = useAppSelector((state) => state.clientes.clients);
    const servicos = useAppSelector((state) => state.servicos.servicos);

    const modo = modalAgendamento.modo || 'novo';
    const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
    const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);

    useEffect(() => {
        if (modalAgendamento.statusAtivo) {
            if (modo === 'trocar_servico' && modalAgendamento.clienteAtual) {
                setClienteSelecionado(modalAgendamento.clienteAtual);
                setServicoSelecionado(null);
            } else if (modo === 'trocar_cliente' && modalAgendamento.servicoAtual) {
                setServicoSelecionado(modalAgendamento.servicoAtual);
                setClienteSelecionado(null);
            } else {
                setClienteSelecionado(null);
                setServicoSelecionado(null);
            }
        }
    }, [modalAgendamento.statusAtivo]);

    const fecharModal = () => {
        setClienteSelecionado(null);
        setServicoSelecionado(null);
        dispatch(setModalAgendamento({
            statusAtivo: false,
            horario: '',
            data: '',
            modo: 'novo',
        }));
    };

    const handleConfirmar = () => {
        if (!clienteSelecionado || !servicoSelecionado) return;
        onConfirmar({
            cliente: clienteSelecionado,
            servico: servicoSelecionado,
            horario: modalAgendamento.horario,
            modo,
        });
        fecharModal();
    };

    const getTitulo = () => {
        switch (modo) {
            case 'trocar_cliente': return 'Trocar Cliente';
            case 'trocar_servico': return 'Trocar Serviço';
            default: return 'Novo Agendamento';
        }
    };

    const getBotaoTexto = () => {
        switch (modo) {
            case 'trocar_cliente': return 'Confirmar Troca';
            case 'trocar_servico': return 'Confirmar Troca';
            default: return 'Agendar';
        }
    };

    const mostrarClientes = modo === 'novo' || modo === 'trocar_cliente';
    const mostrarServicos = modo === 'novo' || modo === 'trocar_servico';

    const parseDuracaoMinutos = (duracao: string): number => {
        const match = duracao.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 30;
    };

    return (
        <Modal
            visible={modalAgendamento.statusAtivo}
            transparent
            animationType="slide"
            onRequestClose={fecharModal}
        >
            <Pressable style={styles.overlay} onPress={fecharModal}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <LinearGradient
                                colors={['#34d399', '#059669']}
                                style={styles.headerIcon}
                            >
                                <Feather name="calendar" size={20} color="#fff" />
                            </LinearGradient>
                            <View>
                                <Text style={styles.title}>{getTitulo()}</Text>
                                <Text style={styles.subtitle}>
                                    {modalAgendamento.horario && `Horário: ${modalAgendamento.horario}`}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={fecharModal} style={styles.closeButton}>
                            <Feather name="x" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                        {modo === 'trocar_cliente' && servicoSelecionado && (
                            <View style={styles.fixedInfoBanner}>
                                <Feather name="scissors" size={14} color="#059669" />
                                <Text style={styles.fixedInfoText}>
                                    Serviço: {servicoSelecionado.nome} — {servicoSelecionado.preco}
                                </Text>
                            </View>
                        )}


                        {modo === 'trocar_servico' && clienteSelecionado && (
                            <View style={styles.fixedInfoBanner}>
                                <Feather name="user" size={14} color="#059669" />
                                <Text style={styles.fixedInfoText}>
                                    Cliente: {clienteSelecionado.nome}
                                </Text>
                            </View>
                        )}

                        {/* Selecionar Cliente */}
                        {mostrarClientes && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Feather name="user" size={18} color="#059669" />
                                    <Text style={styles.sectionTitle}>Selecione o Cliente</Text>
                                </View>

                                {clientes.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <Feather name="users" size={32} color="#d1d5db" />
                                        <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
                                    </View>
                                ) : (
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            clienteSelecionado && styles.dropdownSelected,
                                        ]}
                                        placeholderStyle={styles.dropdownPlaceholder}
                                        selectedTextStyle={styles.dropdownSelectedText}
                                        inputSearchStyle={styles.dropdownSearch}
                                        containerStyle={styles.dropdownContainer}
                                        itemContainerStyle={styles.dropdownItemContainer}
                                        itemTextStyle={styles.dropdownItemText}
                                        activeColor="#ecfdf5"
                                        data={clientes.map((c: any) => ({
                                            label: c.nome,
                                            value: c.id?.toString(),
                                            telefone: c.telefone,
                                            original: c,
                                        }))}
                                        search
                                        maxHeight={250}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Buscar cliente..."
                                        searchPlaceholder="Pesquisar por nome..."
                                        value={clienteSelecionado?.id?.toString() || null}
                                        onChange={(item: any) => {
                                            setClienteSelecionado(item.original);
                                        }}
                                        dropdownPosition="top"
                                        renderLeftIcon={() => (
                                            <View style={[
                                                styles.dropdownLeftIcon,
                                                clienteSelecionado && styles.dropdownLeftIconSelected,
                                            ]}>
                                                <Feather
                                                    name="user"
                                                    size={16}
                                                    color={clienteSelecionado ? '#fff' : '#6b7280'}
                                                />
                                            </View>
                                        )}
                                        renderItem={(item: any, selected?: boolean) => (
                                            <View style={[
                                                styles.dropdownItem,
                                                selected && styles.dropdownItemSelected,
                                            ]}>
                                                <View style={[
                                                    styles.itemAvatar,
                                                    selected && styles.itemAvatarSelected,
                                                ]}>
                                                    <Text style={[
                                                        styles.itemAvatarText,
                                                        selected && styles.itemAvatarTextSelected,
                                                    ]}>
                                                        {item.label?.charAt(0)?.toUpperCase() || '?'}
                                                    </Text>
                                                </View>
                                                <View style={styles.itemInfo}>
                                                    <Text style={[
                                                        styles.itemNome,
                                                        selected && styles.itemNomeSelected,
                                                    ]}>
                                                        {item.label}
                                                    </Text>
                                                    {item.telefone && (
                                                        <Text style={styles.itemDetalhe}>{item.telefone}</Text>
                                                    )}
                                                </View>
                                                {selected && (
                                                    <Feather name="check-circle" size={20} color="#059669" />
                                                )}
                                            </View>
                                        )}
                                    />
                                )}
                            </View>
                        )}

                        {mostrarServicos && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Feather name="scissors" size={18} color="#059669" />
                                    <Text style={styles.sectionTitle}>Selecione o Serviço</Text>
                                </View>

                                {servicos.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <Feather name="scissors" size={32} color="#d1d5db" />
                                        <Text style={styles.emptyText}>Nenhum serviço cadastrado</Text>
                                    </View>
                                ) : (
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            servicoSelecionado && styles.dropdownSelected,
                                        ]}
                                        placeholderStyle={styles.dropdownPlaceholder}
                                        selectedTextStyle={styles.dropdownSelectedText}
                                        inputSearchStyle={styles.dropdownSearch}
                                        containerStyle={styles.dropdownContainer}
                                        itemContainerStyle={styles.dropdownItemContainer}
                                        itemTextStyle={styles.dropdownItemText}
                                        activeColor="#ecfdf5"
                                        data={servicos.map((s: any) => ({
                                            label: s.nome,
                                            value: s.id?.toString(),
                                            duracao: s.duracao,
                                            preco: s.preco,
                                            slots: Math.ceil(parseDuracaoMinutos(s.duracao) / 30),
                                            original: s,
                                        }))}
                                        search
                                        maxHeight={250}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Buscar serviço..."
                                        searchPlaceholder="Pesquisar por nome..."
                                        value={servicoSelecionado?.id?.toString() || null}
                                        onChange={(item: any) => {
                                            setServicoSelecionado(item.original);
                                        }}
                                        dropdownPosition="top"
                                        renderLeftIcon={() => (
                                            <View style={[
                                                styles.dropdownLeftIcon,
                                                servicoSelecionado && styles.dropdownLeftIconSelected,
                                            ]}>
                                                <Feather
                                                    name="scissors"
                                                    size={16}
                                                    color={servicoSelecionado ? '#fff' : '#6b7280'}
                                                />
                                            </View>
                                        )}
                                        renderItem={(item: any, selected?: boolean) => (
                                            <View style={[
                                                styles.dropdownItem,
                                                selected && styles.dropdownItemSelected,
                                            ]}>
                                                <View style={[
                                                    styles.servicoIconWrapper,
                                                    selected && styles.itemAvatarSelected,
                                                ]}>
                                                    <Feather
                                                        name="scissors"
                                                        size={16}
                                                        color={selected ? '#fff' : '#6b7280'}
                                                    />
                                                </View>
                                                <View style={styles.itemInfo}>
                                                    <Text style={[
                                                        styles.itemNome,
                                                        selected && styles.itemNomeSelected,
                                                    ]}>
                                                        {item.label}
                                                    </Text>
                                                    <View style={styles.servicoDetalhes}>
                                                        <View style={styles.servicoTag}>
                                                            <Feather name="clock" size={12} color="#6b7280" />
                                                            <Text style={styles.servicoTagText}>{item.duracao}</Text>
                                                        </View>
                                                        <View style={styles.servicoTag}>
                                                            <Feather name="dollar-sign" size={12} color="#6b7280" />
                                                            <Text style={styles.servicoTagText}>{item.preco}</Text>
                                                        </View>
                                                        {item.slots > 1 && (
                                                            <View style={[styles.servicoTag, styles.servicoTagSlots]}>
                                                                <Text style={styles.servicoTagSlotsText}>
                                                                    {item.slots} slots
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                                {selected && (
                                                    <Feather name="check-circle" size={20} color="#059669" />
                                                )}
                                            </View>
                                        )}
                                    />
                                )}
                            </View>
                        )}

                        {clienteSelecionado && servicoSelecionado && (
                            <View style={styles.resumo}>
                                <Text style={styles.resumoTitle}>Resumo</Text>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Horário</Text>
                                    <Text style={styles.resumoValue}>{modalAgendamento.horario}</Text>
                                </View>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Cliente</Text>
                                    <Text style={styles.resumoValue}>{clienteSelecionado.nome}</Text>
                                </View>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Serviço</Text>
                                    <Text style={styles.resumoValue}>{servicoSelecionado.nome}</Text>
                                </View>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Duração</Text>
                                    <Text style={styles.resumoValue}>{servicoSelecionado.duracao}</Text>
                                </View>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Valor</Text>
                                    <Text style={[styles.resumoValue, { color: '#059669', fontWeight: '800' }]}>
                                        {servicoSelecionado.preco}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={fecharModal} style={[styles.button, styles.buttonCancel]}>
                            <Text style={styles.buttonTextCancel}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirmar}
                            disabled={!clienteSelecionado || !servicoSelecionado}
                            style={[
                                styles.button,
                                styles.buttonConfirm,
                                (!clienteSelecionado || !servicoSelecionado) && styles.buttonDisabled,
                            ]}
                        >
                            <Feather name="check" size={18} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.buttonText}>{getBotaoTexto()}</Text>
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
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 20,
    },

    /* Header */
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
        fontSize: 20,
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

    /* ScrollView */
    scrollView: {
        maxHeight: 500,
    },

    /* Fixed Info Banner */
    fixedInfoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#ecfdf5',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    fixedInfoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
    },

    /* Section */
    section: {
        padding: 20,
        paddingBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
    },

    /* Empty State */
    emptyState: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 8,
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 14,
    },

    /* Dropdown */
    dropdown: {
        backgroundColor: '#f9fafb',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    dropdownSelected: {
        backgroundColor: '#ecfdf5',
        borderColor: '#10b981',
    },
    dropdownPlaceholder: {
        fontSize: 15,
        color: '#9ca3af',
    },
    dropdownSelectedText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#059669',
    },
    dropdownSearch: {
        height: 44,
        fontSize: 15,
        borderRadius: 10,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
    },
    dropdownContainer: {
        borderRadius: 14,
        borderColor: '#e5e7eb',
        marginTop: 4,
        overflow: 'hidden',
    },
    dropdownItemContainer: {
        borderBottomWidth: 0,
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#374151',
    },
    dropdownLeftIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    dropdownLeftIconSelected: {
        backgroundColor: '#059669',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    dropdownItemSelected: {
        backgroundColor: '#ecfdf5',
    },

    /* Avatar */
    itemAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemAvatarSelected: {
        backgroundColor: '#059669',
    },
    itemAvatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6b7280',
    },
    itemAvatarTextSelected: {
        color: '#fff',
    },

    /* Info */
    itemInfo: {
        flex: 1,
    },
    itemNome: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    itemNomeSelected: {
        color: '#059669',
    },
    itemDetalhe: {
        fontSize: 13,
        color: '#9ca3af',
        marginTop: 2,
    },

    /* Servico */
    servicoIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    servicoDetalhes: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    servicoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    servicoTagText: {
        fontSize: 12,
        color: '#6b7280',
    },
    servicoTagSlots: {
        backgroundColor: '#fef3c7',
    },
    servicoTagSlotsText: {
        fontSize: 12,
        color: '#92400e',
        fontWeight: '600',
    },

    /* Resumo */
    resumo: {
        marginHorizontal: 20,
        marginBottom: 12,
        backgroundColor: '#f0fdf4',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    resumoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#166534',
        marginBottom: 10,
    },
    resumoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    resumoLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    resumoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },

    /* Buttons */
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonCancel: {
        backgroundColor: '#f3f4f6',
    },
    buttonConfirm: {
        backgroundColor: '#10b981',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#d1d5db',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextCancel: {
        color: '#6b7280',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ModalAgendamento;
