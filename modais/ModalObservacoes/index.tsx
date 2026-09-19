import { Cores, Fontes, Raio, Sombra } from '@/constants/design';
import { useModalAviso } from '@/hooks/useModalAviso';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createObservation, deleteObservation, requestObservations, updateObservation } from '@/redux/actions/actionsObservacoes';
import { Observacao, TipoObservacao } from '@/types/typesObservacao';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    visible: boolean;
    cliente: { id: number; name: string; lastName?: string } | null;
    onFechar: () => void;
};

// "Preferência" é informação sobre o cliente, não um sucesso — por isso cobre
// (a marca) e não verde. Cancelamento continua no vermelho de estado.
const TIPOS: { value: TipoObservacao; label: string; cor: string; bg: string; borda: string }[] = [
    { value: 'PREFERENCIA', label: 'Preferência', cor: Cores.brandDeep, bg: Cores.brandSoft, borda: Cores.brandBorder },
    { value: 'CANCELAMENTO', label: 'Cancelamento', cor: Cores.danger, bg: Cores.dangerSoft, borda: Cores.dangerBorder },
    { value: 'OUTRO', label: 'Outro', cor: Cores.inkMuted, bg: Cores.surfaceAlt, borda: Cores.line },
];

const getTipoInfo = (tipo: TipoObservacao) => TIPOS.find((t) => t.value === tipo) || TIPOS[2];

const formatarData = (data: string) => {
    try {
        return new Date(data).toLocaleDateString();
    } catch {
        return '';
    }
};

