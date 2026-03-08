import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { realizarLogin } from '@/redux/actions/actionsUsuario';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Unit = {
    id: number;
    companyId: number;
    name: string;
    address: string;
    phone: string;
};

type Company = {
    id: number;
    tradeName: string;
    legalName: string;
    cnpj: string;
    plan: string;
    active: boolean;
    units: Unit[];
};

export default function SelecaoEmpresaScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const empresas: Company[] = useAppSelector((state) => state.empresa.empresas);
    const credenciais = useAppSelector((state) => state.empresa.credenciaisTemp);

    const [empresaSelecionada, setEmpresaSelecionada] = useState<Company | null>(null);

    const handleSelecionarEmpresa = (empresa: Company) => {
        if (empresa.units.length === 1) {
            // Única unidade → login direto
            dispatch(realizarLogin({
                name: credenciais!.name,
                password: credenciais!.password,
                companyId: empresa.id,
                unitId: empresa.units[0].id,
            }));
        } else {
            // Múltiplas unidades → mostrar step 2
            setEmpresaSelecionada(empresa);
        }
    };

    const handleSelecionarUnidade = (unit: Unit) => {
        dispatch(realizarLogin({
            name: credenciais!.name,
            password: credenciais!.password,
            companyId: empresaSelecionada!.id,
            unitId: unit.id,
        }));
    };

    const handleVoltar = () => {
        setEmpresaSelecionada(null);
    };

    const renderPlanBadge = (plan: string) => {
        const isPremium = plan === 'premium';
        return (
            <View className={`px-2.5 py-1 rounded-full ${isPremium ? 'bg-amber-100' : 'bg-gray-100'}`}>
                <Text className={`text-xs font-semibold ${isPremium ? 'text-amber-700' : 'text-gray-500'}`}>
                    {plan.toUpperCase()}
                </Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>

            {/* Header */}
            <LinearGradient colors={['#10b981', '#059669']} className="px-6 pb-6 pt-4">
                <View className="flex-row items-center gap-3 mb-1">
                    {empresaSelecionada && (
                        <TouchableOpacity
                            onPress={handleVoltar}
                            className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
                        >
                            <Feather name="arrow-left" size={18} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <View className="flex-1">
                        <Text className="text-white text-2xl font-bold">
                            {empresaSelecionada ? 'Selecione a Unidade' : 'Selecione a Empresa'}
                        </Text>
                        <Text className="text-green-100 text-sm mt-0.5">
                            {empresaSelecionada
                                ? empresaSelecionada.tradeName
                                : `${empresas.length} empresa${empresas.length !== 1 ? 's' : ''} disponível${empresas.length !== 1 ? 'is' : ''}`
                            }
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, gap: 12 }}
                showsVerticalScrollIndicator={false}
            >
                {/* STEP 1 — Seleção de empresa */}
                {!empresaSelecionada && empresas.map((empresa) => (
                    <TouchableOpacity
                        key={empresa.id}
                        onPress={() => handleSelecionarEmpresa(empresa)}
                        activeOpacity={0.7}
                        className="bg-white rounded-2xl overflow-hidden"
                        style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
                    >
                        {/* Faixa de status */}
                        <View className={`h-1 w-full ${empresa.active ? 'bg-green-500' : 'bg-gray-300'}`} />

                        <View className="p-4">
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1 mr-3">
                                    <Text className="text-gray-900 text-lg font-bold leading-tight">
                                        {empresa.tradeName}
                                    </Text>
                                    <Text className="text-gray-500 text-xs mt-0.5">
                                        {empresa.legalName}
                                    </Text>
                                </View>
                                {renderPlanBadge(empresa.plan)}
                            </View>

                            {/* CNPJ */}
                            <View className="flex-row items-center gap-2 mb-3">
                                <View className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center">
                                    <Feather name="file-text" size={13} color="#6b7280" />
                                </View>
                                <Text className="text-gray-500 text-sm">{empresa.cnpj}</Text>
                            </View>

                            {/* Rodapé: unidades + seta */}
                            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                                <View className="flex-row items-center gap-1.5">
                                    <Feather name="map-pin" size={14} color="#10b981" />
                                    <Text className="text-green-700 text-sm font-medium">
                                        {empresa.units.length} unidade{empresa.units.length !== 1 ? 's' : ''}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-green-600 text-sm font-semibold">
                                        {empresa.units.length === 1 ? 'Entrar' : 'Ver unidades'}
                                    </Text>
                                    <Feather name="chevron-right" size={16} color="#10b981" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* STEP 2 — Seleção de unidade */}
                {empresaSelecionada && empresaSelecionada.units.map((unit) => (
                    <TouchableOpacity
                        key={unit.id}
                        onPress={() => handleSelecionarUnidade(unit)}
                        activeOpacity={0.7}
                        className="bg-white rounded-2xl overflow-hidden"
                        style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
                    >
                        <View className="h-1 w-full bg-green-500" />

                        <View className="p-4">
                            <View className="flex-row items-center gap-3 mb-3">
                                <View className="w-11 h-11 rounded-xl bg-green-50 items-center justify-center">
                                    <Feather name="map-pin" size={20} color="#10b981" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 text-base font-bold">{unit.name}</Text>
                                </View>
                                <Feather name="chevron-right" size={18} color="#10b981" />
                            </View>

                            <View className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <Feather name="navigation" size={13} color="#9ca3af" />
                                    <Text className="text-gray-500 text-sm flex-1">{unit.address}</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Feather name="phone" size={13} color="#9ca3af" />
                                    <Text className="text-gray-500 text-sm">{unit.phone}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>


        </View>
    );
}
