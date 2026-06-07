const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Configuração do email
let transporter;

// Função para inicializar o transporter (pode ser Ethereal para testes ou real)
async function inicializarTransporter() {
    // Se tiver credenciais reais no .env, usar essas
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'seu-email-aqui@gmail.com') {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        console.log('📧 Usando email real: ' + process.env.EMAIL_USER);
    } else {
        // Usar Ethereal Email de teste (gratuito)
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('\n📧 MODO TESTE - Usando Ethereal Email (gratuito)');
        console.log('   Credenciais: ' + testAccount.user + ' / ' + testAccount.pass);
        console.log('   (Estas mudam cada vez que o servidor reinicia)\n');
    }
}

// Função para gerar HTML da fatura
function gerarHTMLFatura(dados) {
    const datasFormatadas = dados.datas.map(d => {
        const data = new Date(d);
        return data.toLocaleDateString('pt-PT');
    }).join('<br>');

    return `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fatura - FoodBox Delivery</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; color: #333; }
            .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 3px solid #2ecc71; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #2ecc71; font-size: 28px; }
            .header p { margin: 5px 0; color: #666; }
            .section { margin: 20px 0; }
            .section h2 { color: #2ecc71; font-size: 16px; text-transform: uppercase; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .datas-list { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .datas-list p { margin: 5px 0; }
            .total-section { background: #2ecc71; color: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
            .total-section h3 { margin: 0; font-size: 24px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍱 FoodBox Delivery</h1>
                <p>Fatura de Compra</p>
            </div>

            <div class="section">
                <h2>Informações da Encomenda</h2>
                <div class="info-row">
                    <span class="label">Data da Encomenda:</span>
                    <span class="value">${new Date().toLocaleDateString('pt-PT')}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${dados.email}</span>
                </div>
                <div class="info-row">
                    <span class="label">Número de Dias:</span>
                    <span class="value">${dados.numDias}</span>
                </div>
                <div class="info-row">
                    <span class="label">Quantidade por Dia:</span>
                    <span class="value">${dados.numCaixas} caixa(s)</span>
                </div>
                ${dados.nif ? `<div class="info-row">
                    <span class="label">NIF:</span>
                    <span class="value">${dados.nif}</span>
                </div>` : ''}
            </div>

            <div class="section">
                <h2>Datas da Encomenda</h2>
                <div class="datas-list">
                    ${dados.datas.map((d, i) => {
                        const data = new Date(d);
                        return `<p>${i + 1}. ${data.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>`;
                    }).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Detalhes Financeiros</h2>
                <div class="info-row">
                    <span class="label">Preço Unitário:</span>
                    <span class="value">€${parseFloat(dados.precoUnitario).toFixed(2)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Desconto Aplicado:</span>
                    <span class="value">${dados.desconto}%</span>
                </div>
                <div class="info-row">
                    <span class="label">Total por Dia:</span>
                    <span class="value">€${parseFloat(dados.totalPorDia).toFixed(2)}</span>
                </div>
            </div>

            <div class="total-section">
                <p>TOTAL DA ENCOMENDA</p>
                <h3>€${parseFloat(dados.totalFatura).toFixed(2)}</h3>
            </div>

            <div class="section">
                <h2>Observações</h2>
                ${dados.observacoes ? `<p>${dados.observacoes}</p>` : '<p>Nenhuma observação adicionada.</p>'}
            </div>

            <div class="footer">
                <p>Obrigado por escolher FoodBox Delivery!</p>
                <p>Para questões ou alterações, entre em contacto conosco.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Rota para enviar email da fatura
app.post('/api/enviar-fatura', async (req, res) => {
    try {
        const dados = req.body;

        // Validar dados
        if (!dados.email || !dados.datas || !dados.numDias) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Dados incompletos para envio de fatura'
            });
        }

        // Gerar HTML da fatura
        const htmlFatura = gerarHTMLFatura(dados);

        // Opções do email
        const mailOptions = {
            from: process.env.EMAIL_USER && process.env.EMAIL_USER !== 'seu-email-aqui@gmail.com' 
                ? process.env.EMAIL_USER 
                : 'teste@foodbox.pt',
            to: dados.email,
            subject: `Fatura FoodBox Delivery - ${new Date().toLocaleDateString('pt-PT')}`,
            html: htmlFatura
        };

        // Enviar email
        const info = await transporter.sendMail(mailOptions);

        // Se for Ethereal (teste), gerar URL de preview
        const previewUrl = nodemailer.getTestMessageUrl(info);

        res.json({
            sucesso: true,
            mensagem: 'Fatura enviada com sucesso para ' + dados.email,
            previewUrl: previewUrl || null
        });

    } catch (erro) {
        console.error('Erro ao enviar email:', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao enviar fatura: ' + erro.message
        });
    }
});

// Rota para testar conexão
app.get('/api/status', (req, res) => {
    res.json({ status: 'Servidor FoodBox Delivery está funcionando!' });
});

// Iniciar servidor
inicializarTransporter().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🍱 FoodBox Delivery - Servidor iniciado na porta ${PORT}`);
        console.log(`http://localhost:${PORT}\n`);
    });
}).catch(erro => {
    console.error('Erro ao inicializar email:', erro);
    process.exit(1);
});