const ModalObservacoes = ({ visible, cliente, onFechar }: Props) => {
    const dispatch = useAppDispatch();
    const modalAviso = useModalAviso();
    const observacoes = useAppSelector((state) => state.observacoes.observations) as Observacao[];

    const [conteudo, setConteudo] = useState('');
    const [tipoSelecionado, setTipoSelecionado] = useState<TipoObservacao>('OUTRO');
    const [editandoId, setEditandoId] = useState<number | null>(null);

    useEffect(() => {
        if (visible && cliente?.id) {
            dispatch(requestObservations(cliente.id));
        }
        if (!visible) {
            limparFormulario();
        }
    }, [visible, cliente?.id]);

    const limparFormulario = () => {
        setConteudo('');
        setTipoSelecionado('OUTRO');
        setEditandoId(null);
    };

    const handleFechar = () => {
        limparFormulario();
        onFechar();
    };

    const handleSalvar = () => {
        if (!cliente?.id || !conteudo.trim()) return;

        if (editandoId) {
            dispatch(updateObservation({
                id: editandoId,
                clientId: cliente.id,
                content: conteudo.trim(),
                type: tipoSelecionado,
            }));
        } else {
            dispatch(createObservation({
                clientId: cliente.id,
                content: conteudo.trim(),
                type: tipoSelecionado,
            }));
        }
        limparFormulario();
    };

    const handleEditar = (observacao: Observacao) => {
        setEditandoId(observacao.id);
        setConteudo(observacao.content);
        setTipoSelecionado(observacao.type);
    };

    const handleExcluir = (observacao: Observacao) => {
        if (!cliente?.id) return;
        modalAviso.mostrarConfirmacao('Deseja realmente excluir esta observação?', {
            tipo: 'erro',
            textoBotaoConfirmar: 'Excluir',
            textoBotaoCancelar: 'Cancelar',
            onConfirmar: () => {
                dispatch(deleteObservation({ id: observacao.id, clientId: cliente.id }));
                if (editandoId === observacao.id) limparFormulario();
            },
        });
    };

    if (!cliente) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleFechar}
        >
            {/* Mesmo arranjo do ModalFormulario: o KeyboardAvoidingView encolhe
                a área e a folha reancora acima do teclado. Aqui é crítico — o
                campo de texto fica no rodapé da folha. */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.avoider}
            >
                <View style={styles.overlay}>
                    <Pressable style={styles.backdrop} onPress={handleFechar} />

                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.grabber} />
                            <View style={styles.headerRow}>
                                <View style={styles.headerLeft}>
                                    <View style={styles.headerIcon}>
                                        <Feather name="file-text" size={17} color={Cores.brandDeep} />
                                    </View>
                                    <View style={styles.headerTexts}>
                                        <Text style={styles.title}>OBSERVAÇÕES</Text>
                                        <Text style={styles.subtitle} numberOfLines={1}>
                                            {cliente.name} {cliente.lastName || ''}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={handleFechar} style={styles.closeButton}>
                                    <Feather name="x" size={20} color={Cores.inkMuted} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag"
                        >
                        <View style={styles.listSection}>
                            {observacoes.length === 0 ? (
                                <Text style={styles.vazio}>Nenhuma observação cadastrada.</Text>
                            ) : (
                                observacoes.map((observacao) => {
                                    const tipoInfo = getTipoInfo(observacao.type);
                                    return (
                                        <View key={observacao.id} style={styles.card}>
                                            <View style={styles.cardHeader}>
                                                <View style={[styles.badge, { backgroundColor: tipoInfo.bg, borderColor: tipoInfo.borda }]}>
                                                    <Text style={[styles.badgeText, { color: tipoInfo.cor }]}>{tipoInfo.label}</Text>
                                                </View>
                                                <Text style={styles.cardData}>{formatarData(observacao.createdAt)}</Text>
                                            </View>
                                            <Text style={styles.cardContent}>{observacao.content}</Text>
                                            <View style={styles.cardActions}>
                                                <TouchableOpacity onPress={() => handleEditar(observacao)} style={styles.cardActionButton}>
                                                    <Feather name="edit-2" size={15} color={Cores.inkMuted} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleExcluir(observacao)} style={styles.cardActionButton}>
                                                    <Feather name="trash-2" size={15} color={Cores.danger} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.formTitle}>
                                {editandoId ? 'EDITAR OBSERVAÇÃO' : 'NOVA OBSERVAÇÃO'}
                            </Text>

                            <View style={styles.tiposContainer}>
                                {TIPOS.map((tipo) => (
                                    <TouchableOpacity
                                        key={tipo.value}
                                        onPress={() => setTipoSelecionado(tipo.value)}
                                        style={[
                                            styles.tipoOption,
                                            tipoSelecionado === tipo.value && {
                                                backgroundColor: tipo.bg,
                                                borderColor: tipo.cor,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.tipoOptionText,
                                                tipoSelecionado === tipo.value && {
                                                    color: tipo.cor,
                                                    fontFamily: Fontes.semibold,
                                                },
                                            ]}
                                        >
                                            {tipo.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite a observação..."
                                    placeholderTextColor={Cores.inkSubtle}
                                    value={conteudo}
                                    onChangeText={setConteudo}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <View style={styles.formButtons}>
                                {editandoId !== null && (
                                    <TouchableOpacity onPress={limparFormulario} style={[styles.button, styles.buttonCancel]}>
                                        <Text style={styles.buttonTextCancel}>Cancelar</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={handleSalvar}
                                    style={[styles.button, styles.buttonConfirm, !conteudo.trim() && styles.buttonDisabled]}
                                    disabled={!conteudo.trim()}
                                >
                                    <Text style={styles.buttonText}>{editandoId !== null ? 'Salvar' : 'Adicionar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    avoider: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(26, 26, 24, 0.55)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        backgroundColor: Cores.surface,
        borderTopLeftRadius: Raio.sheet,
        borderTopRightRadius: Raio.sheet,
        maxHeight: '90%',
        ...Sombra.nivel3,
    },
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
    headerIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Cores.brandSoft,
        borderWidth: 1,
        borderColor: Cores.brandBorder,
        alignItems: 'center',
        justifyContent: 'center',
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
    subtitle: {
        fontFamily: Fontes.regular,
        fontSize: 13,
        color: Cores.inkMuted,
        marginTop: 1,
    },
    closeButton: {
        padding: 4,
    },
    // flexShrink em vez de teto fixo: com o teclado aberto a folha cede altura
    // aqui em vez de estourar por cima e cortar o cabeçalho.
    scrollView: {
        flexShrink: 1,
    },

    /* Lista de observações */
    listSection: {
        padding: 20,
        gap: 10,
    },
    vazio: {
        fontFamily: Fontes.regular,
        fontSize: 13.5,
        color: Cores.inkSubtle,
        textAlign: 'center',
        paddingVertical: 12,
    },
    card: {
        padding: 14,
        borderRadius: Raio.card,
        backgroundColor: Cores.canvas,
        borderWidth: 1,
        borderColor: Cores.line,
        gap: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
    },
    badgeText: {
        fontFamily: Fontes.semibold,
        fontSize: 11.5,
    },
    cardData: {
        fontFamily: Fontes.regular,
        fontSize: 11.5,
        color: Cores.inkSubtle,
    },
    cardContent: {
        fontFamily: Fontes.regular,
        fontSize: 13.5,
        color: Cores.ink,
        lineHeight: 20,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 14,
    },
    cardActionButton: {
        padding: 4,
    },

    /* Formulário */
    formSection: {
        padding: 20,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: Cores.line,
        marginTop: 8,
        gap: 12,
    },
    formTitle: {
        fontFamily: Fontes.display,
        fontSize: 10.5,
        color: Cores.inkSubtle,
        letterSpacing: 2,
        marginTop: 18,
    },
    tiposContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    tipoOption: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: Raio.chip,
        borderWidth: 1,
        borderColor: Cores.line,
        backgroundColor: Cores.surface,
        alignItems: 'center',
    },
    tipoOptionText: {
        fontFamily: Fontes.medium,
        fontSize: 12.5,
        color: Cores.inkMuted,
    },
    inputWrapper: {
        backgroundColor: Cores.canvas,
        borderRadius: Raio.control,
        borderWidth: 1,
        borderColor: Cores.line,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    input: {
        fontFamily: Fontes.regular,
        fontSize: 15,
        color: Cores.ink,
        minHeight: 92,
        textAlignVertical: 'top',
    },
    formButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: Raio.control,
        alignItems: 'center',
        justifyContent: 'center',
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

export default ModalObservacoes;
