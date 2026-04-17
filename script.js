let slideIndex = 0;
const container = document.querySelector(".carrossel-container");
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
const indicadores = document.querySelectorAll(".indicadores span");

// CLONA o primeiro slide e coloca no final (para loop infinito)
const primeiroSlide = slides[0].cloneNode(true);
container.appendChild(primeiroSlide);

// Ajusta largura do container para caber o clone também
container.style.width = `${(totalSlides + 1) * 100}%`;

function mudarSlide(direcao) {
  slideIndex += direcao;

  // Aplica transição suave
  container.style.transition = "transform 0.5s ease";
  atualizarCarrossel();

  // Se chegou no clone (último), volta pro primeiro instantaneamente
  if (slideIndex > totalSlides - 1) {
    setTimeout(() => {
      container.style.transition = "none"; // remove transição
      slideIndex = 0;
      atualizarCarrossel();
    }, 500); // espera a animação terminar
  }

  // Se voltou antes do primeiro, vai pro último
  if (slideIndex < 0) {
    container.style.transition = "none";
    slideIndex = totalSlides - 1;
    atualizarCarrossel();
    setTimeout(() => {
      container.style.transition = "transform 0.5s ease";
    }, 50);
  }
}

function irParaSlide(n) {
  slideIndex = n;
  container.style.transition = "transform 0.5s ease";
  atualizarCarrossel();
}

function atualizarCarrossel() {
  container.style.transform = `translateX(-${slideIndex * (100 / (totalSlides + 1))}%)`;

  // Atualiza bolinhas (só até o total original, ignora o clone)
  const indiceReal = slideIndex >= totalSlides ? 0 : slideIndex;
  indicadores.forEach((dot, i) => {
    dot.classList.toggle("ativo", i === indiceReal);
  });
}

// Só roda carrossel se ele existe na página
if (document.querySelector('.carrossel')) {
  setInterval(() => {
    mudarSlide(1);
  }, 5000);
}

// ============================================
// TROCAR IMAGEM DO PRODUTO PELA COR
// ============================================

function trocarImagem(idImagem, nomeBase, cor) {
  const img = document.getElementById(idImagem);

  if (img) {
    img.style.opacity = "0.3";

    setTimeout(() => {
      img.src = `imagens/${nomeBase}-${cor}.jpg`;
      img.style.opacity = "1";
    }, 150);
  }
}

// ============================================
// SELEÇÃO DE COR E TAMANHO
// ============================================

function selecionarCor(botao) {
  // Remove ativa de todos os botões de cor
  const botoes = botao.parentElement.querySelectorAll(".cor-btn");
  botoes.forEach((b) => b.classList.remove("ativa"));

  // Adiciona ativa no clicado
  botao.classList.add("ativa");
}

function selecionarTamanho(botao) {
  // Remove ativa de todos os botões de tamanho
  const botoes = botao.parentElement.querySelectorAll("button");
  botoes.forEach((b) => b.classList.remove("ativa"));

  // Adiciona ativa no clicado
  botao.classList.add("ativa");
}
