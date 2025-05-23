const langBack = document.getElementById("lang-back");

if (!sessionStorage.hasOwnProperty("lang")) {
    sessionStorage.setItem("lang", '');
}

const originalSetItem = sessionStorage.setItem;
sessionStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    if (key === "lang") {
        changeLang();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const selectLang = document.getElementById("select-lang");
    selectLang.value = sessionStorage.getItem("lang");
    selectLang.addEventListener("change", function () {
        sessionStorage.setItem("lang", this.value);
    });
});

function main() {
    document.querySelectorAll('.lang-opt').forEach(option => {
        option.addEventListener('click', function () {
            const lang = this.id.replace('lang-', '');
            sessionStorage.setItem("lang", lang);
            changeLang();
        });
    });
}

function changeLang() {
    if (sessionStorage.getItem("lang") === 'null' || sessionStorage.getItem("lang") === '') {
        langBack.style.display = "flex";
        langBack.style.visibility = "visible";
        langBack.style.backdropFilter = "blur(6px)";
    } else {
        document.getElementById("select-lang").value = sessionStorage.getItem("lang");
        cambiarIdioma(sessionStorage.getItem("lang"));
        traducirPagina(sessionStorage.getItem('lang') === 'es' ? 'en' : 'es', sessionStorage.getItem("lang"));
        langBack.style.backdropFilter = "";
        langBack.style.visibility = "hidden";
        langBack.style.display = "none";
    }
}

async function cambiarIdioma(idioma) {
    try {
        let response = await fetch('lang/' + idioma + '.json');
        if (!response.ok) {
            response = await fetch('../lang/' + idioma + '.json');
        }
        if (!response.ok) throw new Error('No se pudo cargar el archivo de traducción');
        const traducciones = await response.json();

        document.querySelectorAll('[data-trad]').forEach(el => {
            const clave = el.getAttribute('data-trad');
            if (traducciones[clave]) {
                el.innerHTML = traducciones[clave];
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function traducirAzure(texto, fromLang = "es", toLang = "en") {
    const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${fromLang}&to=${toLang}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "B68IWBYo60xOeEJhaM6HRwRw0AfRLL3qX6XxxmVeDom9jj22hZrWJQQJ99BEAC5RqLJXJ3w3AAAbACOGCQSt",
            "Ocp-Apim-Subscription-Region": "westeurope",
            "Content-Type": "application/json"
        },
        body: JSON.stringify([{ Text: texto }])
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error en la traducción: ${error}`);
    }

    const data = await response.json();
    return data[0].translations[0].text;
}

async function traducirPagina(origen, destino) {
    const elementos = document.querySelectorAll("h1, h2, h3, p, span, div, button, a, li, strong, a, abbr, label");

    for (const el of elementos) {
        // Solo traducir nodos que tengan texto visible y no hijos complejos
        if (
            el.childNodes.length === 1 &&
            el.childNodes[0].nodeType === 3 &&  // Nodo texto
            el.innerText.trim().length > 0
        ) {
            const textoOriginal = el.innerText;
            try {
                const traducido = await traducirAzure(textoOriginal, origen, destino);
                el.innerText = traducido;
                if (el.classList.contains("correct")) {
                    el.textContent = el.textContent.replace(el.getAttribute("tr-from"),el.getAttribute("tr-to"));
                }
            } catch (error) {
                console.error("Error al traducir:", textoOriginal, error);
            }
        }
        if (el.hasAttribute("title")) {
            const titleOriginal = el.getAttribute("title");
            if (titleOriginal.trim().length > 0) {
                try {
                    const titleTraducido = await traducirAzure(titleOriginal, origen, destino);
                    el.setAttribute("title", titleTraducido);
                } catch (error) {
                    console.error("Error al traducir title:", titleOriginal, error);
                }
            }
        }
    }
}


main();
changeLang();