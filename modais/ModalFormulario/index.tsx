import { Cores, Fontes, Raio, Sombra } from '@/constants/design';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setModalFormulario } from '@/redux/actions/actionsModais';
import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';

export type CampoFormulario = {
    name: string;
    label: string;
    placeholder: string;
    tipo?: 'text' | 'number' | 'phone' | 'email' | 'currency';
    icone?: keyof typeof Feather.glyphMap;
    obrigatorio?: boolean;
    multiline?: boolean;
    linhas?: number;
    mascara?: Mask;
};

const ModalFormulario = () => {
    const dispatch = useAppDispatch();
    const modalFormulario = useAppSelector((state) => state.modais.modal_formulario);
    const [valores, setValores] = useState<Record<string, string>>({});
    const [erros, setErros] = useState<Record<string, string>>({});

    const fecharModal = () => {
        setValores({});
        setErros({});
        dispatch(setModalFormulario({
            statusAtivo: false,
            titulo: '',
            campos: [],
            textoBotaoConfirmar: '',
            textoBotaoCancelar: '',
        }));
    };

    const validarCampos = () => {
        const novosErros: Record<string, string> = {};

        modalFormulario.campos.forEach((campo: CampoFormulario) => {
            if (campo.obrigatorio && !valores[campo.name]?.trim()) {
                novosErros[campo.name] = `${campo.label} é obrigatório`;
            }
        });

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleConfirmar = () => {
        if (validarCampos()) {
            if (modalFormulario.onConfirmar) {
                modalFormulario.onConfirmar(valores);
            }
            fecharModal();
        }
    };

    const handleCancelar = () => {
        if (modalFormulario.onCancelar) {
            modalFormulario.onCancelar();
        }
        fecharModal();
    };

    const handleChangeValor = (nomeCampo: string, valor: string) => {
        setValores(prev => ({ ...prev, [nomeCampo]: valor }));
        // Limpa erro ao digitar
        if (erros[nomeCampo]) {
            setErros(prev => {
                const novosErros = { ...prev };
                delete novosErros[nomeCampo];
                return novosErros;
            });
        }
    };

    const getTipoTeclado = (tipo?: string) => {
        switch (tipo) {
            case 'number':
            case 'currency':
                return 'numeric';
            case 'phone':
                return 'phone-pad';
            case 'email':
                return 'email-address';
            default:
                return 'default';
        }
    };

    const getMascaraPadrao = (tipo?: string): Mask | undefined => {
        switch (tipo) {
            case 'phone':
                return [
                    '(',
                    /\d/,
                    /\d/,
                    ')',
                    ' ',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    '-',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                ];
            case 'currency':
                return [
                    'R',
                    '$',
                    ' ',
                    /\d/,
                    /\d/,
                    /\d/,
                    '.',
                    /\d/,
                    /\d/,
                    /\d/,
                    ',',
                    /\d/,
                    /\d/,
                ];
            default:
                return undefined;
        }
    };

    return (
        <Modal
            visible={modalFormulario.statusAtivo}
            transparent
            animationType="slide"
            onRequestClose={handleCancelar}
        >
            {/* O KeyboardAvoidingView precisa ser o nó mais externo dentro do
                Modal: ele encolhe a área disponível, a folha reancora no fundo
                dessa área reduzida e sai de baixo do teclado. */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.avoider}
            >
                <View style={styles.overlay}>
                    {/* Fundo clicável separado da folha. Antes eram dois Pressable
                        aninhados com stopPropagation — o de fora cobria a folha
                        inteira e disputava os toques dos campos. */}
                    <Pressable style={styles.backdrop} onPress={handleCancelar} />

                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.grabber} />
                            <View style={styles.headerRow}>
                                <Text style={styles.title}>{modalFormulario.titulo?.toUpperCase()}</Text>
                                <TouchableOpacity onPress={handleCancelar} style={styles.closeButton}>
                                    <Feather name="x" size={20} color={Cores.inkMuted} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Formulário */}
                        <ScrollView
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            // Sem isto, com o teclado aberto o primeiro toque em
                            // "Salvar" só fecha o teclado — o usuário precisa
                            // tocar duas vezes.
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag"
                        >
                            <View style={styles.form}>
                                {modalFormulario.campos.map((campo: CampoFormulario, index: number) => (
                                    <View key={campo.name} style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            {campo.label}
                                            {campo.obrigatorio && <Text style={styles.required}> *</Text>}
                                        </Text>

                                        <View style={[
                                            styles.inputWrapper,
                                            erros[campo.name] && styles.inputError,
                                            campo.multiline && { height: 'auto', alignItems: 'flex-start', paddingVertical: 12 }
                                        ]}>
                                            {campo.icone && (
                                                <Feather
                                                    name={campo.icone}
                                                    size={18}
                                                    color={erros[campo.name] ? Cores.danger : Cores.inkSubtle}
                                                    style={styles.inputIcon}
                                                />
                                            )}
                                            <MaskInput
                                                style={[
                                                    styles.input,
                                                    campo.multiline && { height: (campo.linhas || 4) * 24, textAlignVertical: 'top' }
                                                ]}
                                                placeholder={campo.placeholder}
                                                placeholderTextColor={Cores.inkSubtle}
                                                value={valores[campo.name] || ''}
                                                onChangeText={(masked: string, unmasked: string) => {
                                                    // Para currency, salvamos o valor sem máscara
                                                    const valorSalvar = campo.tipo === 'currency' ? unmasked : masked;
                                                    handleChangeValor(campo.name, valorSalvar);
                                                }}
                                                mask={campo.mascara || getMascaraPadrao(campo.tipo)}
                                                keyboardType={getTipoTeclado(campo.tipo)}
                                                multiline={campo.multiline}
                                            />
                                        </View>

                                        {erros[campo.name] && (
                                            <Text style={styles.errorText}>{erros[campo.name]}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Botões */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={handleCancelar}
                                style={[styles.button, styles.buttonCancel]}
                            >
                                <Text style={styles.buttonTextCancel}>
                                    {modalFormulario.textoBotaoCancelar || 'Cancelar'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleConfirmar}
                                style={[styles.button, styles.buttonConfirm]}
                            >
                                <Text style={styles.buttonText}>
                                    {modalFormulario.textoBotaoConfirmar || 'Salvar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    /** Puxador: sinaliza folha arrastável e dá o respiro do topo. */
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
    title: {
        fontFamily: Fontes.display,
        fontSize: 19,
        letterSpacing: 1.4,
        color: Cores.ink,
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    // flexShrink no lugar de maxHeight fixo: com o teclado aberto a área útil
    // encolhe, e um teto de 500px faria a folha estourar por cima, cortando o
    // cabeçalho. Assim a lista de campos cede espaço e header/botões sempre cabem.
    scrollView: {
        flexShrink: 1,
    },
    form: {
        padding: 20,
    },
    fieldContainer: {
        marginBottom: 18,
    },
    label: {
        fontFamily: Fontes.medium,
        fontSize: 13,
        color: Cores.inkMuted,
        marginBottom: 7,
    },
    required: {
        color: Cores.danger,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Cores.canvas,
        borderRadius: Raio.control,
        borderWidth: 1,
        borderColor: Cores.line,
        paddingHorizontal: 14,
        minHeight: 52,
    },
    inputError: {
        borderColor: Cores.danger,
        backgroundColor: Cores.dangerSoft,
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
    errorText: {
        fontFamily: Fontes.regular,
        fontSize: 12.5,
        color: Cores.danger,
        marginTop: 5,
        marginLeft: 2,
    },
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

export default ModalFormulario;
