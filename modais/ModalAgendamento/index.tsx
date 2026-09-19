import { Cores, Fontes, Raio, Sombra } from '@/constants/design';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setModalAgendamento } from '@/redux/actions/actionsModais';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type OnConfirmarParams = {
    cliente: any;
    /** 1..N serviços. A duração do atendimento é a soma das durações. */
    servicos: any[];
    horario: string;
    modo: 'novo' | 'trocar_cliente' | 'trocar_servico';
};

const parseDuracao = (duracao: string): number => {
    const match = /(\d+)/.exec(String(duracao ?? ''));
    return match ? parseInt(match[1], 10) : 30;
};

const parsePreco = (preco: any): number => {
    if (typeof preco === 'number') return preco;
    // "R$ 40,00" -> 40
    const limpo = String(preco ?? '').replace(/[^\d,.-]/g, '').replace(',', '.');
    const n = Number(limpo);
    return Number.isFinite(n) ? n : 0;
};

const emReais = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

const ModalAgendamento = ({ onConfirmar }: { onConfirmar: (params: OnConfirmarParams) => void }) => {
    const dispatch = useAppDispatch();
    const modalAgendamento = useAppSelector((state) => state.modais.modal_agendamento);
    const clientes = useAppSelector((state) => state.clientes.clients);
    const servicos = useAppSelector((state) => state.servicos.servicos);

    const modo = modalAgendamento.modo || 'novo';
    const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
    const [servicosSelecionados, setServicosSelecionados] = useState<any[]>([]);

    useEffect(() => {
        if (modalAgendamento.statusAtivo) {
            if (modo === 'trocar_servico' && modalAgendamento.clienteAtual) {
                setClienteSelecionado(modalAgendamento.clienteAtual);
                setServicosSelecionados([]);
            } else if (modo === 'trocar_cliente' && modalAgendamento.servicoAtual) {
                // servicoAtual pode vir como resumo (1 objeto) do agendamento existente.
                setServicosSelecionados(
                    Array.isArray(modalAgendamento.servicoAtual)
                        ? modalAgendamento.servicoAtual
                        : [modalAgendamento.servicoAtual],
                );
                setClienteSelecionado(null);
            } else {
                setClienteSelecionado(null);
                setServicosSelecionados([]);
            }
        }
    }, [modalAgendamento.statusAtivo]);

    const fecharModal = () => {
        setClienteSelecionado(null);
        setServicosSelecionados([]);
        dispatch(setModalAgendamento({
            statusAtivo: false,
            horario: '',
            data: '',
            modo: 'novo',
        }));
    };

    const alternarServico = (servico: any) => {
        setServicosSelecionados((atuais) =>
            atuais.some((s) => s.id === servico.id)
                ? atuais.filter((s) => s.id !== servico.id)
                : [...atuais, servico],
        );
    };

    // Totais recalculados a cada marcação: o barbeiro precisa ver o impacto
    // ANTES de confirmar, porque a soma pode estourar o expediente ou o almoço.
    const duracaoTotal = servicosSelecionados.reduce(
        (total, s) => total + parseDuracao(s.duracao),
        0,
    );
    const valorTotal = servicosSelecionados.reduce(
        (total, s) => total + parsePreco(s.preco),
        0,
    );
    const slotsOcupados = Math.ceil(duracaoTotal / 30);

    const handleConfirmar = () => {
        if (!clienteSelecionado || servicosSelecionados.length === 0) return;
        onConfirmar({
            cliente: clienteSelecionado,
            servicos: servicosSelecionados,
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
                        <View style={styles.grabber} />
                        <View style={styles.headerRow}>
                            <View style={styles.headerLeft}>
                                {modalAgendamento.horario ? (
                                    <View style={styles.horarioBadge}>
                                        <Text style={styles.horarioText}>{modalAgendamento.horario}</Text>
                                    </View>
                                ) : null}
                                <Text style={styles.title}>{getTitulo().toUpperCase()}</Text>
                            </View>
                            <TouchableOpacity onPress={fecharModal} style={styles.closeButton}>
                                <Feather name="x" size={20} color={Cores.inkMuted} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                        {modo === 'trocar_cliente' && servicosSelecionados.length > 0 && (
                            <View style={styles.fixedInfoBanner}>
                                <Feather name="scissors" size={13} color={Cores.brandDeep} />
                                <Text style={styles.fixedInfoText}>
                                    {servicosSelecionados.map((s) => s.nome).join(' + ')} — {emReais(valorTotal)}
                                </Text>
                            </View>
                        )}


                        {modo === 'trocar_servico' && clienteSelecionado && (
                            <View style={styles.fixedInfoBanner}>
                                <Feather name="user" size={13} color={Cores.brandDeep} />
                                <Text style={styles.fixedInfoText}>
                                    Cliente: {clienteSelecionado.nome}
                                </Text>
                            </View>
                        )}

                        {/* Selecionar Cliente */}
                        {mostrarClientes && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>SELECIONE O CLIENTE</Text>
                                </View>

                                {clientes.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <Feather name="users" size={26} color={Cores.inkSubtle} />
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
                                        activeColor={Cores.brandSoft}
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
                                                    size={15}
                                                    color={clienteSelecionado ? Cores.inkInverse : Cores.inkSubtle}
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
                                                    <Feather name="check-circle" size={18} color={Cores.brandDeep} />
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
                                    <Text style={styles.sectionTitle}>
                                        SERVIÇOS {servicosSelecionados.length > 0 ? `(${servicosSelecionados.length})` : ''}
                                    </Text>
                                </View>

                                {servicos.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <Feather name="scissors" size={26} color={Cores.inkSubtle} />
                                        <Text style={styles.emptyText}>Nenhum serviço cadastrado</Text>
                                    </View>
                                ) : (
                                    <View style={styles.listaServicos}>
                                        {servicos.map((s: any) => {
                                            const marcado = servicosSelecionados.some((x) => x.id === s.id);
                                            return (
                                                <TouchableOpacity
                                                    key={s.id}
                                                    onPress={() => alternarServico(s)}
                                                    activeOpacity={0.7}
                                                    style={[
                                                        styles.servicoLinha,
                                                        marcado && styles.servicoLinhaMarcada,
                                                    ]}
                                                >
                                                    <View style={[styles.caixaMarcacao, marcado && styles.caixaMarcada]}>
                                                        {marcado && (
                                                            <Feather name="check" size={13} color={Cores.inkInverse} />
                                                        )}
                                                    </View>
                                                    <View style={styles.itemInfo}>
                                                        <Text style={[styles.itemNome, marcado && styles.itemNomeSelected]}>
                                                            {s.nome}
                                                        </Text>
                                                        <View style={styles.servicoDetalhes}>
                                                            <View style={styles.servicoTag}>
                                                                <Feather name="clock" size={11} color={Cores.inkMuted} />
                                                                <Text style={styles.servicoTagText}>{s.duracao}</Text>
                                                            </View>
                                                            <View style={styles.servicoTag}>
                                                                <Text style={styles.servicoTagPreco}>{s.preco}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                )}

                                {/* Total sempre visível enquanto ele marca: a soma decide
                                    quantos slots ocupa e pode estourar o expediente. */}
                                {servicosSelecionados.length > 0 && (
                                    <View style={styles.totalBarra}>
                                        <View style={styles.totalItem}>
                                            <Text style={styles.totalRotulo}>DURAÇÃO</Text>
                                            <Text style={styles.totalValor}>{duracaoTotal} min</Text>
                                        </View>
                                        <View style={styles.totalDivisor} />
                                        <View style={styles.totalItem}>
                                            <Text style={styles.totalRotulo}>SLOTS</Text>
                                            <Text style={styles.totalValor}>{slotsOcupados}</Text>
                                        </View>
                                        <View style={styles.totalDivisor} />
                                        <View style={styles.totalItem}>
                                            <Text style={styles.totalRotulo}>TOTAL</Text>
                                            <Text style={[styles.totalValor, styles.totalValorForte]}>
                                                {emReais(valorTotal)}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {clienteSelecionado && servicosSelecionados.length > 0 && (
                            <View style={styles.resumo}>
                                <Text style={styles.resumoTitle}>RESUMO</Text>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Horário</Text>
                                    <Text style={styles.resumoValue}>{modalAgendamento.horario}</Text>
                                </View>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Cliente</Text>
                                    <Text style={styles.resumoValue}>{clienteSelecionado.nome}</Text>
                                </View>
                                {servicosSelecionados.map((s) => (
                                    <View key={s.id} style={styles.resumoRow}>
                                        <Text style={styles.resumoLabel}>{s.nome}</Text>
                                        <Text style={styles.resumoValue}>{s.duracao} · {s.preco}</Text>
                                    </View>
                                ))}
                                <View style={styles.resumoSeparador} />
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Duração total</Text>
                                    <Text style={styles.resumoValue}>{duracaoTotal} min</Text>
                                </View>
                                <View style={styles.resumoRow}>
                                    <Text style={styles.resumoLabel}>Valor total</Text>
                                    <Text style={[styles.resumoValue, styles.resumoValorForte]}>
                                        {emReais(valorTotal)}
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
                            disabled={!clienteSelecionado || servicosSelecionados.length === 0}
                            style={[
                                styles.button,
                                styles.buttonConfirm,
                                (!clienteSelecionado || servicosSelecionados.length === 0) && styles.buttonDisabled,
                            ]}
                        >
                            <Feather name="check" size={17} color={Cores.inkInverse} style={{ marginRight: 6 }} />
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
    title: {
        fontFamily: Fontes.display,
        fontSize: 17,
        letterSpacing: 1.4,
        color: Cores.ink,
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },

    /* ScrollView */
    scrollView: {
        maxHeight: 500,
    },

    /* Faixa de contexto fixo */
    fixedInfoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: Cores.brandSoft,
        borderRadius: Raio.chip,
        borderWidth: 1,
        borderColor: Cores.brandBorder,
    },
    fixedInfoText: {
        fontFamily: Fontes.medium,
        fontSize: 13,
        color: Cores.brandDeep,
        flex: 1,
    },

    /* Seção */
    section: {
        padding: 20,
        paddingBottom: 8,
    },
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: Fontes.display,
        fontSize: 10.5,
        letterSpacing: 2,
        color: Cores.inkSubtle,
    },

    /* Estado vazio */
    emptyState: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 8,
    },
    emptyText: {
        fontFamily: Fontes.regular,
        color: Cores.inkSubtle,
        fontSize: 13.5,
    },

    /* Dropdown */
    dropdown: {
        backgroundColor: Cores.canvas,
        borderRadius: Raio.control,
        borderWidth: 1,
        borderColor: Cores.line,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    dropdownSelected: {
        backgroundColor: Cores.brandSoft,
        borderColor: Cores.brand,
    },
    dropdownPlaceholder: {
        fontFamily: Fontes.regular,
        fontSize: 14.5,
        color: Cores.inkSubtle,
    },
    dropdownSelectedText: {
        fontFamily: Fontes.semibold,
        fontSize: 14.5,
        color: Cores.brandDeep,
    },
    dropdownSearch: {
        height: 42,
        fontFamily: Fontes.regular,
        fontSize: 14.5,
        borderRadius: Raio.chip,
        borderColor: Cores.line,
        color: Cores.ink,
        paddingHorizontal: 12,
    },
    dropdownContainer: {
        borderRadius: Raio.card,
        borderColor: Cores.line,
        backgroundColor: Cores.surface,
        marginTop: 4,
        overflow: 'hidden',
    },
    dropdownItemContainer: {
        borderBottomWidth: 0,
    },
    dropdownItemText: {
        fontFamily: Fontes.regular,
        fontSize: 14.5,
        color: Cores.ink,
    },
    dropdownLeftIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Cores.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    dropdownLeftIconSelected: {
        backgroundColor: Cores.brand,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 11,
    },
    dropdownItemSelected: {
        backgroundColor: Cores.brandSoft,
    },

    /* Avatar */
    itemAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Cores.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemAvatarSelected: {
        backgroundColor: Cores.brand,
    },
    itemAvatarText: {
        fontFamily: Fontes.display,
        fontSize: 16,
        color: Cores.inkMuted,
    },
    itemAvatarTextSelected: {
        color: Cores.inkInverse,
    },

    /* Info */
    itemInfo: {
        flex: 1,
    },
    itemNome: {
        fontFamily: Fontes.semibold,
        fontSize: 14.5,
        color: Cores.ink,
    },
    itemNomeSelected: {
        color: Cores.brandDeep,
    },
    itemDetalhe: {
        fontFamily: Fontes.regular,
        fontSize: 12.5,
        color: Cores.inkSubtle,
        marginTop: 2,
    },

    /* Lista de serviços com marcação */
    listaServicos: {
        gap: 8,
    },
    servicoLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: Raio.card,
        backgroundColor: Cores.surface,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    servicoLinhaMarcada: {
        backgroundColor: Cores.brandSoft,
        borderColor: Cores.brand,
    },
    caixaMarcacao: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: Cores.lineStrong,
        alignItems: 'center',
        justifyContent: 'center',
    },
    caixaMarcada: {
        backgroundColor: Cores.brand,
        borderColor: Cores.brand,
    },

    /* Barra de totais */
    totalBarra: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: Raio.card,
        backgroundColor: Cores.canvas,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    totalItem: {
        flex: 1,
        alignItems: 'center',
    },
    totalDivisor: {
        width: 1,
        alignSelf: 'stretch',
        backgroundColor: Cores.line,
    },
    totalRotulo: {
        fontFamily: Fontes.display,
        fontSize: 9.5,
        letterSpacing: 1.5,
        color: Cores.inkSubtle,
    },
    totalValor: {
        fontFamily: Fontes.semibold,
        fontSize: 15,
        color: Cores.ink,
        marginTop: 2,
    },
    totalValorForte: {
        color: Cores.brandDeep,
    },
    resumoSeparador: {
        height: 1,
        backgroundColor: Cores.line,
        marginVertical: 6,
    },

    /* Serviço */
    servicoIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: Raio.control,
        backgroundColor: Cores.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    servicoDetalhes: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 4,
    },
    servicoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Cores.surfaceAlt,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    servicoTagText: {
        fontFamily: Fontes.regular,
        fontSize: 11.5,
        color: Cores.inkMuted,
    },
    servicoTagPreco: {
        fontFamily: Fontes.display,
        fontSize: 12.5,
        color: Cores.ink,
    },
    /* Aviso de que o serviço ocupa mais de um slot — atenção, não marca. */
    servicoTagSlots: {
        backgroundColor: Cores.warningSoft,
        borderWidth: 1,
        borderColor: Cores.warningBorder,
    },
    servicoTagSlotsText: {
        fontFamily: Fontes.medium,
        fontSize: 11.5,
        color: Cores.warning,
    },

    /* Resumo */
    resumo: {
        marginHorizontal: 20,
        marginBottom: 12,
        backgroundColor: Cores.canvas,
        borderRadius: Raio.card,
        padding: 16,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    resumoTitle: {
        fontFamily: Fontes.display,
        fontSize: 10.5,
        letterSpacing: 2,
        color: Cores.inkSubtle,
        marginBottom: 10,
    },
    resumoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    resumoLabel: {
        fontFamily: Fontes.regular,
        fontSize: 13.5,
        color: Cores.inkMuted,
    },
    resumoValue: {
        fontFamily: Fontes.semibold,
        fontSize: 13.5,
        color: Cores.ink,
    },
    resumoValorForte: {
        fontFamily: Fontes.display,
        fontSize: 16,
        color: Cores.ink,
    },

    /* Botões */
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: Cores.line,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: Raio.control,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonCancel: {
        backgroundColor: Cores.surface,
        borderWidth: 1,
        borderColor: Cores.line,
    },
    buttonConfirm: {
        backgroundColor: Cores.brand,
        ...Sombra.nivel2,
    },
    buttonDisabled: {
        backgroundColor: Cores.lineStrong,
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        fontFamily: Fontes.semibold,
        color: Cores.inkInverse,
        fontSize: 15,
    },
    buttonTextCancel: {
        fontFamily: Fontes.semibold,
        color: Cores.inkMuted,
        fontSize: 15,
    },
});

export default ModalAgendamento;
