/**
 * O assistente escreve para ser LIDO, não ouvido. A resposta chega com markdown
 * (`**Corte**`, listas com `-`), dinheiro em `R$ 1.234,56` e horários em `14:30`.
 * O TTS do aparelho lê tudo literalmente: "asterisco asterisco corte", "erre
 * cifrão um ponto dois três quatro vírgula cinco seis", "quatorze dois pontos
 * trinta". Aqui o texto vira algo pronunciável antes de ir para a fala.
 *
 * Função pura de propósito — é o pedaço testável da voz.
 */

/** `R$ 1.234,56` → `1234 reais e 56 centavos`. O ponto de milhar precisa sair: */
/** sem isso o leitor soletra "um ponto duzentos e trinta e quatro". */
const MOEDA = /R\$\s*(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{2}))?/g;

/** `09:30` → `9 horas e 30`. O zero à esquerda vira "zero nove" se ficar. */
const HORARIO = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;

const falarMoeda = (_: string, inteiro: string, centavos?: string) => {
    const reais = Number(inteiro.replace(/\./g, ''));
    const unidade = reais === 1 ? 'real' : 'reais';
    const cents = centavos ? Number(centavos) : 0;
    if (cents === 0) return `${reais} ${unidade}`;
    return `${reais} ${unidade} e ${cents} ${cents === 1 ? 'centavo' : 'centavos'}`;
};

const falarHorario = (_: string, hora: string, minuto: string) => {
    const h = Number(hora);
    const m = Number(minuto);
    const unidade = h === 1 ? 'hora' : 'horas';
    return m === 0 ? `${h} ${unidade}` : `${h} ${unidade} e ${m}`;
};

export function prepararTextoParaFala(texto: string): string {
    if (!texto) return '';

    return (
        texto
            // Ordem importa: moeda antes de qualquer mexida em pontuação, senão
            // o separador de milhar já teria virado outra coisa.
            .replace(MOEDA, falarMoeda)
            .replace(HORARIO, falarHorario)

            // Markdown. Links viram só o rótulo — ninguém quer ouvir uma URL.
            .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            .replace(/\*([^*\n]+)\*/g, '$1')
            .replace(/^#{1,6}\s*/gm, '')
            // Marcador de lista vira pausa: a vírgula separa os itens na fala.
            .replace(/^[ \t]*[-*•]\s+/gm, '')

            // Quebra de linha é pausa. Sem isso o leitor emenda o item seguinte
            // na mesma frase e a lista da agenda sai como um borrão.
            .replace(/\n+/g, '. ')
            // A linha anterior pode ter criado ".." quando já havia pontuação.
            .replace(/([.!?,;:])\s*\.\s*/g, '$1 ')
            .replace(/\s{2,}/g, ' ')
            .trim()
    );
}
