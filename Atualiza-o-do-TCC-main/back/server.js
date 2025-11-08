const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Usuário de teste
const usuarioValido = { email: "mimi@gmail.com", senha: "1343" };

// Rota de login
app.post("/api/login", (req, res) => {
    const { email, senha, role } = req.body;

    if (email === usuarioValido.email && senha === usuarioValido.senha) {
        return res.json({ sucesso: true, role, email });
    }
    return res.json({ sucesso: false, mensagem: "Usuário ou senha inválidos!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
