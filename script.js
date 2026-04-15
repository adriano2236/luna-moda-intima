// ============================================
// CARRINHO / SACOLA
// ============================================

function abrirCarrinho() {
  document.getElementById("sacola").style.display = "flex";
}

function fecharCarrinho() {
  document.getElementById("sacola").style.display = "none";
}

// ============================================
// CARROSSEL INFINITO (loop suave)
// ============================================

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
// MODAIS - CATEGORIAS E PRODUTOS
// ============================================

function abrirModalCategoria(id) {
  document.getElementById(id).style.display = "flex";
}

function abrirModalProduto(id) {
  // Removemos a lógica de fechar outros modais aqui.
  // Cada modal agora abrirá independentemente.
  document.getElementById(id).style.display = "flex";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

// ============================================
// TROCAR IMAGEM DO PRODUTO PELA COR
// ============================================

function trocarImagem(produtoId, cor) {
  const img = document.getElementById(`img-${produtoId}`);

  if (img) {
    img.style.opacity = "0.3";

    setTimeout(() => {
      // Mude de 'produto-1' para 'conjunto-1'
      // Use 'conjunto' + número do produto
      const numeroProduto = produtoId.replace("produto-", "conjunto-");
      img.src = `imagens/${numeroProduto}-${cor}.jpg`;

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

// ============================================
// ADICIONAR AO CARRINHO (unificado)
// ============================================

let contadorCarrinho = 0; // mantém o contador global

// ============================================
// VALIDAR E ADICIONAR AO CARRINHO (OBRIGATÓRIO)
// ============================================

function adicionarCarrinho(produtoId, nome, preco) {
  // Verifica cor selecionada
  const corSelecionada = document.querySelector(
    `#cor-${produtoId} .cor-btn.ativa`,
  );
  if (!corSelecionada) {
    document.getElementById(`erro-cor-${produtoId}`).style.display = "inline";
    return; // para aqui, não adiciona
  }
  document.getElementById(`erro-cor-${produtoId}`).style.display = "none";

  // Verifica tamanho selecionado
  const tamanhoSelecionado = document.querySelector(
    `#tamanho-${produtoId} button.ativa`,
  );
  if (!tamanhoSelecionado) {
    document.getElementById(`erro-tamanho-${produtoId}`).style.display =
      "inline";
    return; // para aqui, não adiciona
  }
  document.getElementById(`erro-tamanho-${produtoId}`).style.display = "none";

  // Pega valores
  const cor = corSelecionada.getAttribute("data-cor");
  const tamanho = tamanhoSelecionado.getAttribute("data-tamanho");

  // Atualiza contador
  contadorCarrinho++;
  document.getElementById("contador-carrinho").textContent = contadorCarrinho;

  // Mensagem
  alert(
    `✅ Adicionado!\n\n${nome}\nCor: ${cor}\nTamanho: ${tamanho}\nPreço: R$ ${preco.toFixed(2)}`,
  );

  // Fecha modal
  fecharModal(`modal-${produtoId}`);
}
// ============================================
// FECHAR AO CLICAR FORA (único para todos)
// ============================================

window.onclick = function (event) {
  // Fecha sacola se o clique foi diretamente nela
  const sacola = document.getElementById("sacola");
  if (event.target === sacola) {
    sacola.style.display = "none";
  }

  // Fecha modais de produto individuais
  const modaisProduto = document.querySelectorAll(".modal-produto");
  modaisProduto.forEach((modal) => {
    // Verifica se o clique foi diretamente no overlay do modal
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Fecha modais de categoria individuais (se houver)
  const modaisCategoria = document.querySelectorAll(".modal-categoria");
  modaisCategoria.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
