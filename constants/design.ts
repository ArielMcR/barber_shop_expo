/**
 * Sistema de design — fonte única de verdade do visual do app.
 *
 * Paleta "creme + cobre": fundo de papel quente, texto quase preto e cobre
 * como única cor de marca/ação. Cores de status (sucesso, erro, aviso) existem
 * separadas de propósito — o cobre nunca deve significar "deu certo", senão a
 * cor perde função como aconteceu com o verde na versão anterior.
 *
 * Use `Cores` em lugares que exigem hex cru: opções de navegação, StyleSheet,
 * props de cor de ícone. Em JSX prefira as classes NativeWind equivalentes
 * (bg-brand, text-ink-muted, border-line...), declaradas em tailwind.config.js
 * a partir dos mesmos valores.
 */

export const Cores = {
    /** Fundo da tela — creme, não cinza. É o que tira a cara de template. */
    canvas: '#FAF8F5',

    surface: '#FFFFFF',
    /** Card rebaixado: slot de continuação, campo de busca, linha alternada. */
    surfaceAlt: '#F3EFE9',
    surfaceSunken: '#EDE8E0',

    line: '#E7E1D8',
    lineStrong: '#D8D0C4',

    ink: '#1A1A18',
    inkMuted: '#6E6960',
    inkSubtle: '#A09A90',
    inkInverse: '#FAF8F5',

    /** Cobre — marca e ação primária. Nada mais usa esta cor. */
    brand: '#B87333',
    brandStrong: '#9A5F27',
    brandDeep: '#7C4A1E',
    brandSoft: '#F7EDE1',
    brandBorder: '#E8D5BE',

    /** Concluído / confirmado. */
    success: '#2F7D5B',
    successSoft: '#E7F1EC',
    successBorder: '#C9E2D6',

    /** Atenção — dourado, deslocado do cobre para não se confundir com marca. */
    warning: '#C9971C',
    warningSoft: '#FBF3DE',
    warningBorder: '#EFDFB4',

    /** Destrutivo / cancelado. */
    danger: '#B3261E',
    dangerSoft: '#FBEBE9',
    dangerBorder: '#F2D2CE',

    info: '#2C6E9B',
    infoSoft: '#E8F1F7',
    infoBorder: '#CFE1EE',
} as const;

/**
 * Oswald (condensado, ar de letreiro) carrega títulos, horários e valores.
 * Inter carrega todo o resto. Os nomes batem com os exports de
 * @expo-google-fonts, que é o que `useFonts` espera.
 */
export const Fontes = {
    display: 'Oswald_600SemiBold',
    displayMedium: 'Oswald_500Medium',
    displayRegular: 'Oswald_400Regular',
    bold: 'Inter_700Bold',
    semibold: 'Inter_600SemiBold',
    medium: 'Inter_500Medium',
    regular: 'Inter_400Regular',
} as const;

export const Raio = {
    chip: 10,
    control: 12,
    card: 16,
    sheet: 24,
    pill: 999,
} as const;

/**
 * Sombras com tom quente (#8A7B63) em vez de preto puro — sobre fundo creme,
 * sombra preta suja e acinzenta o card.
 */
export const Sombra = {
    /** Card em repouso. */
    nivel1: {
        shadowColor: '#8A7B63',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    /** Card em destaque, barra de abas. */
    nivel2: {
        shadowColor: '#8A7B63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    /** FAB, bottom sheet. */
    nivel3: {
        shadowColor: '#6B5B45',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
        elevation: 10,
    },
} as const;
