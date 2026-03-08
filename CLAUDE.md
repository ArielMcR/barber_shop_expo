# CLAUDE.md — Guia de Desenvolvimento: Barber Shop v2

## Visão Geral do Projeto

Sistema de gerenciamento de barbearia em React Native / Expo. Permite que o barbeiro gerencie **agendamentos**, **clientes** e **serviços** via aplicativo mobile.

**Credenciais de teste:** `admin` / `123`

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
│   │   ├── sagasUsuario.ts       # Auth saga (login mock: admin/123)
│   │   ├── sagasClient.ts        # Clientes saga (dados mock)
│   │   └── sagasServico.ts       # Serviços saga (dados mock)
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
│   ├── Button/index.tsx          # Botão primário customizado
│   ├── Copyright/index.tsx       # Rodapé de copyright (TekoBit)
│   ├── LabeledInput/index.tsx    # Input com label
│   ├── ModalCadastro/            # (legado — substituído por ModalFormulario)
│   ├── ApontamentoItem/          # (legado)
│   └── TabBarAgendamento/        # (legado)
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
    └── theme.ts                  # Cores e fontes do tema
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
store.getState().usuario    // autenticação, dados do usuário
store.getState().modais     // estado de cada modal
store.getState().servicos   // lista de serviços
store.getState().clientes   // lista de clientes
```

### Hooks tipados (sempre usar esses)
```ts
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
const dispatch = useAppDispatch();
const clientes = useAppSelector(state => state.clientes.lista);
```

---

## Convenções e Padrões

### Estilização
- Usar **NativeWind** (classes Tailwind) como padrão principal
- Cor primária: `green-500` / `#10b981`
- Fundo de telas: `bg-gray-50` ou `bg-gray-100`
- Cards: `bg-white` com `rounded-xl`
- NÃO usar StyleSheet salvo casos específicos (animações, valores dinâmicos)

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
- [x] Autenticação com login/logout (mock: admin/123)
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
- [ ] Integração com backend real (substituir sagas mock)
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

1. **Dados mock:** Clientes e serviços são gerados em sagas com dados hardcoded. Substituir pelas chamadas de API quando o backend estiver disponível.
2. **Agendamentos em memória:** Os agendamentos vivem no estado local da tela (useState). Precisam ser persistidos em AsyncStorage ou backend.
3. **AsyncStorage está em devDependencies** no package.json — mover para dependencies se necessário para uso em produção.
4. **New Architecture ativada** no app.json — considerar ao usar libs nativas.
5. **React Compiler experimental** ativado — pode impactar libs mais antigas.
