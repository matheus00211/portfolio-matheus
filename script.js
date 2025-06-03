// Inicializar AOS
AOS.init();

// Efeito de escrita para "Desenvolvedor Front-End"
const typedTitle = document.getElementById('typed-title');
const text = "Desenvolvedor Front-End";
let index = 0;

function type() {
    if (index < text.length) {
        typedTitle.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100); // Velocidade da digitação
    }
}

window.addEventListener('load', () => {
    setTimeout(type, 500); // Inicia após o carregamento
});

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('change', function() {
    navMenu.classList.toggle('active');
});

// Rolagem suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});