const chat = document.getElementById("chat");
const mensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btnEnviar");
const btnLimpar = document.getElementById("btnLimpar");
const contador = document.getElementById("contador");

const API_URL = "http://127.0.0.1:5000/chat";

let total = 0;


// Criar mensagens no chat
function adicionarMensagem(texto, tipo) {

    const div = document.createElement("div");

    div.className = "message " + tipo;

    div.innerHTML = texto;


    // Botão copiar para respostas do bot
    if (tipo === "bot") {

        const copiar = document.createElement("button");

        copiar.textContent = "📋 Copiar";

        copiar.className = "copy";


        copiar.onclick = function () {

            const textoCopiar = div.innerText.replace(
                "📋 Copiar",
                ""
            );


            navigator.clipboard.writeText(textoCopiar);


            copiar.textContent = "✅ Copiado";


            setTimeout(() => {

                copiar.textContent = "📋 Copiar";

            }, 1500);

        };


        div.appendChild(copiar);

    }


    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;


    return div;

}



// Enviar mensagem
async function enviarMensagem() {


    const texto = mensagem.value.trim();


    if (texto === "") {

        return;

    }



    adicionarMensagem(
        "😡 " + texto,
        "user"
    );


    mensagem.value = "";



    total++;


    if (contador) {

        contador.textContent = total;

    }



    const carregando = adicionarMensagem(
        "🔥 Pensando...",
        "bot"
    );



    btnEnviar.disabled = true;



    try {


        const resposta = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                mensagem: texto

            })

        });



        const dados = await resposta.json();



        carregando.remove();



        adicionarMensagem(

            "🔥 " + (dados.resposta || "Não encontrei uma resposta."),

            "bot"

        );



    } catch (erro) {


        carregando.textContent =
            "⚠️ Erro ao conectar com o servidor.";


        console.error(
            erro
        );


    } finally {


        btnEnviar.disabled = false;

        mensagem.focus();


    }

}



// Perguntas rápidas
function perguntaRapida(texto) {

    mensagem.value = texto;

    enviarMensagem();

}



// Botão enviar
btnEnviar.addEventListener(
    "click",
    enviarMensagem
);



// Enter envia mensagem
mensagem.addEventListener(
    "keydown",
    function(event) {


        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {


            event.preventDefault();


            enviarMensagem();

        }


    }
);



// Limpar conversa
btnLimpar.addEventListener(
    "click",
    function () {


        chat.innerHTML = "";


        total = 0;


        if (contador) {

            contador.textContent = "0";

        }



        adicionarMensagem(

            "🔥 Conversa reiniciada. Estou pronto para ajudar!",

            "bot"

        );


    }
);