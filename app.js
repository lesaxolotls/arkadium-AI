const micBtn = document.getElementById("micBtn");
const sendBtn = document.getElementById("sendBtn");
const textInput = document.getElementById("textInput");

const statusText = document.getElementById("status");
const transcription = document.getElementById("transcription");

const chat = document.getElementById("chat");
const clearBtn = document.getElementById("clearBtn");


/*
 * RECONNAISSANCE VOCALE
 */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;
let listening = false;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {

        listening = true;

        micBtn.classList.add("listening");
        micBtn.textContent = "⏹️";

        statusText.textContent = "Je t'écoute...";
        transcription.textContent = "Parle maintenant...";
    };


    recognition.onresult = (event) => {

        let finalText = "";
        let interimText = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const result = event.results[i];

            if (result.isFinal) {
                finalText += result[0].transcript;
            } else {
                interimText += result[0].transcript;
            }
        }

        transcription.textContent =
            finalText || interimText || "Je t'écoute...";

        if (finalText) {

            textInput.value = finalText;

            sendMessage();
        }
    };


    recognition.onerror = (event) => {

        console.error(event.error);

        statusText.textContent =
            "Erreur microphone : " + event.error;

        stopListening();
    };


    recognition.onend = () => {
        stopListening();
    };

} else {

    statusText.textContent =
        "Reconnaissance vocale non disponible.";
}


/*
 * MICROPHONE
 */

micBtn.addEventListener("click", () => {

    if (!recognition) return;

    if (listening) {

        recognition.stop();

    } else {

        try {
            recognition.start();
        } catch (error) {
            console.error(error);
        }
    }
});


function stopListening() {

    listening = false;

    micBtn.classList.remove("listening");
    micBtn.textContent = "🎙️";

    statusText.textContent = "Prêt";
}


/*
 * ENVOYER AVEC LE BOUTON
 */

sendBtn.addEventListener("click", sendMessage);


/*
 * ENVOYER AVEC ENTRÉE
 */

textInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
});


/*
 * ENVOYER LE MESSAGE
 */

function sendMessage() {

    const text = textInput.value.trim();

    if (!text) return;

    addMessage("user", text);

    textInput.value = "";

    transcription.textContent = "Réflexion...";

    processMessage(text);
}


/*
 * AJOUTER UN MESSAGE
 */

function addMessage(type, text) {

    const message = document.createElement("div");

    message.className =
        `message ${type}`;

    const bubble =
        document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    message.appendChild(bubble);

    chat.appendChild(message);

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}


/*
 * RÉPONSE DE DÉMONSTRATION
 *
 * Plus tard :
 *
 * texte
 * ↓
 * backend Arkadium
 * ↓
 * API IA
 * ↓
 * réponse
 */

function processMessage(text) {

    const command =
        text.toLowerCase();

    let response;


    if (
        command.includes("bonjour") ||
        command.includes("salut")
    ) {

        response =
            "Bonjour ! Je suis Arkadium AI. Comment puis-je t'aider ?";

    }

    else if (
        command.includes("qui es-tu") ||
        command.includes("qui tu es")
    ) {

        response =
            "Je suis Arkadium AI, ton assistant vocal.";

    }

    else if (
        command.includes("comment ça va") ||
        command.includes("comment ca va")
    ) {

        response =
            "Je fonctionne parfaitement !";

    }

    else if (
        command.includes("arkadium")
    ) {

        response =
            "Arkadium AI est prêt.";

    }

    else if (
        command.includes("aide")
    ) {

        response =
            "Tu peux m'écrire ou utiliser le microphone. Je répondrai ensuite à l'écran et avec ma voix.";

    }

    else {

        response =
            "J'ai reçu ton message : « " +
            text +
            " ». L'IA sera connectée dans la prochaine version.";
    }


    setTimeout(() => {

        addMessage("ai", response);

        speak(response);

        transcription.textContent =
            "Réponse terminée";

    }, 400);
}


/*
 * SYNTHÈSE VOCALE
 *
 * Le navigateur lit la réponse
 * sans API payante.
 */

function speak(text) {

    if (!("speechSynthesis" in window)) {

        console.warn(
            "Synthèse vocale non disponible."
        );

        return;
    }

    window.speechSynthesis.cancel();

    const voice =
        new SpeechSynthesisUtterance(text);

    voice.lang = "fr-FR";

    voice.rate = 1;
    voice.pitch = 1;
    voice.volume = 1;

    voice.onstart = () => {
        statusText.textContent = "🔊 Je parle...";
    };

    voice.onend = () => {
        statusText.textContent = "Prêt";
    };

    window.speechSynthesis.speak(voice);
}


/*
 * NOUVELLE CONVERSATION
 */

clearBtn.addEventListener("click", () => {

    chat.innerHTML = `
        <section class="welcome">

            <div class="robot">🤖</div>

            <h2>Bonjour 👋</h2>

            <p>
                Je suis <strong>Arkadium AI</strong>.<br>
                Écris-moi ou parle-moi.
            </p>

        </section>
    `;

    transcription.textContent =
        "Prêt à discuter";

    statusText.textContent =
        "Prêt";

    window.speechSynthesis.cancel();
});
