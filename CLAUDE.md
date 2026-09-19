# CLAUDE.md — Guia de Desenvolvimento: Barber Shop v2

## Visão Geral do Projeto

Sistema de gerenciamento de barbearia em React Native / Expo. Permite que o barbeiro gerencie **agendamentos**, **clientes** e **serviços** via aplicativo mobile.

**Credenciais de teste** (usuários do seed do back-end, login por `name`): `Ariel` / `123`

---

## Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Base mobile |
| Expo SDK | 54 | Plataforma |
| Expo Router | 6.0.15 | Navegação file-based |
| Redux Toolkit | 2.10.1 | Estado global |
| Redux Saga | 1.4.2 | Side effects assíncronos |
| NativeWind v4 | 4.2.1 | Tailwind CSS para RN |
| TypeScript | 5.9.2 | Tipagem estática |
| Lucide RN | 0.575.0 | Ícones (algumas telas) |
| Feather Icons | via @expo/vector-icons | Ícones (maioria das telas) |
| react-native-element-dropdown | 2.12.4 | Dropdowns nos modais |
| react-native-mask-input | 1.2.3 | Máscaras de formulários |
| expo-linear-gradient | 15.0.7 | Gradientes |

---

## Estrutura de Pastas

```
barber_shop_v2/
├── app/                          # Telas (Expo Router file-based routing)
│   ├── _layout.tsx               # Layout raiz: Provider Redux + modais globais
│   ├── index.tsx                 # Tela de Login
│   └── (drawer)/                 # Grupo de navegação Drawer
│       ├── _layout.tsx           # Configuração do Drawer (Início, Perfil, Config)
│       ├── perfil.tsx            # Tela de Perfil do usuário
│       ├── configuracoes.tsx     # Tela de Configurações
│       └── (tabs)/               # Grupo de navegação por Tabs
│           ├── _layout.tsx       # Configuração das Tabs
│           ├── index.tsx         # Agendamentos (tela principal)
│           ├── clientes.tsx      # Lista de Clientes
│           ├── servicos.tsx      # Lista de Serviços
│           └── relatorios.tsx    # Relatórios (dashboard)
│
├── redux/                        # Estado global
│   ├── store.ts                  # Configuração da Store
│   ├── rooteReducer.ts           # Combina todos os reducers
│   ├── rootSaga.ts               # Combina todas as sagas
│   ├── actions/
│   │   ├── actionsModais.ts      # Ações de abertura/fechamento de modais
│   │   ├── actionsUsuario.ts     # Login, logout, validação de token
│   │   ├── actionsClients.ts     # CRUD de clientes
│   │   └── actionsServico.ts     # CRUD de serviços
│   ├── reducers/
│   │   ├── modaisReducer.ts      # Estado dos modais (aviso, formulário, agendamento)
│   │   ├── usuarioReducer.ts     # Estado de autenticação
│   │   ├── clientReducer.ts      # Lista de clientes
│   │   └── servicoReducer.ts     # Lista de serviços
│   ├── sagas/
│   │   ├── sagasUsuario.ts       # Auth saga (POST /auth/login, GET /auth/me)
│   │   ├── sagasClient.ts        # Clientes saga (API real)
│   │   └── sagasServico.ts       # Serviços saga (API real)
│   └── types/
│       ├── typesModais.ts        # Action types dos modais
│       ├── typesUsuario.ts       # Action types de usuário
│       ├── typesCliente.ts       # Action types de clientes
│       └── typesServico.ts       # Action types de serviços
│
├── modais/                       # Componentes modais
│   ├── ModalAviso/               # Modal de alertas/avisos/confirmações (animado)
│   ├── ModalFormulario/          # Modal genérico de formulário com campos mascarados
│   ├── ModalAgendamento/         # Modal de criação/edição de agendamento
│   └── ModalDetalheAgendamento/  # Modal de detalhes + ações do agendamento
│
├── components/                   # Componentes reutilizáveis
│   ├── ScreenWrapper.tsx         # Wrapper com safe area insets
│   ├── CabecalhoTela/index.tsx   # Cabeçalho padrão (título + subtítulo + ações)
│   ├── Copyright/index.tsx       # Rodapé de copyright (TekoBit)
│   ├── Button/index.tsx          # (morto — ninguém importa)
│   ├── LabeledInput/index.tsx    # (morto — ninguém importa)
│   ├── ModalCadastro/            # (morto — substituído por ModalFormulario)
│   ├── ApontamentoItem/          # (morto)
│   └── TabBarAgendamento/        # (morto — e quebra o tsc: falta react-native-tab-view)
│
├── hooks/                        # Hooks customizados
│   ├── useRedux.ts               # useAppDispatch e useAppSelector tipados
│   ├── useModalAviso.ts          # Abstração para abrir ModalAviso (erros, avisos, confirm)
│   ├── useModalFormulario.ts     # Abstração para abrir ModalFormulario
│   ├── use-color-scheme.ts       # Detecção de tema claro/escuro
│   └── use-theme-color.ts        # Cor baseada no tema ativo
│
├── services/
│   └── navigationService.ts      # Serviço de navegação imperativa (fora de componentes)
│
├── types/                        # Tipos TypeScript globais
│   ├── typesApontamento.ts       # Interface de Agendamento
│   ├── typesCliente.ts           # Interface de Cliente
│   └── typesServico.ts           # Interface de Serviço
│
├── utils/
│   ├── constants.ts              # Constantes globais do app
│   └── conversorData.ts          # Helpers de formatação de data
│
└── constants/
    ├── design.ts                 # ⭐ Sistema de design: Cores, Fontes, Raio, Sombra
    └── theme.ts                  # (boilerplate do Expo — não usado por nenhuma tela)
```

