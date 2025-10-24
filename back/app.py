import os
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), 'templates'))

# 🔹 Dicionário de usuários e senhas separados por tipo
usuarios = {
    "Aluno": {"email": "aluno@gmail.com", "senha": "1234"},
    "Professor": {"email": "prof@gmail.com", "senha": "abcd"},
    "Servidor": {"email": "servidor@gmail.com", "senha": "4321"}
}

@app.route("/", methods=["GET", "POST"])
def login():
    mensagem = None
    if request.method == "POST":
        email = request.form.get("email")
        senha = request.form.get("senha")
        role = request.form.get("role")

        # Verifica se o tipo de login existe e se as credenciais estão corretas
        if role in usuarios and email == usuarios[role]["email"] and senha == usuarios[role]["senha"]:
            # Redireciona para a página específica do tipo de usuário
            if role == "Aluno":
                return redirect(url_for("aluno."))
            elif role == "Professor":
                return redirect(url_for("professor."))
            elif role == "Servidor":
                return redirect(url_for("servidor."))
        else:
            mensagem = "Usuário ou senha incorretos!"

    return render_template("index.html", mensagem=mensagem)


# 🔹 Páginas de cada tipo de usuário
@app.route("/aluno")
def aluno():
    return render_template("aluno.html")

@app.route("/professor")
def professor():
    return render_template("professor.html")

@app.route("/servidor")
def servidor():
    return render_template("servidor.html")


if __name__ == "__main__":
    app.run(debug=True)
