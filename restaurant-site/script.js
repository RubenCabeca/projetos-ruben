// ===== DADOS DE EXEMPLO =====
const instituicoes = {};
const clientesNormais = {};
const reservas = {};
let usuarioAtual = null;
let tipoUsuarioAtual = null; // 'instituicao' ou 'cliente-normal'
let modoVisitante = false;

// ===== LOCALSTORAGE =====
function guardarInstituicoes() {
    localStorage.setItem('foodbox_instituicoes', JSON.stringify(instituicoes));
}

function carregarInstituicoes() {
    const dados = localStorage.getItem('foodbox_instituicoes');
    if (dados) {
        try {
            Object.assign(instituicoes, JSON.parse(dados));
        } catch (e) {
            console.log('Erro ao carregar instituições');
        }
    }
}

function guardarClientesNormais() {
    localStorage.setItem('foodbox_clientes_normais', JSON.stringify(clientesNormais));
}

function carregarClientesNormais() {
    const dados = localStorage.getItem('foodbox_clientes_normais');
    if (dados) {
        try {
            Object.assign(clientesNormais, JSON.parse(dados));
        } catch (e) {
            console.log('Erro ao carregar clientes normais');
        }
    }
}

function guardarReservas() {
    localStorage.setItem('foodbox_reservas', JSON.stringify(reservas));
}

function carregarReservas() {
    const dados = localStorage.getItem('foodbox_reservas');
    if (dados) {
        try {
            Object.assign(reservas, JSON.parse(dados));
        } catch (e) {
            console.log('Erro ao carregar reservas');
        }
    }
}

// Tabela de descontos
const descontos = [
    { min: 1, max: 10, preco: 9.00, desconto: 0 },
    { min: 11, max: 25, preco: 8.55, desconto: 5 },
    { min: 26, max: 50, preco: 8.10, desconto: 10 },
    { min: 51, max: 100, preco: 7.65, desconto: 15 },
    { min: 101, max: Infinity, preco: 6.75, desconto: 25 }
];

// ===== MODAL ACESSO =====
let loginTipoAtual = null; // guarda se vamos logar instituicao ou cliente
function abrirLoginModal(tipo) {
    loginTipoAtual = tipo;

    // Fechar modal de acesso
    document.getElementById('modal-acesso').style.display = 'none';
    
    // Atualizar título do modal de login conforme tipo
    const loginModal = document.getElementById('modal-login');
    if (loginModal) {
        const titulo = loginModal.querySelector('h3');
        if (titulo) {
            titulo.textContent = tipo === 'cliente-normal' ? 'Acesso de Cliente Normal' : 'Acesso de Instituição';
        }
        // também atualizar texto do label de email
        const emailLabel = loginModal.querySelector('label[for="email-login"]');
        if (emailLabel) {
            emailLabel.textContent = tipo === 'cliente-normal' ? 'Email do Cliente *' : 'Email da Instituição *';
        }

        // Ajustar handler do formulário
        const form = loginModal.querySelector('form');
        if (form) {
            if (tipo === 'cliente-normal') {
                form.onsubmit = fazerLoginDaSecao;
            } else {
                form.onsubmit = fazerLogin;
            }
            // limpar campos
            form.reset();
        }

        loginModal.classList.add('active');
    }
}

function voltarParaAcesso() {
    document.getElementById('modal-acesso').style.display = 'flex';
    document.getElementById('modal-login').classList.remove('active');
    document.getElementById('email-login').value = '';
    document.getElementById('password-login').value = '';
}

// ===== FUNÇÕES CLIENTE NORMAL =====
// button earlier routed to registration; now open login like instituição
function abrirFormClienteNormal() {
    abrirLoginModal();
}

