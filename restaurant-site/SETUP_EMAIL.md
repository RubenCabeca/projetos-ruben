# FoodBox Delivery - Guia de Setup do Email

## Pré-requisitos

- Node.js 14+ instalado
- npm (vem com Node.js)

## Instalação Rápida

### 1. Instalar Dependências

```bash
cd c:\Users\Rúben\My project\food-delivery-boxes
npm install
```

### 2. Configurar Email

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Depois edite o arquivo `.env` com as suas credenciais de email:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app
PORT=3000
```

### 3. Configurar Gmail (Recomendado)

Se vai usar Gmail:

1. Vá para https://myaccount.google.com/security
2. Ative "Verificação em 2 passos"
3. Vá para https://myaccount.google.com/apppasswords
4. Selecione:
   - App: **Mail**
   - Device: **Windows Computer**
5. Copie a senha de 16 caracteres
6. Cole em `.env` no campo `EMAIL_PASSWORD`

### 4. Iniciar o Servidor

```bash
npm start
```

Deve ver:

```
🍱 FoodBox Delivery - Servidor iniciado na porta 3000
http://localhost:3000
```

### 5. Testar

1. Abra http://localhost:3000 no navegador
2. Faça login ou crie uma conta
3. Adicione uma reserva
4. Clique em "Adicionar Reserva"
5. Preencha os dados de pagamento
6. Quando perguntado, escolha "Sim" para enviar fatura
7. Verifique o email!

## Alternativas de Email

### Outlook/Hotmail

```
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=seu-email@outlook.com
EMAIL_PASSWORD=sua-senha
```

### SendGrid

1. Registre-se em https://sendgrid.com
2. Crie uma chave de API
3. Configure:

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.sua-chave-sendgrid
```

## Troubleshooting

### "Erro ao conectar ao servidor"

- Verifique se o servidor está a correr (`npm start`)
- Verifique se a porta 3000 está disponível
- Abra http://localhost:3000/api/status no navegador

### "Erro ao enviar fatura"

- Verifique o arquivo `.env` - tem as credenciais corretas?
- Se usa Gmail, confirmou que habilitou as Senhas de App?
- Verifique o console do servidor para detalhes do erro

### "Falha na autenticação"

- Email ou senha incorretos em `.env`
- Algumas contas de email precisam de configuração adicional
- Tente usar um email diferente ou serviço diferente (SendGrid)

## Estrutura de Ficheiros

```
food-delivery-boxes/
├── index.html          # Interface web
├── script.js           # Lógica frontend + chamadas ao servidor
├── styles.css          # Estilos
├── server.js           # Servidor Node.js (NOVO)
├── package.json        # Dependências npm (EDITADO)
├── .env                # Credenciais (crie a partir do .env.example)
└── .env.example        # Modelo de configuração
```

## Funcionalidade

Após pagamento bem-sucedido:

1. **Pergunta**: "Deseja enviar a fatura por email?"
   - Se **SIM** → próxima pergunta
   - Se **NÃO** → apenas mostra confirmação

2. **Pergunta**: "Deseja enviar com NIF?"
   - Se **OK** → pede NIF do cliente
   - Se **Cancelar** → envia sem NIF

3. **Envio**: Fatura formatada e bonita é enviada para o email

## Estrutura do Email Enviado

A fatura inclui:

- Informações da encomenda
- Data da compra
- Email do cliente
- Número de dias e quantidade
- NIF (se fornecido)
- Todas as datas de entrega
- Preço unitário, desconto, total
- Observações

## Desenvolvimento

Para usar o modo "watch" (reinicia automaticamente ao mudar ficheiros):

```bash
npm run dev
```

## Segurança

⚠️ **IMPORTANTE**:

- Nunca coloque o `.env` real no Git
- O `.env` já está no `.gitignore`
- Senhas de app são específicas e temporárias
- Considere usar variáveis de ambiente do servidor em produção

## Suporte

Se tiver problemas:

1. Verifique o console do servidor (terminal)
2. Verifique a console do navegador (F12)
3. Confirme que o .env tem credenciais corretas
4. Teste com http://localhost:3000/api/status
