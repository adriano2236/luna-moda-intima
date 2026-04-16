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

(function inicializarCarrossel() {
  // Guard: só inicializa se os elementos do carrossel existirem na página
  var carrosselSection = document.querySelector(".carrossel");
  var container = document.querySelector(".carrossel-container");
  var slides = document.querySelectorAll(".slide");
  var indicadores = document.querySelectorAll(".indicadores span");

  if (!carrosselSection || !container || !slides || slides.length === 0) {
    // Página sem carrossel — expõe funções vazias para evitar erros no HTML
    window.mudarSlide = function () {};
    window.irParaSlide = function () {};
    return;
  }

  var slideIndex = 0;
  var totalSlides = slides.length;
  var emAnimacao = false; // trava de animação contra cliques rápidos
  var autoPlayTimer = null;

  // Clona o primeiro slide e coloca no final (para loop infinito)
  try {
    var primeiroSlide = slides[0].cloneNode(true);
    container.appendChild(primeiroSlide);
  } catch (e) {
    console.warn("Carrossel: falha ao clonar slide.", e);
    window.mudarSlide = function () {};
    window.irParaSlide = function () {};
    return;
  }

  // Ajusta largura do container para caber o clone também
  container.style.width = (totalSlides + 1) * 100 + "%";

  function atualizarCarrossel() {
    container.style.transform =
      "translateX(-" + slideIndex * (100 / (totalSlides + 1)) + "%)";

    // Atualiza bolinhas (só até o total original, ignora o clone)
    var indiceReal = slideIndex >= totalSlides ? 0 : slideIndex;
    indicadores.forEach(function (dot, i) {
      dot.classList.toggle("ativo", i === indiceReal);
    });
  }

  function mudarSlide(direcao) {
    // Trava de animação: ignora cliques durante transição
    if (emAnimacao) return;
    emAnimacao = true;

    slideIndex += direcao;

    // Aplica transição suave
    container.style.transition = "transform 0.5s ease";
    atualizarCarrossel();

    // Se chegou no clone (último), volta pro primeiro instantaneamente
    if (slideIndex > totalSlides - 1) {
      setTimeout(function () {
        container.style.transition = "none";
        slideIndex = 0;
        atualizarCarrossel();
        emAnimacao = false;
      }, 500);
    }
    // Se voltou antes do primeiro, vai pro último
    else if (slideIndex < 0) {
      container.style.transition = "none";
      slideIndex = totalSlides - 1;
      atualizarCarrossel();
      setTimeout(function () {
        container.style.transition = "transform 0.5s ease";
        emAnimacao = false;
      }, 50);
    } else {
      setTimeout(function () {
        emAnimacao = false;
      }, 500);
    }

    // Reinicia auto-play ao navegar manualmente
    reiniciarAutoPlay();
  }

  function irParaSlide(n) {
    // Trava de animação e validação de limites
    if (emAnimacao) return;
    if (n < 0 || n >= totalSlides) return;
    if (n === slideIndex) return;

    emAnimacao = true;
    slideIndex = n;
    container.style.transition = "transform 0.5s ease";
    atualizarCarrossel();

    setTimeout(function () {
      emAnimacao = false;
    }, 500);

    // Reinicia auto-play ao navegar manualmente
    reiniciarAutoPlay();
  }

  // --- Gerenciamento do auto-play ---

  function iniciarAutoPlay() {
    pararAutoPlay();
    autoPlayTimer = setInterval(function () {
      mudarSlide(1);
    }, 5000);
  }

  function pararAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function reiniciarAutoPlay() {
    pararAutoPlay();
    iniciarAutoPlay();
  }

  // Pausa auto-play quando a aba não está visível
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      pararAutoPlay();
    } else {
      reiniciarAutoPlay();
    }
  });

  // Inicializa posição e inicia auto-play
  atualizarCarrossel();
  iniciarAutoPlay();

  // Expõe funções globalmente para os onclick do HTML
  window.mudarSlide = mudarSlide;
  window.irParaSlide = irParaSlide;
})();

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