function registarClienteNormal(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-cliente').value;
    const nif = document.getElementById('nif-cliente').value;
    const email = document.getElementById('email-cliente').value;
    const telefone = document.getElementById('telefone-cliente').value;
    const password = document.getElementById('password-cliente').value;

    // Validação básica
    if (!nome || !nif || !email || !telefone || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Validar NIF (deve ter 9 dígitos)
    if (!/^\d{9}$/.test(nif)) {
        alert('NIF inválido. Deve conter 9 dígitos.');
        return;
    }

    // Criar ID único para o cliente
    const idCliente = email.replace('@', '_').replace('.', '_');

    // Verificar se email já existe
    for (let id in clientesNormais) {
        if (clientesNormais[id].email === email) {
            alert('Este email já está registado. Por favor, use outro email.');
            return;
        }
    }

    // Guardar dados
    clientesNormais[idCliente] = {
        id: idCliente,
        nome: nome,
        nif: nif,
        email: email,
        telefone: telefone,
        password: password,
        tipo: 'cliente-normal',
        dataRegisto: new Date().toLocaleDateString('pt-PT')
    };

    // Guardar no localStorage
    guardarClientesNormais();

    // Inicializar array de reservas
    if (!reservas[idCliente]) {
        reservas[idCliente] = [];
    }

    // Fazer login automático
    usuarioAtual = idCliente;
    tipoUsuarioAtual = 'cliente-normal';
    modoVisitante = false;

    // Guardar reservas
    guardarReservas();

    // Limpar formulário
    document.getElementById('nome-cliente').value = '';
    document.getElementById('nif-cliente').value = '';
    document.getElementById('email-cliente').value = '';
    document.getElementById('telefone-cliente').value = '';
    document.getElementById('password-cliente').value = '';

    // Mostrar área de reservas - ir para tab de reservas
    const inscricaoSection = document.getElementById('inscricao');
    if (inscricaoSection) {
        inscricaoSection.classList.remove('hidden');
    }
    
    mostrarAreaReservasClienteNormal();
    atualizarBotaoSair();
    
    alert(`Bem-vindo ${nome}! Sua conta foi criada com sucesso.`);
}

// ==== ACCOUNT DROPDOWN BEHAVIOR ====
// toggle visibility of login/register links when the arrow is clicked
function setupAccountDropdown() {
    const btn = document.querySelector('.dropbtn');
    const content = document.querySelector('.dropdown-content');
    if (!btn || !content) return;

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        content.classList.toggle('show');
        btn.textContent = content.classList.contains('show') ? 'Conta ▲' : 'Conta ▼';
    });

    // close when clicking outside
    document.addEventListener('click', function(e) {
        if (!btn.contains(e.target) && !content.contains(e.target)) {
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                btn.textContent = 'Conta ▼';
            }
        }
    });
}

// function used when selecting account type
function selectAccountType(tab) {
    // show tabs row again and activate the "Criar Conta" button
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) tabsContainer.style.display = 'flex';
    const createBtn = document.querySelector('.tab-button[onclick*="choose-account"]');
    if (createBtn) {
        createBtn.classList.add('active');
    }
    switchTab(tab);
}

// run setup after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupAccountDropdown();
    });
} else {
    setupAccountDropdown();
}

function continuarComoVisitante() {
    // renamed semânticamente para "não tenho conta" - mostrar escolha de registo
    modoVisitante = false;
    document.getElementById('modal-acesso').style.display = 'none';
    
    // Mostrar secção de inscrição para criar conta
    const inscricaoSection = document.getElementById('inscricao');
    if (inscricaoSection) {
        inscricaoSection.classList.remove('hidden');
    }
    switchTabDirect('choose-account');
}

function fazerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    // Validação de email e password em instituições
    let encontrado = false;
    for (let id in instituicoes) {
        if (instituicoes[id].email === email && instituicoes[id].password === password) {
            encontrado = true;
            usuarioAtual = id;
            tipoUsuarioAtual = 'instituicao';
            modoVisitante = false;
            break;
        }
    }

    if (encontrado) {
        document.getElementById('modal-login').classList.remove('active');
        document.getElementById('email-login').value = '';
        document.getElementById('password-login').value = '';
        
        // Ocultar secção de inscrição após login
        const inscricaoSection = document.getElementById('inscricao');
        const registroForm = document.getElementById('registro');
        const tabsSection = inscricaoSection.querySelector('.tabs');
        if (tabsSection) tabsSection.style.display = 'none';
        if (registroForm) registroForm.style.display = 'none';
        
        mostrarAreaReservas();
        atualizarBotaoSair();
        alert('Login realizado com sucesso!');
    } else {
        alert('Email ou password inválidos. Por favor, tente novamente.');
    }
}

