import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { deslogarUsuario } from '@/redux/actions/actionsUsuario';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, View } from 'react-native';

type ItemMenu = {
    icone: keyof typeof Feather.glyphMap;
    rotulo: string;
};

const ITENS_MENU: ItemMenu[] = [
    { icone: 'user', rotulo: 'Editar Perfil' },
    { icone: 'bell', rotulo: 'Notificações' },
    { icone: 'lock', rotulo: 'Segurança' },
    { icone: 'help-circle', rotulo: 'Ajuda & Suporte' },
];

export default function PerfilScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();
    const usuario = useAppSelector((state) => state.usuario.usuario);

    const iniciais = (usuario?.name || 'Ari Barbeiro')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte: string) => parte.charAt(0).toUpperCase())
        .join('');

    return (
        <ScreenWrapper className="flex-1 bg-canvas" withTopInset={false}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
            >
                {/* Sem faixa colorida e sem card sobreposto: o cartão de
                    identidade é só mais um card sobre o mesmo papel. */}
                <View className="px-4 pt-4">
                    <View className="bg-surface rounded-card p-5 items-center" style={Sombra.nivel1}>
                        <View className="w-20 h-20 rounded-full bg-brand-soft border border-brand-border items-center justify-center">
                            <Text className="font-display text-[28px] tracking-[1px] text-brand-deep">
                                {iniciais || '—'}
                            </Text>
                        </View>
                        <Text className="font-display text-[21px] tracking-[1px] text-ink mt-3">
                            {(usuario?.name || 'Ari Barbeiro').toUpperCase()}
                        </Text>
                        <Text className="font-sans text-[13px] text-ink-muted mt-0.5">
                            {usuario?.email || 'ari@barbershop.com'}
                        </Text>
                        {usuario?.role ? (
                            <View className="mt-3 px-3 py-1 rounded-full bg-surface-alt border border-line">
                                <Text className="font-medium text-[11px] tracking-[0.8px] text-ink-muted">
                                    {String(usuario.role).toUpperCase()}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                <View className="px-4 pt-3">
                    <View className="bg-surface rounded-card overflow-hidden" style={Sombra.nivel1}>
                        {ITENS_MENU.map((item, indice) => (
                            <Pressable
                                key={item.rotulo}
                                className={`flex-row items-center px-4 py-3.5 active:bg-surface-alt ${indice < ITENS_MENU.length - 1 ? 'border-b border-line' : ''
                                    }`}
                            >
                                <Feather name={item.icone} size={18} color={Cores.inkMuted} />
                                <Text className="flex-1 ml-3 font-sans text-[14.5px] text-ink">{item.rotulo}</Text>
                                <Feather name="chevron-right" size={18} color={Cores.inkSubtle} />
                            </Pressable>
                        ))}
                    </View>

                    {/* Sair é destrutivo mas não é a ação principal da tela —
                        contorno em vez de bloco vermelho cheio. */}
                    <Pressable
                        onPress={() => dispatch(deslogarUsuario())}
                        className="bg-danger-soft border border-danger-border rounded-card py-3.5 flex-row items-center justify-center gap-2 mt-5 active:opacity-80"
                    >
                        <Feather name="log-out" size={17} color={Cores.danger} />
                        <Text className="font-semibold text-[15px] text-danger">Sair</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
