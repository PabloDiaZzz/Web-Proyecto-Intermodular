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
        cambiarIdioma(sessionStorage.getItem("lang"));
        langBack.style.backdropFilter = "";
        langBack.style.visibility = "hidden";
        langBack.style.display = "none";
    }
}

async function cambiarIdioma(idioma) {
    try {
        // Determine if we are on index.html or another page
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

changeLang();
main();