---

## Arquitetura de Navegação

```
Stack Root (app/_layout.tsx)
└── Drawer (app/(drawer)/_layout.tsx)
    ├── Tabs (app/(drawer)/(tabs)/_layout.tsx)
    │   ├── index.tsx       → Agendamentos
    │   ├── clientes.tsx    → Clientes
    │   ├── servicos.tsx    → Serviços
    │   └── relatorios.tsx  → Relatórios
    ├── perfil.tsx          → Perfil
    └── configuracoes.tsx   → Configurações
```

O Redux Provider e os modais globais (`ModalAviso`, `ModalFormulario`) ficam no root layout `app/_layout.tsx`.

---

## Sistema de Modais

Os modais são **globais** — montados uma vez no root layout e controlados via Redux.

### ModalAviso
- **Arquivo:** `modais/ModalAviso/`
- **Uso via hook:** `useModalAviso()`
- **Tipos:** `sucesso`, `erro`, `aviso`, `info`, `confirmacao`
- **Métodos disponíveis:**
  ```ts
  modalAviso.mostrarSucesso("Mensagem")
  modalAviso.mostrarErro("Mensagem")
  modalAviso.mostrarAviso("Mensagem")
  modalAviso.mostrarInfo("Mensagem")
  modalAviso.mostrarConfirmacao("Mensagem", {
    textoBotaoConfirmar: "Sim",
    textoBotaoCancelar: "Não",
    tipo: "aviso",
    onConfirmar: () => { ... }
  })
  ```

### ModalFormulario
- **Arquivo:** `modais/ModalFormulario/`
- **Uso via hook:** `useModalFormulario()`
- **Tipos de campo:** `text`, `number`, `phone`, `email`, `currency`, `textarea`
- **Exemplo:**
  ```ts
  const { abrirFormulario } = useModalFormulario();
  abrirFormulario({
    titulo: "Novo Cliente",
    campos: [
      { id: "nome", label: "Nome", tipo: "text", obrigatorio: true, icone: "user" },
      { id: "telefone", label: "Telefone", tipo: "phone", obrigatorio: true, icone: "phone" },
    ],
    textoBotaoConfirmar: "Salvar",
    onConfirmar: (valores) => { /* valores.nome, valores.telefone */ }
  });
  ```

### ModalAgendamento
- **Arquivo:** `modais/ModalAgendamento/`
- **Controlado via Redux:** `dispatch(setModalAgendamento({ statusAtivo: true, ... }))`
- **Modos:** `novo`, `trocar_cliente`, `trocar_servico`
- **Recebe prop:** `onConfirmar: ({ cliente, servico, horario, modo }) => void`

### ModalDetalheAgendamento
- **Arquivo:** `modais/ModalDetalheAgendamento/`
- **Controlado localmente** via props (`visible`, `slot`, callbacks)
- **Props:** `onFechar`, `onTrocarCliente`, `onTrocarServico`, `onCancelarAgendamento`