function fazerLoginDaSecao(event) {
    event.preventDefault();

    // Determinar campos corretos com base no form que disparou o submit.
    const form = event.currentTarget || event.target;
    const emailField =
        (form && form.querySelector('input[type="email"]')) ||
        document.getElementById('email-login-secao') ||
        document.getElementById('email-login');
    const passField =
        (form && form.querySelector('input[type="password"]')) ||
        document.getElementById('password-login-secao') ||
        document.getElementById('password-login');
    const email = emailField ? emailField.value.trim() : '';
    const password = passField ? passField.value : '';

    // Validação de email e password em clientes normais
    let encontrado = false;
    let tipo = null;
    
    for (let id in clientesNormais) {
        if (clientesNormais[id].email === email && clientesNormais[id].password === password) {
            encontrado = true;
            usuarioAtual = id;
            tipoUsuarioAtual = 'cliente-normal';
            tipo = 'cliente-normal';
            modoVisitante = false;
            break;
        }
    }

    // Se não encontrou em clientes normais, procura em instituições
    if (!encontrado) {
        for (let id in instituicoes) {
            if (instituicoes[id].email === email && instituicoes[id].password === password) {
                encontrado = true;
                usuarioAtual = id;
                tipoUsuarioAtual = 'instituicao';
                tipo = 'instituicao';
                modoVisitante = false;
                break;
            }
        }
    }

    if (encontrado) {
        if (emailField) emailField.value = '';
        if (passField) passField.value = '';

        // Se o login veio do modal, fechá-lo
        const modalLogin = form && form.closest ? form.closest('#modal-login') : null;
        if (modalLogin) {
            modalLogin.classList.remove('active');
        }
        
        // Ir para aba de reservas
        if (tipo === 'cliente-normal') {
            mostrarAreaReservasClienteNormal();
        } else if (tipo === 'instituicao') {
            mostrarAreaReservasInstituicao();
        }
        
        atualizarBotaoSair();
        alert('Login realizado com sucesso!');
    } else {
        alert('Email ou password inválidos. Por favor, tente novamente.');
    }
}

function fazerLogout() {
    usuarioAtual = null;
    tipoUsuarioAtual = null;
    modoVisitante = false;
    
    // Restaurar secções de informação
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('como-funciona').classList.remove('hidden');
    document.getElementById('tabela-precos').classList.remove('hidden');
    document.getElementById('inscricao').classList.remove('hidden');
    
    atualizarBotaoSair();
    
    // Recarregar a página para voltar ao estado inicial
    location.reload();
}

