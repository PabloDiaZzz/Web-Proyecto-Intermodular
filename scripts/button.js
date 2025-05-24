const button = document.getElementById("btn");
const transitionOpen =
    "border-radius 0.5s ease 0.5s, right 0.5s ease 0.5s, left 0.5s ease 0.5s, transform 0.5s ease 0.5s, width 0.5s ease, height 0.5s ease";
const transitionClose =
    "border-radius 0.5s ease, right 0.5s ease, left 0.5s ease, transform 0.5s ease, width 0.5s ease, height 0.5s ease";
const transitionDirectOpen = "border-radius 0.5s ease, right 0.5s ease, left 0.5s ease, transform 0.5s ease, width 0.5s ease 0.5s, height 0.5s ease 0.5s";
let wasDraged = false;
let heightBtn = '200px'
let contador = 0;

function main() {
    let isDragging = false;
    let isMouseDown = false;
    let startX, startY, initialRight, initialBottom, initialLeft;

    const obs = new ResizeObserver((entries) => {
        for (let entry of entries) {
            if (entry.target === button) {
                if (button.classList.contains("btn-visible")) {
                    button.style.height = heightBtn;
                    button.classList.add("open");
                    if (button.style.height === heightBtn && document.getElementById("btn-interior").scrollTop !== 0) {
                        document.getElementById("btn-interior").scrollTop = 0;
                    }
                } else {
                    button.classList.remove("open");
                }
            }
        }
    });
    obs.observe(button);

    button.addEventListener("mousedown", (e) => {
        wasDraged = false;
        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
        initialBottom = parseInt(window.getComputedStyle(button).bottom, 10);

        if (button.style.right === "") {
            initialRight = document.defaultView.innerWidth - parseInt(button.style.left) - parseInt(button.style.width);
        } else {
            initialRight = parseInt(window.getComputedStyle(button).right, 10);
        }
        if (button.style.left === "") {
            initialLeft = document.defaultView.innerWidth - parseInt(button.style.right) - parseInt(button.style.width);
        } else {
            initialLeft = parseInt(window.getComputedStyle(button).left, 10);
        }
        button.style.transition = "none";
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (isMouseDown && !button.classList.contains("btn-visible")) {
            isDragging = true;
            let dx = startX - e.clientX;
            let dy = startY - e.clientY;
            if (button.classList.contains("right")) {
                if (parseInt(button.style.right) > parseInt(document.defaultView.innerWidth) / 2) {
                    button.classList.add('left');
                    button.classList.remove('right');
                }
            } else {
                if (parseInt(button.style.left) > parseInt(document.defaultView.innerWidth) / 2) {
                    button.classList.add('right');
                    button.classList.remove('left');
                }
            }
            if (button.style.right === "") {
                button.style.left = initialLeft + dx + 'px';
                button.style.right = document.defaultView.innerWidth - parseInt(button.style.left) - parseInt(button.style.width) + 'px';
            } else if (button.style.left === "") {
                button.style.right = initialRight + dx + 'px';
                button.style.left = document.defaultView.innerWidth - parseInt(button.style.right) - parseInt(button.style.width) + 'px';

            } else {
                button.style.right = initialRight + dx + 'px';
                button.style.left = document.defaultView.innerWidth - parseInt(button.style.right) - parseInt(button.style.width) + 'px';
            }
            button.style.bottom = initialBottom + dy + 'px';

        }
    });

    button.addEventListener('wheel', function (e) {
        const interior = document.getElementById('btn-interior');
        if (interior.scrollHeight > interior.clientHeight) {
            e.preventDefault();
            interior.scrollTop += e.deltaY;
        }
    }, { passive: false });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            wasDraged = true;
            button.style.transition = transitionClose;
            if (button.classList.contains("left")) {
                button.style.right = '';
                button.style.transform = 'translateX(-100%) translateY(50%) rotateZ(180deg)';
                button.style.left = 12 + 'px';
            } else {
                button.style.left = '';
                button.style.transform = 'translateX(100%) translateY(50%) rotateZ(180deg)';
                button.style.right = 12 + 'px';
            }
            void button.offsetWidth;
            button.style.width = "40px";
        }
        isMouseDown = false;
        document.body.style.userSelect = "";
    });


    button.addEventListener("click", clickBoton);
    document.addEventListener("click", clickFuera);
    button.style.width = 40 + 'px';
    document.querySelectorAll(".opciones").forEach(opcion => {
        opcion.style.height = opcion.style.width;
    });
}

function clickFuera(e) {
    if (!button.contains(e.target)) {
        setUp();
    }
}

function setUp() {
    document.getElementById("btn-interior").style.maxHeight = 'calc(' + heightBtn + ' - 10px)';
    button.style.width = "40px";
    button.style.height = "40px";
    button.classList.remove("btn-visible");
    button.style.transition = transitionOpen;
    if (button.classList.contains("left")) {
        button.style.left = 12 + 'px';
        button.style.transform = 'translateX(-100%) translateY(50%) rotateZ(180deg)';
    } else {
        button.style.right = 12 + 'px';
        button.style.transform = 'translateX(100%) translateY(50%) rotateZ(180deg)';
    }

    const ico = button.querySelector(".ico");
    ico.style.transition = 'transform 0.5s ease 0.5s, opacity 0.5s ease';
    ico.style.transform = 'scale(1) rotateZ(180deg)';
    ico.style.left = '50%';
    ico.style.top = '50%';
    ico.style.translate = '-50% -50%';

    contador = 0;
    document.querySelectorAll(".opciones").forEach(opcion => {
        opcion.style.transform = 'translateX(' + Math.pow(-1, contador % 2) * 200 + '%)';
        contador += 1;
        opcion.style.transition = 'transform 0.6s ease';
    });

    document.getElementById("btn-interior").style.transition = 'visibility 0.5s ease, opacity 0.5s ease';
    document.getElementById("btn-interior").style.visibility = 'hidden';
}

function clickBoton() {
    if (wasDraged === true) {
        wasDraged = false;
    } else {
        button.classList.add("btn-visible");
        button.style.width = "60px";
        button.style.height = heightBtn;
        button.style.transition = transitionDirectOpen;
        if (button.classList.contains("left")) {
            button.style.left = 20 + 'px';
        } else {
            button.style.right = 20 + 'px';
        }
        button.style.transform = 'translateY(50%) rotateZ(0deg)';
        button.querySelector(".ico").style.transition = 'transform 0.5s ease';
        button.querySelector(".ico").style.transform = 'scale(0) rotateZ(0deg)';
        document.getElementById("btn-interior").style.transition = 'transform 0.5s ease 0.5s, visibility 0.5s ease 0.5s, opacity 0.5s ease';
        document.getElementById("btn-interior").style.transform = 'scale(1) rotate(0deg)';
        document.getElementById("btn-interior").style.visibility = 'visible';

        contador = 0;
        document.querySelectorAll(".opciones").forEach(opcion => {
            opcion.style.transform = 'translateX(0)';
            contador += 1;
            opcion.style.transition = 'transform 0.5s ease ' + (0.4 + (0.1 * contador)) + 's';
        });
    }

}

document.addEventListener("DOMContentLoaded", () => {
    main();
    setUp();
});
