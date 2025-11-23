import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setModalFormulario } from '@/redux/actions/actionsModais';
import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';

export type CampoFormulario = {
    nome: string;
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

        modalFormulario.campos.forEach(campo => {
            if (campo.obrigatorio && !valores[campo.nome]?.trim()) {
                novosErros[campo.nome] = `${campo.label} é obrigatório`;
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
            <Pressable
                style={styles.overlay}
                onPress={handleCancelar}
            >
                <Pressable
                    style={styles.container}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{modalFormulario.titulo}</Text>
                        <TouchableOpacity onPress={handleCancelar} style={styles.closeButton}>
                            <Feather name="x" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Formulário */}
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.form}>
                            {modalFormulario.campos.map((campo: CampoFormulario, index: number) => (
                                <View key={campo.nome} style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        {campo.label}
                                        {campo.obrigatorio && <Text style={styles.required}> *</Text>}
                                    </Text>

                                    <View style={[
                                        styles.inputWrapper,
                                        erros[campo.nome] && styles.inputError,
                                        campo.multiline && { height: 'auto', alignItems: 'flex-start', paddingVertical: 12 }
                                    ]}>
                                        {campo.icone && (
                                            <Feather
                                                name={campo.icone}
                                                size={20}
                                                color={erros[campo.nome] ? '#ef4444' : '#6b7280'}
                                                style={styles.inputIcon}
                                            />
                                        )}
                                        <MaskInput
                                            style={[
                                                styles.input,
                                                campo.multiline && { height: (campo.linhas || 4) * 24, textAlignVertical: 'top' }
                                            ]}
                                            placeholder={campo.placeholder}
                                            placeholderTextColor="#9ca3af"
                                            value={valores[campo.nome] || ''}
                                            onChangeText={(masked: string, unmasked: string) => {
                                                // Para currency, salvamos o valor sem máscara
                                                const valorSalvar = campo.tipo === 'currency' ? unmasked : masked;
                                                handleChangeValor(campo.nome, valorSalvar);
                                            }}
                                            mask={campo.mascara || getMascaraPadrao(campo.tipo)}
                                            keyboardType={getTipoTeclado(campo.tipo)}
                                            multiline={campo.multiline}
                                        />
                                    </View>

                                    {erros[campo.nome] && (
                                        <Text style={styles.errorText}>{erros[campo.nome]}</Text>
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
        shadowOffset: {
            width: 0,
            height: -4,
        },
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        maxHeight: 500,
    },
    form: {
        padding: 20,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        paddingHorizontal: 16,
        minHeight: 56,
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
    },
    errorText: {
        fontSize: 14,
        color: '#ef4444',
        marginTop: 4,
        marginLeft: 4,
    },
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
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCancel: {
        backgroundColor: '#f3f4f6',
    },
    buttonConfirm: {
        backgroundColor: '#10b981',
        shadowColor: '#10b981',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
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

export default ModalFormulario;
