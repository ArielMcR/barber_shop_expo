import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
    titulo: string;
    subtitulo?: string;
    /** Controles à direita (navegação de semana, filtros...). */
    acoes?: ReactNode;
};

/**
 * Cabeçalho padrão das telas. Substitui a faixa colorida que cada tela
 * desenhava por conta própria — aqui a hierarquia vem do peso da fonte, e
 * centralizar isso é o que mantém as quatro telas idênticas entre si.
 */
export default function CabecalhoTela({ titulo, subtitulo, acoes }: Props) {
    return (
        <View className="px-5 pt-3 pb-4">
            <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                    <Text className="font-display text-[25px] leading-[29px] tracking-[1.5px] text-ink">
                        {titulo}
                    </Text>
                    {subtitulo ? (
                        <Text className="font-sans text-[13px] text-ink-muted mt-0.5">{subtitulo}</Text>
                    ) : null}
                </View>
                {acoes ? <View className="pt-1">{acoes}</View> : null}
            </View>
        </View>
    );
}