function atualizarBotaoSair() {
    const btnSair = document.getElementById('btn-sair');
    if (usuarioAtual && (tipoUsuarioAtual === 'instituicao' || tipoUsuarioAtual === 'cliente-normal')) {
        btnSair.style.display = 'block';
    } else {
        btnSair.style.display = 'none';
    }
}

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function switchTab(tabName) {
    // show tabs container by default
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) tabsContainer.style.display = 'flex';

    // Ocultar todos os tabs
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Remover active de todos os botões
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar o tab selecionado
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        selectedTab.style.display = 'block';
    }

    // Ativar o botão correto
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function switchTabDirect(tabName) {
    // if showing choice, hide tab row
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) {
        if (tabName === 'choose-account') {
            tabsContainer.style.display = 'none';
        } else {
            tabsContainer.style.display = 'flex';
        }
    }

    // Ocultar todos os tabs
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Remover active de todos os botões
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar o tab selecionado
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        selectedTab.style.display = 'block';
    }

    // Ativar o botão correto pelo data-id
    const targetButton = document.querySelector(`.tab-button[onclick*="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Se o utilizador está autenticado
        if (usuarioAtual && !modoVisitante) {
            // Esconder todas as secções principais
            document.getElementById('home').classList.add('hidden');
            document.getElementById('como-funciona').classList.add('hidden');
            document.getElementById('tabela-precos').classList.add('hidden');
            
            // Se é a secção de inscrição (marcar refeições), mostrar
            if (sectionId === 'inscricao') {
                document.getElementById('inscricao').classList.remove('hidden');
                if (tipoUsuarioAtual === 'cliente-normal') {
                    mostrarAreaReservasClienteNormal();
                } else if (tipoUsuarioAtual === 'instituicao') {
                    mostrarAreaReservasInstituicao();
                } else {
                    mostrarAreaReservas();
                }
            } else {
                // Mostrar a secção solicitada
                element.classList.remove('hidden');
            }
        } else if (modoVisitante) {
            // Modo visitante: mostrar secção de inscrição com formulário
            if (sectionId === 'inscricao') {
                element.classList.remove('hidden');
                switchTabDirect('choose-account');
            } else {
                element.classList.remove('hidden');
            }
        }
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== FUNÇÕES DE REGISTO =====
function obterNumPessoasPorTipo(tipo) {
    const pessoasPorTipo = {
        'escola-primaria': 100,
        'escola-secundaria': 200,
        'universidade': 500,
        'instituto': 300
    };
    return pessoasPorTipo[tipo] || 100;
}

function registarInstituicao(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-instituicao').value;
    const tipo = document.getElementById('tipo-instituicao').value;
    const numPessoas = obterNumPessoasPorTipo(tipo);
    const email = document.getElementById('email-instituicao').value;
    const password = document.getElementById('password-instituicao').value;
    const telefone = document.getElementById('telefone-instituicao').value;
    const rua = document.getElementById('rua-instituicao').value;
    const cidade = document.getElementById('cidade-instituicao').value;
    const codigoPostal = document.getElementById('codigo-postal-instituicao').value;

    // Validação básica
    if (!nome || !tipo || !email || !password || !telefone || !rua || !cidade || !codigoPostal) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Validar formato de código postal
    if (!/^\d{4}-\d{3}$/.test(codigoPostal)) {
        alert('Formato de código postal inválido. Use o formato: 1000-001');
        return;
    }

    // Criar ID único para a instituição
    const idInstituicao = email.replace('@', '_').replace('.', '_');

    // Verificar se email já existe
    for (let id in instituicoes) {
        if (instituicoes[id].email === email) {
            alert('Este email já está registado. Por favor, use outro email.');
            return;
        }
    }

    // Guardar dados
    instituicoes[idInstituicao] = {
        id: idInstituicao,
        nome: nome,
        tipo: tipo,
        email: email,
        password: password,
        telefone: telefone,
        morada: {
            rua: rua,
            cidade: cidade,
            codigoPostal: codigoPostal
        },
        numPessoas: numPessoas,
        dataRegisto: new Date().toLocaleDateString('pt-PT')
    };

    // Guardar no localStorage
    guardarInstituicoes();

    // Inicializar array de reservas
    if (!reservas[idInstituicao]) {
        reservas[idInstituicao] = [];
    }
    guardarReservas();

    // Fazer login automático
    usuarioAtual = idInstituicao;
    tipoUsuarioAtual = 'instituicao';
    modoVisitante = false;

    // Limpar formulário
    document.getElementById('nome-instituicao').value = '';
    document.getElementById('tipo-instituicao').value = '';
    document.getElementById('email-instituicao').value = '';
    document.getElementById('password-instituicao').value = '';
    document.getElementById('telefone-instituicao').value = '';
    document.getElementById('rua-instituicao').value = '';
    document.getElementById('cidade-instituicao').value = '';
    document.getElementById('codigo-postal-instituicao').value = '';

    // Mostrar área de reservas - ir para tab de reservas
    const inscricaoSection = document.getElementById('inscricao');
    if (inscricaoSection) {
        inscricaoSection.classList.remove('hidden');
    }

    mostrarAreaReservasInstituicao();
    atualizarBotaoSair();
    
    alert(`Instituição "${nome}" registada com sucesso!`);
}

// ===== FUNÇÕES DE LOGIN =====
document.addEventListener('DOMContentLoaded', function() {
    // Carregar instituições do localStorage
    carregarInstituicoes();
    // Carregar clientes normais do localStorage
    carregarClientesNormais();
    // Carregar reservas do localStorage
    carregarReservas();
    // Carregar dados de exemplo
    carregarExemlos();
    // Inicializar modal de acesso
    atualizarBotaoSair();
});

function mostrarAreaReservas() {
    const inscricaoSection = document.getElementById('inscricao');
    
    // Esconder secções de informação
    document.getElementById('home').classList.add('hidden');
    document.getElementById('como-funciona').classList.add('hidden');
    document.getElementById('tabela-precos').classList.add('hidden');
    
    // Garantir que a secção de inscrição é visível para utilizadores autenticados
    if (inscricaoSection) {
        inscricaoSection.classList.remove('hidden');
    }

    // Atualizar informações do utilizador
    if (usuarioAtual && instituicoes[usuarioAtual]) {
        const instituicao = instituicoes[usuarioAtual];
        const heading = inscricaoSection.querySelector('h2');
        heading.textContent = `Marcar Refeições - ${instituicao.nome}`;

        // Mostrar tab de reservas
        const tabReservas = document.getElementById('tab-reservas');
        if (tabReservas) {
            tabReservas.style.display = 'inline-block';
        }

        // Ir automaticamente para a aba de reservas
        switchTabDirect('lista-reservas');
    }

    // Renderizar reservas existentes
    renderizarReservas();
}

function mostrarAreaReservasClienteNormal() {
    const inscricaoSection = document.getElementById('inscricao');
    
    // Esconder secções de informação
    document.getElementById('home').classList.add('hidden');
    document.getElementById('como-funciona').classList.add('hidden');
    document.getElementById('tabela-precos').classList.add('hidden');
    
    // Garantir que a secção de inscrição é visível
    if (inscricaoSection) {
        inscricaoSection.classList.remove('hidden');
    }

    // Atualizar informações do utilizador (cliente normal)
    if (usuarioAtual && clientesNormais[usuarioAtual]) {
        const cliente = clientesNormais[usuarioAtual];
        const heading = inscricaoSection.querySelector('h2');
        heading.textContent = `Minhas Refeições - ${cliente.nome}`;

        // Mostrar tab de reservas
        const tabReservas = document.getElementById('tab-reservas');
        if (tabReservas) {
            tabReservas.style.display = 'inline-block';
        }

        // Ir automaticamente para a aba de reservas
        switchTabDirect('lista-reservas');
    }

    // Renderizar reservas existentes
    renderizarReservas();
}

function mostrarAreaReservasInstituicao() {
    const inscricaoSection = document.getElementById('inscricao');
    
    // Esconder secções de informação
    document.getElementById('home').classList.add('hidden');
    document.getElementById('como-funciona').classList.add('hidden');
    document.getElementById('tabela-precos').classList.add('hidden');
    
    // Garantir que a secção de inscrição é visível
    if (inscricaoSection) {
        inscricaoSection.classList.remove('hidden');
    }

    // Atualizar informações do utilizador (instituição)
    if (usuarioAtual && instituicoes[usuarioAtual]) {
        const instituicao = instituicoes[usuarioAtual];
        const heading = inscricaoSection.querySelector('h2');
        heading.textContent = `Marcar Refeições - ${instituicao.nome}`;

        // Mostrar tab de reservas
        const tabReservas = document.getElementById('tab-reservas');
        if (tabReservas) {
            tabReservas.style.display = 'inline-block';
        }

        // Ir automaticamente para a aba de reservas
        switchTabDirect('lista-reservas');
    }

    // Renderizar reservas existentes
    renderizarReservas();
}

// ===== CALCULAR DESCONTO =====
function obterDescontoParaNumero(numRefeicoes) {
    // Todos (instituições e clientes normais) têm desconto baseado no número de refeições encomendadas
    for (let i = 0; i < descontos.length; i++) {
        if (numRefeicoes >= descontos[i].min && numRefeicoes <= descontos[i].max) {
            return descontos[i];
        }
    }
    return descontos[descontos.length - 1];
}

// ===== ATUALIZAR PREÇO E DESCONTOS =====
function atualizarPrecoDescontos(numRefeicoes) {
    const desconto = obterDescontoParaNumero(numRefeicoes);
    
    document.getElementById('preco-unitario').textContent = `€${desconto.preco.toFixed(2)}`;
    document.getElementById('desconto-aplicado').textContent = `-${desconto.desconto}%`;

    // Atualizar total
    if (numRefeicoes > 0) {
        const total = numRefeicoes * desconto.preco;
        document.getElementById('total-preco').textContent = `€${total.toFixed(2)}`;
    } else {
        document.getElementById('total-preco').textContent = `€0.00`;
    }
}

function atualizarPrecoDescontosClienteNormal(numRefeicoes) {
    // Clientes normais têm o mesmo desconto que instituições, baseado no número de refeições
    const desconto = obterDescontoParaNumero(numRefeicoes);
    
    document.getElementById('preco-unitario').textContent = `€${desconto.preco.toFixed(2)}`;
    document.getElementById('desconto-aplicado').textContent = `-${desconto.desconto}%`;

    // Atualizar total
    if (numRefeicoes > 0) {
        const total = numRefeicoes * desconto.preco;
        document.getElementById('total-preco').textContent = `€${total.toFixed(2)}`;
    } else {
        document.getElementById('total-preco').textContent = `€0.00`;
    }
}

// Variable to store pending reservation data
let reservaPendente = null;

// ===== ADICIONAR RESERVA =====
// ===== GESTÃO DE DATAS SELECIONADAS =====

let datasReservaSelecionadas = []; // Array para armazenar datas selecionadas

function adicionarData() {
    const inputData = document.getElementById('nova-data').value;
    
    if (!inputData) {
        alert('Por favor, selecione uma data');
        return;
    }

    const data = new Date(inputData);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);

    // Validar se a data é no futuro
    if (data < hoje) {
        alert('A data deve ser no futuro');
        return;
    }

    // Validar se está dentro de 14 dias
    const umDia = 24 * 60 * 60 * 1000;
    const diasDiferenca = Math.floor((data - hoje) / umDia);
    if (diasDiferenca > 14) {
        alert('A data deve estar dentro dos próximos 14 dias');
        return;
    }

    // Verificar se a data já foi adicionada
    if (datasReservaSelecionadas.some(d => new Date(d).getTime() === data.getTime())) {
        alert('Esta data já foi adicionada');
        return;
    }

    // Adicionar à array e ordenar
    datasReservaSelecionadas.push(inputData);
    datasReservaSelecionadas.sort();

    // Limpar input
    document.getElementById('nova-data').value = '';

    // Renderizar datas
    renderizarDatas();
}

function removerData(data) {
    datasReservaSelecionadas = datasReservaSelecionadas.filter(d => d !== data);
    renderizarDatas();
}

function renderizarDatas() {
    const container = document.getElementById('datas-selecionadas');
    
    if (datasReservaSelecionadas.length === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 0.9em;">Nenhuma data selecionada</p>';
        return;
    }

    container.innerHTML = datasReservaSelecionadas.map(data => {
        const dataObj = new Date(data);
        const dataFormatada = dataObj.toLocaleDateString('pt-PT');
        return `
            <div class="data-badge">
                📅 ${dataFormatada}
                <button type="button" onclick="removerData('${data}')">✕</button>
            </div>
        `;
    }).join('');
}

// ===== ADICIONAR RESERVA =====
function adicionarReserva() {
    if (!usuarioAtual) {
        alert('Por favor, faça login primeiro');
        return;
    }

    if (datasReservaSelecionadas.length === 0) {
        alert('Por favor, selecione pelo menos uma data');
        return;
    }

    const numCaixas = parseInt(document.getElementById('num-caixas').value);
    const vegetariana = document.getElementById('refeicao-vegetariana').checked;
    const semGluten = document.getElementById('refeicao-sem-gluten').checked;
    const observacoes = document.getElementById('refeicao-observacoes').value;

    if (!numCaixas || numCaixas <= 0) {
        alert('Por favor, preencha a quantidade de caixas');
        return;
    }

    const descontoObj = obterDescontoParaNumero(numCaixas);
    const precoUnit = descontoObj.preco;
    const desconto = descontoObj.desconto;
    const totalPorDia = numCaixas * precoUnit;
    const totalTotal = totalPorDia * datasReservaSelecionadas.length;

    // Guardar dados da reserva pendente
    reservaPendente = {
        datas: datasReservaSelecionadas.slice(), // Cópia do array
        numCaixas: numCaixas,
        vegetariana: vegetariana,
        semGluten: semGluten,
        observacoes: observacoes,
        numeroDias: datasReservaSelecionadas.length,
        precoUnit: precoUnit,
        desconto: desconto,
        totalPorDia: totalPorDia,
        totalTotal: totalTotal
    };

    // Mostrar modal de pagamento
    mostraModalPagamento(datasReservaSelecionadas.length, totalTotal);
}

// ===== MODAL DE PAGAMENTO =====
function mostraModalPagamento(dias, total) {
    // Limpar campos de pagamento
    document.getElementById('pagamento-nome').value = '';
    document.getElementById('pagamento-cartao').value = '';

    // Preencher resumo
    document.getElementById('resumo-dias').textContent = `${dias} dia${dias > 1 ? 's' : ''}`;
    document.getElementById('resumo-total').textContent = `€${total.toFixed(2)}`;

    // Mostrar modal
    const modal = document.getElementById('modal-pagamento');
    modal.style.display = 'flex';
}

function cancelarPagamento() {
    // Fechar modal
    document.getElementById('modal-pagamento').style.display = 'none';
    reservaPendente = null;
}

// ===== ENVIAR FATURA POR EMAIL =====
function enviarFaturaPorEmail(dados) {
    // Mostrar indicador de carregamento
    const indicador = document.createElement('div');
    indicador.id = 'indicador-envio';
    indicador.innerHTML = '📧 Enviando fatura para email...';
    indicador.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #2ecc71;
        color: white;
        padding: 20px 40px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(indicador);

    // Definir base da API:
    // - Pode forçar definindo `window.__API_BASE__` no HTML antes do script (útil para ngrok / deploy externo).
    // - Se o frontend estiver a correr num servidor (por exemplo Live Server em 5500), tenta usar o mesmo host com porta 3000.
    // - Se for acesso local (localhost / 127.0.0.1) mantém localhost:3000.
    // - Para deploy em produção, usa a mesma origem do site.
    const API_BASE = (() => {
        if (window.__API_BASE__) {
            return window.__API_BASE__;
        }

        const host = window.location.hostname;
        const port = window.location.port;

        // Se estiver a correr como ficheiro local (file://) ou em localhost, mantém o backend em localhost:3000
        if (!host || host === 'localhost' || host === '127.0.0.1') {
            return 'http://localhost:3000';
        }

        // Se o frontend estiver num porto diferente (ex: Live Server 5500) assume backend no mesmo host, porta 3000
        if (port && port !== '3000') {
            return `${window.location.protocol}//${host}:3000`;
        }

        // Caso normal (mesma origem)
        return window.location.origin;
    })();
    // Enviar POST request ao servidor
    fetch(`${API_BASE}/api/enviar-fatura`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(resultado => {
        // Remover indicador
        const ind = document.getElementById('indicador-envio');
        if (ind) ind.remove();

        if (resultado.sucesso) {
            let mensagem = `✅ Sucesso!\n\n${resultado.mensagem}\n\nFatura foi enviada para ${dados.email} com todos os detalhes da sua encomenda.`;
            
            // Se tiver URL de preview (modo teste), adicionar link
            if (resultado.previewUrl) {
                mensagem += `\n\n--- MODO TESTE ---\nVer fatura em navegador:\n${resultado.previewUrl}`;
                alert(mensagem);
                // Abrir preview automaticamente
                window.open(resultado.previewUrl, '_blank');
            } else {
                alert(mensagem);
            }
        } else {
            alert(`❌ Erro ao enviar fatura:\n\n${resultado.mensagem}`);
        }
    })
    .catch(erro => {
        // Remover indicador
        const ind = document.getElementById('indicador-envio');
        if (ind) ind.remove();

        console.error('Erro na requisição:', erro);
        alert(`❌ Erro ao conectar ao servidor:\n\n${erro.message}\n\nCertifique-se que o servidor Node.js está a correr (npm start)`);
    });
}