---

## Lógica de Agendamentos (tela principal)

**Arquivo:** `app/(drawer)/(tabs)/index.tsx`

### Slots de horário
- **Manhã:** `09:00` a `11:30` (slots de 30min)
- **Almoço:** 12:00–13:00 (bloqueado, exibido como divisor)
- **Tarde:** `13:00` a `19:30` (slots de 30min)

### Estado local
```ts
agendamentos: Record<string, AgendamentoSlot[]>
// chave = data ISO (YYYY-MM-DD), valor = array de slots
```

### AgendamentoSlot
```ts
type AgendamentoSlot = {
  horario: string;      // ex: "09:00"
  cliente: any;
  servico: any;
  duracaoMin: number;
  ocupadoPor?: string;  // horário do slot principal (para slots de continuação)
}
```

### Regras de negócio
- Serviços com duração > 30min ocupam múltiplos slots consecutivos
- Não pode cruzar o almoço
- Não pode conflitar com slots já ocupados
- Agendamentos ficam **em memória local** (não persistidos via API ainda)

---

## Estado Redux

### Slices disponíveis
```ts
store.getState().usuario     // autenticação, dados do usuário
store.getState().modais      // estado de cada modal
store.getState().servicos    // lista de serviços
store.getState().clientes    // lista de clientes
store.getState().loja        // dados da barbearia (nome, CNPJ, endereço, telefone)
store.getState().agendamentos
store.getState().relatorios
store.getState().observacoes
store.getState().assistente  // chat em linguagem natural (Sprint 3)
```

### Assistente (Sprint 3)

Tela `app/(drawer)/(tabs)/assistente.tsx` — chat que envia comandos em português para
`POST /assistant/command`. Também acessível pelo FAB da tela de Agenda.

- `mensagens[]` guarda `criadaEm` como **ISO string, não `Date`** — o store precisa ser serializável
- A mensagem do usuário entra de forma otimista no `SEND_COMMAND_REQUEST`, antes da resposta da API
- Erro de negócio chega como **HTTP 200** com `status: 'EXECUTION_ERROR'` — só falha de rede cai no
  `catch` da saga. Por isso o chat não usa `ModalAviso`: a falha vira balão vermelho na conversa
- Cada comando gasta 2 chamadas ao Gemini (voz gasta 3). O que trava é a **cota diária** do plano
  gratuito, não a por minuto — ver `back-end/README.md`

**Voz:** segurar o botão de microfone grava com `expo-audio` (`useAudioRecorder` +
`RecordingPresets.HIGH_QUALITY`, saída `.m4a`) e solta envia para `POST /assistant/command/audio`
como `multipart/form-data`. O `Content-Type` precisa ser sobrescrito na chamada, porque o
`services/api.ts` fixa `application/json` no cliente.

- O balão do usuário nasce **vazio** (`aguardandoTranscricao`) e é preenchido quando o backend
  devolve `transcription` — o usuário precisa ver se o assistente ouviu errado
- O microfone só aparece com o campo de texto vazio, para não competir com o botão de enviar
- Comando falado gasta **3** chamadas ao Gemini (transcrição + as 2 do texto): ~1 por minuto no
  free tier
- Roda em Expo Go; STT nativo no aparelho exigiria development build

### Hooks tipados (sempre usar esses)
```ts
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
const dispatch = useAppDispatch();
const clientes = useAppSelector(state => state.clientes.lista);
```

---

## Convenções e Padrões

### Recarga de dados — `useFocusEffect`, não `useEffect([])`

As abas **permanecem montadas** ao trocar de tela, então `useEffect(..., [])` roda uma única vez
na vida do app. Quem agendava pelo assistente e voltava para a agenda continuava vendo o estado
anterior. Todas as telas de dados usam `useFocusEffect(useCallback(...))` do `expo-router`.

Além disso, `sagasAssistente` **revalida o que a ferramenta mexeu** logo após um comando bem
sucedido: `CREATE_APPOINTMENT` → `requestAgendamentos()`, `REGISTER_CLIENT` → `requestClients()`.
`QUERY_SCHEDULE` e `GENERATE_REPORT` são leitura e não invalidam nada. **Ao adicionar uma função
nova ao assistente que escreva no banco, acrescente a revalidação lá.**

