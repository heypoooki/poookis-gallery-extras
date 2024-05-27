// Seleciona os elementos do lightbox
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById("lightbox-img");
var pageContent = document.getElementById('page-content');

// Seleciona as imagens das galerias
var gallery1 = document.querySelectorAll('.portfolio-grid img');
var gallery2 = document.querySelectorAll('.portfolio-ben10-grid img');
var gallery3 = document.querySelectorAll('.portfolio-ben10-grid-2 img');
var gallery4 = document.querySelectorAll('.portfolio-missao-grid img'); // Adiciona a nova galeria
var gallery5 = document.querySelectorAll('.portfolio-ben10-grid-3 img'); // Adiciona a terceira galeria do Ben10

// Variáveis para controlar a galeria atual e o índice da imagem
var currentGallery = [];
var currentIndex = 0;

// Função para abrir o lightbox
function openLightbox(gallery, index) {
    currentGallery = gallery;
    currentIndex = index;
    lightboxImg.src = currentGallery[currentIndex].getAttribute('data-full');
    lightbox.style.display = "flex";
    pageContent.classList.add('blur');
    console.log("Lightbox opened, currentIndex:", currentIndex);

    // Inicializa a lupa após um pequeno atraso para garantir que a imagem esteja carregada
    setTimeout(initializeZoom, 100);

    // Atualizar o Locomotive Scroll
    if (scroll) {
        scroll.update();
    }
}

// Função para inicializar a lupa
function initializeZoom() {
    // Remove qualquer zoom já existente
    $('.zoomContainer').remove();
    $('#lightbox-img').removeData('elevateZoom');

    // Inicializa o zoom
    $('#lightbox-img').elevateZoom({
        zoomType: "lens",
        lensShape: "round",
        lensSize: 200,
        cursor: 'pointer' // Adiciona o cursor para indicar que a imagem pode ser ampliada
    });
}

// Função para fechar o lightbox
function closeLightbox() {
    lightbox.style.display = "none";
    pageContent.classList.remove('blur');

    // Atualizar o Locomotive Scroll
    if (scroll) {
        scroll.update();
    }
}

// Adiciona evento de clique para cada imagem das galerias
gallery1.forEach((image, index) => {
    image.addEventListener('click', function() {
        openLightbox(gallery1, index);
    });
});

gallery2.forEach((image, index) => {
    image.addEventListener('click', function() {
        openLightbox(gallery2, index);
    });
});

gallery3.forEach((image, index) => {
    image.addEventListener('click', function() {
        openLightbox(gallery3, index);
    });
});

gallery4.forEach((image, index) => {
    image.addEventListener('click', function() {
        openLightbox(gallery4, index);
    });
});

gallery5.forEach((image, index) => {
    image.addEventListener('click', function() {
        openLightbox(gallery5, index);
    });
});

// Evento de clique para o botão de fechar
var close = document.getElementsByClassName("close")[0];
close.onclick = function() {
    closeLightbox();
}

// Evento de clique fora do modal para fechar
window.onclick = function(event) {
    if (event.target == lightbox) {
        closeLightbox();
    }
}

// Navegação pelas imagens
var prev = document.querySelector('.prev');
var next = document.querySelector('.next');

prev.addEventListener('click', function() {
    currentIndex = (currentIndex === 0) ? currentGallery.length - 1 : currentIndex - 1;
    console.log("Prev clicked, currentIndex:", currentIndex);
    lightboxImg.src = currentGallery[currentIndex].getAttribute('data-full');
    setTimeout(initializeZoom, 100);
});

next.addEventListener('click', function() {
    currentIndex = (currentIndex === currentGallery.length - 1) ? 0 : currentIndex + 1;
    console.log("Next clicked, currentIndex:", currentIndex);
    lightboxImg.src = currentGallery[currentIndex].getAttribute('data-full');
    setTimeout(initializeZoom, 100);
});

