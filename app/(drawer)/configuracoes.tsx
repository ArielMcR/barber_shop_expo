import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import Feather from '@expo/vector-icons/Feather';
import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

const Secao = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
    <View>
        <Text className="font-display text-[11px] tracking-[2px] text-ink-muted mb-2.5 px-1">
            {titulo}
        </Text>
        <View className="bg-surface rounded-card overflow-hidden" style={Sombra.nivel1}>
            {children}
        </View>
    </View>
);

const Divisor = () => <View className="h-px bg-line" />;

const LinhaSwitch = ({
    icone,
    rotulo,
    valor,
    onChange,
}: {
    icone: keyof typeof Feather.glyphMap;
    rotulo: string;
    valor: boolean;
    onChange: (v: boolean) => void;
}) => (
    <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-3 flex-1">
            <Feather name={icone} size={18} color={Cores.inkMuted} />
            <Text className="font-sans text-[14.5px] text-ink flex-1">{rotulo}</Text>
        </View>
        <Switch
            value={valor}
            onValueChange={onChange}
            trackColor={{ false: Cores.surfaceSunken, true: Cores.brandBorder }}
            thumbColor={valor ? Cores.brand : Cores.surface}
            ios_backgroundColor={Cores.surfaceSunken}
        />
    </View>
);

const LinhaLink = ({
    icone,
    rotulo,
}: {
    icone?: keyof typeof Feather.glyphMap;
    rotulo: string;
}) => (
    <Pressable className="flex-row items-center justify-between px-4 py-3.5 active:bg-surface-alt">
        <View className="flex-row items-center gap-3 flex-1">
            {icone && <Feather name={icone} size={18} color={Cores.inkMuted} />}
            <Text className="font-sans text-[14.5px] text-ink flex-1">{rotulo}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={Cores.inkSubtle} />
    </Pressable>
);

export default function ConfiguracoesScreen() {
    const insets = useInsets();
    const [notificacoes, setNotificacoes] = useState(true);
    const [modoEscuro, setModoEscuro] = useState(false);
    const [lembretes, setLembretes] = useState(true);

    return (
        <ScreenWrapper className="flex-1 bg-canvas" topOffset={16}>
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 20 }}
            >
                <Secao titulo="PREFERÊNCIAS">
                    <LinhaSwitch
                        icone="bell"
                        rotulo="Notificações"
                        valor={notificacoes}
                        onChange={setNotificacoes}
                    />
                    <Divisor />
                    <LinhaSwitch
                        icone="moon"
                        rotulo="Modo Escuro"
                        valor={modoEscuro}
                        onChange={setModoEscuro}
                    />
                    <Divisor />
                    <LinhaSwitch
                        icone="clock"
                        rotulo="Lembretes de Agendamento"
                        valor={lembretes}
                        onChange={setLembretes}
                    />
                </Secao>

                <Secao titulo="NEGÓCIO">
                    <LinhaLink icone="briefcase" rotulo="Informações da Barbearia" />
                    <Divisor />
                    <LinhaLink icone="calendar" rotulo="Horário de Funcionamento" />
                    <Divisor />
                    <LinhaLink icone="dollar-sign" rotulo="Formas de Pagamento" />
                </Secao>

                <Secao titulo="SOBRE">
                    <View className="px-4 py-3.5">
                        <Text className="font-sans text-[12px] text-ink-muted">Versão do App</Text>
                        <Text className="font-semibold text-[14.5px] text-ink mt-0.5">1.0.0</Text>
                    </View>
                    <Divisor />
                    <LinhaLink rotulo="Termos de Uso" />
                </Secao>
            </ScrollView>
        </ScreenWrapper>
    );
}
