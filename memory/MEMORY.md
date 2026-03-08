# Memória do Projeto — Barber Shop v2

## Essencial
- App React Native/Expo para gerenciar barbearia: agendamentos, clientes, serviços
- Credenciais mock: `admin` / `123`
- Cor primária: `green-500` (#10b981)
- Arquivo de guia completo: `CLAUDE.md` na raiz do projeto

## Stack
- Expo Router (file-based routing): Drawer > Tabs
- Redux Toolkit + Redux Saga (dados ainda mock nos sagas)
- NativeWind v4 (Tailwind para RN) — padrão de estilo
- Feather Icons (@expo/vector-icons) — padrão; Lucide secundário
- Alias `@/` para imports absolutos

## Padrões Estabelecidos
- Formulários/cadastros → `useModalFormulario()` (não criar telas separadas)
- Alertas/feedback → `useModalAviso()` (mostrarErro, mostrarAviso, mostrarConfirmacao...)
- Redux hooks tipados: `useAppDispatch`, `useAppSelector` de `@/hooks/useRedux`
- Telas envolvidas em `<ScreenWrapper>`
- Cards com `bg-white rounded-xl`

## Status
- Agendamentos: em memória local (useState) — precisa persistir
- Clientes/Serviços: dados mock nos sagas — precisa backend real
- Relatórios: tela estática — sem dados reais ainda
- Perfil e Configurações: telas vazias/placeholder

## Arquivos Críticos
- `app/_layout.tsx` — Provider Redux + modais globais montados aqui
- `app/(drawer)/(tabs)/index.tsx` — Lógica principal de agendamentos
- `redux/rooteReducer.ts` + `redux/rootSaga.ts` — registrar novas entidades aqui
- `modais/ModalFormulario/` — modal genérico reusável para qualquer formulário
- `hooks/useModalAviso.ts` + `hooks/useModalFormulario.ts` — abstrações dos modais