// Funcionalidade de swipe para dispositivos móveis
lightbox.addEventListener('touchstart', handleTouchStart, false);
lightbox.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    const firstTouch = (evt.touches || evt.originalEvent.touches)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant
        if (xDiff > 0) {
            // Left swipe
            currentIndex = (currentIndex === currentGallery.length - 1) ? 0 : currentIndex + 1;
        } else {
            // Right swipe
            currentIndex = (currentIndex === 0) ? currentGallery.length - 1 : currentIndex - 1;
        }
        console.log("Swipe detected, currentIndex:", currentIndex);
        lightboxImg.src = currentGallery[currentIndex].getAttribute('data-full');
        setTimeout(initializeZoom, 100);
    }
    // Reset values
    xDown = null;
    yDown = null;
}

// Navegação por teclado
document.addEventListener('keydown', function(event) {
    if (lightbox.style.display === 'flex') {
        if (event.key === 'ArrowLeft') {
            prev.click();
        } else if (event.key === 'ArrowRight') {
            next.click();
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Inicializando Locomotive Scroll
let scroll;
document.addEventListener('DOMContentLoaded', function() {
    if ('requestAnimationFrame' in window) {
        const scrollContainer = document.querySelector('[data-scroll-container]');
        if (scrollContainer) {
            scroll = new LocomotiveScroll({
                el: scrollContainer,
                smooth: true,
                smoothMobile: true,
                inertia: 0.8 // Ajuste a inércia para obter o efeito desejado
            });

            // Garantir que o Locomotive Scroll seja atualizado na inicialização da página
            window.addEventListener('load', () => {
                scroll.update();
            });
        }
    } else {
        console.warn('Locomotive Scroll: `requestAnimationFrame` not supported');
    }
});

// Envio de formulário de contato
document.querySelector('.contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const lastSendTimestamp = localStorage.getItem('lastSendTimestamp');
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastSendTimestamp;

    if (!emailPattern.test(email)) {
        alert('Please enter a valid email.');
        return;
    }

    if (lastSendTimestamp && timeDifference < 24 * 60 * 60 * 1000) { // 24 horas em milissegundos
        alert('You can only send one message every 24 hours.');
        return;
    }

    emailjs.sendForm('service_mb7xe7e', 'template_gascqfv', this)
        .then(function() {
            alert('Message sent successfully!');
            localStorage.setItem('lastSendTimestamp', currentTime);
        }, function(error) {
            alert('Failed to send message: ' + JSON.stringify(error));
        });
});

// Funções e variáveis para a navegação entre páginas do portfólio
let currentPage = 1;
const totalPages = 3;

function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) {
        currentPage = totalPages;
    } else if (currentPage > totalPages) {
        currentPage = 1;
    }
    updatePortfolio();
}

function updatePortfolio() {
    document.querySelectorAll('.portfolio-ben10, .portfolio-ben10-2, .portfolio-ben10-3').forEach((section, index) => {
        section.style.display = (index + 1 === currentPage) ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updatePortfolio();
    setupLightbox();
});

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const images = document.querySelectorAll('.portfolio-ben10 img, .portfolio-ben10-2 img, .portfolio-ben10-3 img');
    const closeBtn = document.querySelector('.lightbox .close');
    const prevBtn = document.querySelector('.lightbox .prev');
    const nextBtn = document.querySelector('.lightbox .next');

    let currentIndex = 0;

    function showImage(index) {
        const img = images[index];
        lightboxImg.src = img.getAttribute('data-full');
        lightbox.classList.add('visible');
        currentIndex = index;
    }

    images.forEach((img, index) => {
        img.addEventListener('click', () => showImage(index));
    });

    closeBtn.addEventListener('click', () => lightbox.classList.remove('visible'));
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + images.length) % images.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % images.length));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('visible');
        }
    });
}

document.querySelector('.prev-page').addEventListener('click', () => changePage(-1));
document.querySelector('.next-page').addEventListener('click', () => changePage(1));
