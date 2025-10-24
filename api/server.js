require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// transporte nodemailer (exemplo Gmail; em produção usar serviço apropriado)
const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Twilio client
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// mapa simples em memória para tokens
const resetTokens = new Map();

function generateToken() {
    return Math.random().toString(36).slice(2, 12);
}

app.post('/api/reset-password', async (req, res) => {
    const { contact, method } = req.body; // contact = email ou telefone, method = 'email' | 'sms'
    if (!contact || !method) return res.status(400).json({ error: 'Faltando dados' });

    const token = generateToken();
    // criar link de redefinição (apontar para página que o usuário usará)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5500'}/reset.html?token=${token}`;

    // salvar token temporariamente (em produção, salvar no BD com validade)
    resetTokens.set(token, { contact, created: Date.now() });

    try {
        if (method === 'email') {
            await mailer.sendMail({
                from: process.env.SMTP_USER,
                to: contact,
                subject: 'Redefinição de senha',
                text: `Clique no link para redefinir a senha: ${resetLink}`
            });
            return res.json({ ok: true, method: 'email' });
        } else if (method === 'sms') {
            await twilioClient.messages.create({
                body: `Redefinição de senha: ${resetLink}`,
                from: process.env.TWILIO_NUMBER,
                to: contact
            });
            return res.json({ ok: true, method: 'sms' });
        } else {
            return res.status(400).json({ error: 'Método inválido' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

// endpoint para validar token (exemplo)
app.get('/api/validate-token/:token', (req, res) => {
    const { token } = req.params;
    if (!resetTokens.has(token)) return res.status(404).json({ valid: false });
    // implementar expiração se necessário
    return res.json({ valid: true });
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));