function processarPagamento(event) {
    event.preventDefault();

    if (!reservaPendente) {
        alert('Erro: Dados da reserva não encontrados');
        return;
    }

    const nome = document.getElementById('pagamento-nome').value.trim();
    const cartao = document.getElementById('pagamento-cartao').value.trim();

    if (!nome || !cartao) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Validar nome (mínimo 3 caracteres)
    if (nome.length < 3) {
        alert('Nome deve ter no mínimo 3 caracteres');
        return;
    }

    // Validar cartão (apenas números, 13-19 dígitos)
    const cartaoLimpo = cartao.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cartaoLimpo)) {
        alert('Número de cartão inválido');
        return;
    }

    // Criar as reservas
    if (!reservas[usuarioAtual]) {
        reservas[usuarioAtual] = [];
    }

    // Iterar sobre cada data selecionada e criar uma reserva
    reservaPendente.datas.forEach((dataSelecionada, index) => {
        const reserva = {
            id: Date.now() + index,
            data: dataSelecionada,
            numCaixas: reservaPendente.numCaixas,
            precoUnit: reservaPendente.precoUnit,
            total: reservaPendente.totalPorDia,
            desconto: reservaPendente.desconto,
            vegetariana: reservaPendente.vegetariana,
            semGluten: reservaPendente.semGluten,
            observacoes: reservaPendente.observacoes,
            pagamento: {
                nome: nome,
                cartaoOcultado: '**** **** **** ' + cartaoLimpo.slice(-4),
                data: new Date().toLocaleDateString('pt-PT')
            }
        };

        reservas[usuarioAtual].push(reserva);
    });

    // Guardar no localStorage
    guardarReservas();

    // Guardar informações para o email antes de limpar
    const numDias = datasReservaSelecionadas.length;
    const totalFatura = reservaPendente.totalTotal;
    const datasParaFatura = datasReservaSelecionadas.slice();

    // Fechar modal
    document.getElementById('modal-pagamento').style.display = 'none';

    // Limpar inputs do formulário de reserva
    datasReservaSelecionadas = [];
    document.getElementById('nova-data').value = '';
    document.getElementById('num-caixas').value = '';
    document.getElementById('refeicao-vegetariana').checked = false;
    document.getElementById('refeicao-sem-gluten').checked = false;
    document.getElementById('refeicao-observacoes').value = '';
    renderizarDatas();

    // Limpar dados pendente
    reservaPendente = null;

    // Renderizar
    renderizarReservas();

    // Fluxo de envio de fatura por email
    setTimeout(() => {
        const enviarFatura = confirm('Deseja enviar a fatura por email?');
        
        if (enviarFatura) {
            const comNIF = confirm('Deseja enviar a fatura com NIF?\n\nClique OK para enviar com NIF\nClique Cancelar para enviar sem NIF');
            
            let nif = null;
            if (comNIF) {
                nif = prompt('Por favor, insira o seu NIF:');
                if (nif === null) {
                    // Utilizador cancelou
                    return;
                }
                if (!nif.trim()) {
                    alert('NIF inválido. Fatura não foi enviada.');
                    return;
                }
            }
            
            // Obter email do utilizador
            let emailCliente = null;
            if (tipoUsuarioAtual === 'instituicao' && instituicoes[usuarioAtual]) {
                emailCliente = instituicoes[usuarioAtual].email;
            } else if (tipoUsuarioAtual === 'cliente-normal' && clientesNormais[usuarioAtual]) {
                emailCliente = clientesNormais[usuarioAtual].email;
            }
            
            if (emailCliente) {
                // Enviar fatura por email para o servidor
                enviarFaturaPorEmail({
                    email: emailCliente,
                    datas: datasParaFatura,
                    numDias: numDias,
                    numCaixas: reservaPendente ? reservaPendente.numCaixas : 0,
                    precoUnitario: reservaPendente ? reservaPendente.precoUnit : 0,
                    totalPorDia: reservaPendente ? reservaPendente.totalPorDia : 0,
                    desconto: reservaPendente ? reservaPendente.desconto : 0,
                    observacoes: reservaPendente ? reservaPendente.observacoes : '',
                    totalFatura: totalFatura,
                    nif: nif
                });
            } else {
                alert('Erro ao obter email do cliente. Fatura não foi enviada.');
            }
        } else {
            alert('Pagamento processado com sucesso!\n\nReserva de múltiplos dias criada.');
        }
    }, 300);
}

