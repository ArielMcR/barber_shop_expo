# Barber Shop v2 💈

Sistema de gerenciamento para barbearias desenvolvido com React Native e Expo. Uma solução completa para controlar agendamentos, clientes, serviços e relatórios do seu estabelecimento.

## 📱 Sobre o Projeto

Barber Shop v2 é um aplicativo mobile moderno para gestão de barbearias que oferece:

- **Gestão de Agendamentos**: Visualização de agendamentos por dia/semana com navegação intuitiva
- **Cadastro de Clientes**: Controle completo dos clientes com histórico de atendimentos
- **Catálogo de Serviços**: Gerenciamento de serviços oferecidos com preços e durações
- **Relatórios**: Análise de desempenho e faturamento
- **Autenticação Segura**: Sistema de login com Redux Saga
- **Interface Moderna**: Design elegante com gradientes e animações suaves

## 🛠️ Tecnologias

- **React Native 0.81.5** - Framework mobile
- **Expo SDK 54** - Plataforma de desenvolvimento
- **Expo Router 6.0.15** - Navegação file-based (Drawer + Tabs)
- **NativeWind v4** - Tailwind CSS para React Native
- **Redux + Redux Saga** - Gerenciamento de estado
- **TypeScript 5.9.2** - Tipagem estática
- **AsyncStorage** - Persistência local de dados
- **Expo Linear Gradient** - Gradientes nativos

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```
## 📂 Estrutura do Projeto

```
app/
├── (drawer)/           # Navegação drawer
│   ├── (tabs)/        # Navegação em abas
│   │   ├── index.tsx  # Agendamentos
│   │   ├── clientes.tsx
│   │   ├── servicos.tsx
│   │   └── relatorios.tsx
│   ├── perfil.tsx
│   └── configuracoes.tsx
├── index.tsx          # Tela de login
└── _layout.tsx        # Layout raiz com Redux Provider

redux/
├── actions/           # Action creators
├── reducers/          # Reducers
├── sagas/            # Redux Sagas
└── store.ts          # Configuração da store

modais/
└── ModalAviso/       # Modal genérico de avisos
```

## 🎨 Funcionalidades

### Agendamentos
- Visualização semanal de agendamentos
- Navegação entre semanas (anterior/próxima/hoje)
- Cards coloridos por status (confirmado, aguardando, cancelado)
- Detalhes completos de cada agendamento

### Clientes
- Lista de clientes com busca
- Informações de contato e histórico
- Pull-to-refresh para atualizar dados

### Serviços
- Catálogo de serviços oferecidos
- Preços e duração de cada serviço
- Gerenciamento via Redux Saga

### Sistema de Autenticação
- Login com validação
- Navegação controlada por sagas
- Persistência de sessão com AsyncStorage
- Modais elegantes para feedback

## 🚀 Credenciais de Teste

**Usuário:** admin  
**Senha:** 123

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
