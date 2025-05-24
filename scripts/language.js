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
        langBack.style.visibility = "visible";
        langBack.style.backdropFilter = "blur(10px)";
    } else {
        document.getElementById("select-lang").value = sessionStorage.getItem("lang");
        traducirPagina(sessionStorage.getItem('lang') === 'es' ? 'en' : 'es', sessionStorage.getItem("lang"));
        langBack.style.backdropFilter = "";
        langBack.style.visibility = "hidden";
        langBack.style.transition = "all 1s ease-in-out 0.3s";
        let contador = 0;
        document.querySelectorAll('.lang-opt').forEach(child => {
            contador += 1;
            child.style.transform = `translateX(${contador % 2 === 1 ? '-100vw' : '100vw'})`;
            child.style.transition = "all 0.5s ease-in-out";
        });
    }
}

async function traducirAzure(texto, fromLang = "es", toLang = "en") {
    const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${fromLang}&to=${toLang}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "1K1fYs5fUE4NjCd1WQv9oNGYv1665Ny8MQtNUEWE1bqMJQlnbMDYJQQJ99BEAC5RqLJXJ3w3AAAbACOGc489",
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

    const textos = [];
    const titulos = [];
    elementos.forEach(el => {
        if (
            el.childNodes.length === 1 &&
            el.childNodes[0].nodeType === 3 &&
            el.innerText.trim().length > 0
        ) {
            textos.push({ el, texto: el.innerText });
        }
        if (el.hasAttribute("title")) {
            const titleOriginal = el.getAttribute("title");
            if (titleOriginal.trim().length > 0) {
                titulos.push({ el, title: titleOriginal });
            }
        }
    });

    const promTextos = textos.map(({ texto }) => traducirAzure(texto, origen, destino));
    const promTitulos = titulos.map(({ title }) => traducirAzure(title, origen, destino));
    const traduccionesTextos = await Promise.all(promTextos);
    const traduccionesTitulos = await Promise.all(promTitulos);

    textos.forEach(({ el }, i) => {
        el.innerText = traduccionesTextos[i];
        if (el.classList.contains("correct") && el.getAttribute("target") === destino) {
            el.textContent = el.textContent.replace(el.getAttribute("tr-from"), el.getAttribute("tr-to"));
        }
    });
    titulos.forEach(({ el }, i) => {
        el.setAttribute("title", traduccionesTitulos[i]);
    });

    document.documentElement.setAttribute("lang", destino);
}

function rss() {
    sessionStorage.clear();
    location.reload();
}

main();
changeLang();