### Datas — nunca use `toISOString()` para chave de dia

`toISOString()` devolve **UTC**. No Brasil (UTC−3), das 21h em diante ele já retorna o dia
seguinte. Como as chaves da agenda (`agendamentos[data]`) são strings `YYYY-MM-DD`, isso fazia
a grade da semana inteira apontar para o dia errado à noite: um agendamento de sexta aparecia
sob o botão de quinta, e o botão de sexta vinha vazio.

Use **`paraDataLocalISO(date)`** de `utils/conversorData.ts` em qualquer lugar que gere chave de
dia. O back-end grava `appointmentDate` à meia-noite **local**, então ler em local é o par correto.

### Agendamento tem 1..N serviços

A API devolve `apt.services[]` (não `apt.service`), cada item com `unitPrice` e `durationMinutes`
**congelados na marcação**. `resumirServicos()` em `sagasAgendamento` transforma os itens no
"serviço" que a tela consome:

- `nome` → nomes concatenados com `+`
- `duracao` / `duracaoMin` → **soma** das durações (é o que define quantos slots ocupa)
- `preco` → **soma** dos preços congelados
- `itens[]` → lista original, usada pelo `ModalDetalheAgendamento` e para remarcar no
  `ModalAgendamento`

`createAgendamento` envia **`serviceIds: number[]`**. O `ModalAgendamento` usa lista com marcação
e mostra duração/slots/total antes de confirmar — a soma pode estourar o expediente ou o almoço.

### Grade de horários

`SLOTS_MANHA`, `SLOTS_TARDE` e `TODOS_SLOTS` vivem em `utils/constants.ts` — **fonte única**.
A tela e a saga já tiveram cópias divergentes (a saga começava às 09:00 e não conhecia 08:00,
08:30 e 13:15), e como a saga usa `indexOf(startTime)` para marcar os slots seguintes de serviços
longos, um horário ausente virava índice −1 e pintava a ocupação nos slots errados.
Espelha o `AppointmentScheduleValidator` do back-end (08:00–12:00 e 13:15–19:30).

### Estilização — sistema de design "creme + cobre"

**Nunca escreva cor literal** (`#10b981`, `bg-green-500`, `bg-gray-50`). Tudo vem de tokens:

- `constants/design.ts` → `Cores`, `Fontes`, `Raio`, `Sombra`. Use onde só cabe hex cru:
  opções de navegação, `StyleSheet`, prop `color` de ícone.
- `tailwind.config.js` → as mesmas cores como classes. Use em JSX.
- Ao mexer numa cor, mexa **nos dois arquivos** — eles se espelham manualmente.

| Papel | Classe | Token |
|---|---|---|
| Fundo de tela | `bg-canvas` | `Cores.canvas` |
| Card | `bg-surface` | `Cores.surface` |
| Card rebaixado | `bg-surface-alt` | `Cores.surfaceAlt` |
| Divisor / contorno | `border-line` | `Cores.line` |
| Texto principal | `text-ink` | `Cores.ink` |
| Texto secundário | `text-ink-muted` | `Cores.inkMuted` |
| Texto terciário | `text-ink-subtle` | `Cores.inkSubtle` |
| Marca / ação primária | `bg-brand` | `Cores.brand` (cobre `#B87333`) |

**Cor tem significado — não reutilize.** Cobre é *só* marca e ação primária; verde é *só*
"concluído"; vermelho é *só* destrutivo/cancelado; dourado é *só* atenção. Foi exatamente
essa sobreposição (verde servindo de marca + sucesso + ocupado + preço ao mesmo tempo) que
deixou a versão anterior sem hierarquia.

**Tipografia:** Oswald (`font-display`) em títulos, horários e valores; Inter
(`font-sans`/`font-medium`/`font-semibold`/`font-bold`) em todo o resto. As fontes são
carregadas em `app/_layout.tsx` — importe **por subpath** (`@expo-google-fonts/inter/400Regular`),
nunca pelo barrel, que arrasta ~7 MB de pesos não usados para o bundle.

**Sem faixa colorida no topo.** Telas usam `<CabecalhoTela titulo subtitulo acoes />`;
a hierarquia vem do peso da fonte, não de um bloco de cor.

