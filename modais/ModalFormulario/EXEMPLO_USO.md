# Modal Formulário - Guia de Uso

## Exemplo: Cadastro de Cliente

```typescript
import { useModalFormulario } from '@/hooks/useModalFormulario';

const TelaClientes = () => {
    const modalFormulario = useModalFormulario();

    const abrirCadastroCliente = () => {
        modalFormulario.abrirFormulario(
            'Novo Cliente',
            [
                {
                    nome: 'nome',
                    label: 'Nome Completo',
                    placeholder: 'Digite o nome do cliente',
                    icone: 'user',
                    obrigatorio: true,
                },
                {
                    nome: 'telefone',
                    label: 'Telefone',
                    placeholder: '(00) 00000-0000',
                    icone: 'phone',
                    tipo: 'phone', // Máscara automática: (00) 00000-0000
                    obrigatorio: true,
                },
                {
                    nome: 'email',
                    label: 'E-mail',
                    placeholder: 'cliente@email.com',
                    icone: 'mail',
                    tipo: 'email',
                    obrigatorio: false,
                },
                {
                    nome: 'observacoes',
                    label: 'Observações',
                    placeholder: 'Anotações sobre o cliente',
                    icone: 'file-text',
                    multiline: true,
                    linhas: 4,
                    obrigatorio: false,
                },
            ],
            {
                textoBotaoConfirmar: 'Cadastrar Cliente',
                textoBotaoCancelar: 'Cancelar',
                onConfirmar: (valores) => {
                    console.log('Dados do cliente:', valores);
                    // valores.telefone virá mascarado: "(11) 99999-9999"
                },
            }
        );
    };
};
```

## Exemplo: Cadastro de Serviço

```typescript
const abrirCadastroServico = () => {
    modalFormulario.abrirFormulario(
        'Novo Serviço',
        [
            {
                nome: 'nome',
                label: 'Nome do Serviço',
                placeholder: 'Ex: Corte Masculino',
                icone: 'scissors',
                obrigatorio: true,
            },
            {
                nome: 'preco',
                label: 'Preço',
                placeholder: 'R$ 000.000,00',
                icone: 'dollar-sign',
                tipo: 'currency', // Máscara automática de moeda
                obrigatorio: true,
            },
            {
                nome: 'duracao',
                label: 'Duração (minutos)',
                placeholder: 'Ex: 30',
                icone: 'clock',
                tipo: 'number',
                obrigatorio: true,
            },
        ],
        {
            onConfirmar: (valores) => {
                // valores.preco virá sem máscara para facilitar conversão
                const servico = {
                    nome: valores.nome,
                    preco: parseFloat(valores.preco) / 100, // Converter centavos para reais
                    duracao: parseInt(valores.duracao),
                };
            },
        }
    );
};
```

## Máscaras Personalizadas

```typescript
{
    nome: 'cpf',
    label: 'CPF',
    placeholder: '000.000.000-00',
    mascara: [
        /\d/, /\d/, /\d/, '.', 
        /\d/, /\d/, /\d/, '.', 
        /\d/, /\d/, /\d/, '-', 
        /\d/, /\d/
    ],
}
```

```typescript
{
    nome: 'cep',
    label: 'CEP',
    placeholder: '00000-000',
    mascara: [
        /\d/, /\d/, /\d/, /\d/, /\d/, 
        '-', 
        /\d/, /\d/, /\d/
    ],
}
```

```typescript
{
    nome: 'data',
    label: 'Data de Nascimento',
    placeholder: '00/00/0000',
    mascara: [
        /\d/, /\d/, '/', 
        /\d/, /\d/, '/', 
        /\d/, /\d/, /\d/, /\d/
    ],
}
```

## Tipos de Campos com Máscara Automática

### Telefone (phone)
```typescript
{
    nome: 'telefone',
    label: 'Telefone',
    tipo: 'phone',
    // Máscara automática: (00) 00000-0000
}
```
**Retorna**: "(11) 99999-9999"

### Moeda (currency)
```typescript
{
    nome: 'preco',
    label: 'Preço',
    tipo: 'currency',
    // Máscara automática: R$ 000.000,00
}
```
**Retorna**: Valor sem máscara (apenas números) para facilitar conversão

### Number
```typescript
{
    nome: 'quantidade',
    label: 'Quantidade',
    tipo: 'number',
    // Sem máscara, apenas teclado numérico
}
```

## Ícones Disponíveis

Use qualquer ícone do Feather Icons:
- `user`, `users` - Usuários
- `phone`, `smartphone` - Telefone
- `mail` - E-mail
- `dollar-sign` - Dinheiro
- `clock` - Tempo
- `scissors` - Tesoura
- `edit` - Editar
- `file-text` - Documento
- `info` - Informação
- E muitos outros...

Veja todos em: https://feathericons.com/