// ===== RENDERIZAR RESERVAS =====
function renderizarReservas() {
    if (!usuarioAtual || !reservas[usuarioAtual]) {
        return;
    }

    const tbody = document.getElementById('reservas-list');
    tbody.innerHTML = '';

    const reservasDoUsuario = reservas[usuarioAtual];

    if (reservasDoUsuario.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhuma reserva ainda. Adicione uma para começar!</td></tr>';
        document.getElementById('total-preco').textContent = '€0.00';
        return;
    }

    let totalGeral = 0;

    reservasDoUsuario.forEach(reserva => {
        const dataFormatada = new Date(reserva.data).toLocaleDateString('pt-PT');
        totalGeral += reserva.total;

        // Criar labels para opções especiais
        let opcoesEspeciais = '';
        if (reserva.vegetariana) opcoesEspeciais += '🥗 Vegetariana ';
        if (reserva.semGluten) opcoesEspeciais += '🌾 Sem Glúten';
        
        let observacoesTexto = reserva.observacoes ? `<br><small style="color: #666;">📝 ${reserva.observacoes}</small>` : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${dataFormatada}
                ${opcoesEspeciais ? '<br><small style="color: #27ae60; font-weight: bold;">' + opcoesEspeciais + '</small>' : ''}
                ${observacoesTexto}
            </td>
            <td>${reserva.numCaixas}</td>
            <td>€${reserva.precoUnit.toFixed(2)}</td>
            <td>€${reserva.total.toFixed(2)}</td>
            <td><button class="btn-delete" onclick="removerReserva(${reserva.id})">Remover</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('total-preco').textContent = `€${totalGeral.toFixed(2)}`;
}

// ===== REMOVER RESERVA =====
function removerReserva(reservaId) {
    if (!usuarioAtual) {
        return;
    }

    const index = reservas[usuarioAtual].findIndex(r => r.id === reservaId);
    if (index > -1) {
        reservas[usuarioAtual].splice(index, 1);
        // Guardar no localStorage
        guardarReservas();
        renderizarReservas();
        alert('Reserva removida com sucesso!');
    }
}

// ===== LISTENER PARA NÚMERO DE CAIXAS =====
document.addEventListener('DOMContentLoaded', function() {
    const inputCaixas = document.getElementById('num-caixas');
    if (inputCaixas) {
        inputCaixas.addEventListener('input', function() {
            const numRefeicoes = parseInt(this.value) || 0;
            // Todos usam a mesma função agora (desconto baseado em número de refeições)
            atualizarPrecoDescontos(numRefeicoes);
        });
    }
});

// ===== EXEMPLOS DE DADOS (para teste) =====
function carregarExemlos() {
    // Se já existem instituições no localStorage, não adicionar exemplo
    if (Object.keys(instituicoes).length > 0) {
        return;
    }
    
    // Pré-carregar algumas instituições para teste
    instituicoes['escola_teste@gmail.com'] = {
        id: 'escola_teste@gmail.com',
        nome: 'Escola Teste',
        tipo: 'escola-secundaria',
        email: 'escola@teste.pt',
        password: '123456',
        telefone: '912345678',
        morada: {
            rua: 'Rua da Escola, 42',
            cidade: 'Lisboa',
            codigoPostal: '1000-001'
        },
        numPessoas: 50,
        dataRegisto: new Date().toLocaleDateString('pt-PT')
    };
}

// Carregar dados de exemplo ao iniciar
carregarExemlos();