- Usar **NativeWind** como padrão em telas e componentes
- Cards: `bg-surface rounded-card` + `style={Sombra.nivel1}`
- Os 5 modais continuam em `StyleSheet` (animações e folhas), mas consumindo `Cores`/`Fontes`/`Raio`/`Sombra`
- `modais/` está no `content` do Tailwind — classes ali funcionam se quiser migrar

### Ícones
- **Feather** (`@expo/vector-icons/Feather`) — padrão na maioria dos componentes
- **Lucide** (`lucide-react-native`) — uso secundário

### Componentes
- Todo componente de tela usa `<ScreenWrapper>` para safe area
- Formulários e cadastros devem usar `useModalFormulario` em vez de criar telas separadas
- Alertas e feedback ao usuário devem usar `useModalAviso`

### Importações
- Usar alias `@/` para paths absolutos (configurado no tsconfig)
- Exemplos: `@/hooks/useRedux`, `@/components/Button`, `@/modais/ModalAviso`

---

## Status Atual de Desenvolvimento

### Implementado
- [x] Autenticação com login/logout via API real (`name` + senha)
- [x] Navegação Drawer + Tabs
- [x] Sistema de agendamentos com slots semanais
- [x] Lista de clientes com busca e refresh
- [x] Lista de serviços com refresh
- [x] Modal genérico de formulário (ModalFormulario)
- [x] Modal de avisos/confirmações (ModalAviso)
- [x] Modal de agendamento (ModalAgendamento)
- [x] Modal de detalhes do agendamento (ModalDetalheAgendamento)
- [x] Cadastro de novos clientes (via ModalFormulario)
- [x] Cadastro de novos serviços (via ModalFormulario)

### Pendente / Próximos Passos
- [ ] Persistência de agendamentos (AsyncStorage ou API)
- [ ] Tela de Relatórios com dados reais (atualmente estática)
- [ ] Tela de Perfil funcional
- [ ] Tela de Configurações funcional
- [ ] Validação e edição de clientes/serviços existentes
- [ ] Notificações push para lembretes de agendamento
- [ ] Filtros e busca na tela de agendamentos

---

## Como Adicionar Novos Recursos

### Nova tela no Drawer
1. Criar arquivo em `app/(drawer)/nova-tela.tsx`
2. Adicionar entrada em `app/(drawer)/_layout.tsx`

### Nova tela nas Tabs
1. Criar arquivo em `app/(drawer)/(tabs)/nova-aba.tsx`
2. Adicionar entrada em `app/(drawer)/(tabs)/_layout.tsx`

### Novo modal
1. Criar pasta em `modais/NovoModal/`
2. Exportar componente default com `index.tsx`
3. Adicionar action type em `redux/types/typesModais.ts`
4. Adicionar action creator em `redux/actions/actionsModais.ts`
5. Adicionar ao reducer em `redux/reducers/modaisReducer.ts`
6. Montar o modal no root layout `app/_layout.tsx`

### Nova entidade (ex: produto)
1. Criar tipos em `types/typesProduto.ts`
2. Criar action types em `redux/types/typesProduto.ts`
3. Criar actions em `redux/actions/actionsProduto.ts`
4. Criar reducer em `redux/reducers/produtoReducer.ts`
5. Criar saga em `redux/sagas/sagasProduto.ts`
6. Registrar no `redux/rooteReducer.ts` e `redux/rootSaga.ts`

---

## Scripts de Desenvolvimento

```bash
npm start            # Iniciar servidor Expo (escolher plataforma)
npm run android      # Abrir no Android
npm run ios          # Abrir no iOS
npm run web          # Abrir no browser
npm run lint         # Verificar lint
```

---

## Notas Importantes

1. **Slice `loja`:** guarda os dados da barbearia devolvidos por `/auth/login` e `/auth/me` (o back-end é de instalação única — não há seleção de empresa/unidade).
2. **Agendamentos em memória:** Os agendamentos vivem no estado local da tela (useState). Precisam ser persistidos em AsyncStorage ou backend.
3. **AsyncStorage está em devDependencies** no package.json — mover para dependencies se necessário para uso em produção.
4. **New Architecture ativada** no app.json — considerar ao usar libs nativas.
5. **React Compiler experimental** ativado — pode impactar libs mais antigas.
