# 🍱 FoodBox - Sistema de Entrega de Refeições

Site para uma empresa de entrega de refeições em pequenas caixas destinadas a escolas e universidades, com sistema de descontos baseado no número de pessoas e gestão de reservas.

## 📋 Características

### 1. **Inscrição de Instituições**
- Formulário de registo simples para escolas e universidades
- Campos: Nome, Tipo de Instituição, Email, Telefone, Cidade, Estimativa de Pessoas par Refeição
- Validação de entrada

### 2. **Sistema de Descontos Escalonados**
- 1-10 pessoas: €9.00 (sem desconto)
- 11-25 pessoas: €8.55 (-5%)
- 26-50 pessoas: €8.10 (-10%)
- 51-100 pessoas: €7.65 (-15%)
- 100+ pessoas: €6.75 (-25%)

### 3. **Gestão de Reservas**
- Sistema de login para instituições registadas
- Adicionar reservas por data
- Cálculo automático de descontos e totais
- Visualizar todas as reservas
- Remover reservas

### 4. **Parcerias**
- Bar de parceria no rodapé com logos das empresas associadas
  - ISTEC
  - Stock Pack
  - Stripe
  - Prozis
  - Cozinca
- Design responsivo e moderno

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura do site
- **CSS3** - Styling responsivo e moderno
- **JavaScript Vanilla** - Interatividade e lógica de negócio

## 📁 Estrutura de Ficheiros

```
food-delivery-boxes/
├── index.html       # Página principal
├── styles.css       # Estilos CSS
├── script.js        # Lógica JavaScript
└── README.md        # Este ficheiro
```

## 🚀 Como Usar

### 1. Abrir o Site
- Abra `index.html` num navegador web
- Ou crie um servidor local:
  ```powershell
  python -m http.server 8000
  ```

### 2. Registar uma Instituição
1. Clique no botão "Registar Instituição" ou vá para a seção "Novo Registo"
2. Preencha os dados da instituição
3. Clique em "Registar Instituição"

### 3. Fazer Login
1. Clique na aba "Entrar"
2. Use o email que usou no registo
3. Qualquer senha (sistema de demonstração)

### 4. Adicionar Reservas
1. Após login, verá a seção "Minhas Reservas"
2. Selecione uma data futura
3. Defina o número de caixas
4. O sistema calcula automaticamente o preço com desconto
5. Clique "Adicionar Reserva"

## 💾 Armazenamento de Dados

**Nota importante:** Este é um site frontend-only. Os dados são armazenados apenas na memória do navegador e são perdidos ao recarregar a página.

Para persistência de dados, seria necessário um backend (Node.js, Python, etc.).

## 🎨 Seções do Site

### Header
- Logo e tagline da empresa
- Menu de navegação

### Hero Section
- Imagem/gradiente atraente
- Chamada para ação principal

### Como Funciona
- 4 passos explicados visualmente
- Cards com hover effects

### Tabela de Preços
- Descontos escalonados
- Fácil de ler e entender

### Inscrição e Reservas
- Sistema de tabs (Login/Registo)
- Formulários e tabela de reservas

### Footer
- Informações de contacto
- Links rápidos
- **Bar de Parceria com ISTEC**

## 📱 Responsividade

O site é totalmente responsivo e funciona bem em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔐 Segurança e Melhorias Futuras

### Para Produção, Seria Necessário:
1. **Backend** - Armazenar dados em base de dados
2. **Autenticação** - Sistema de login seguro com tokens
3. **Email** - Enviar confirmação de pedidos
4. **Pagamento** - Integração com gateway de pagamento
5. **Admin Panel** - Painel para gerir pedidos
6. **API REST** - Para comunicação client-server

## 📧 Contacto

Email: contato@foodbox.pt
Telefone: 912345678

## 📝 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

---

**Desenvolvido para FoodBox - 2024**
