const produtos = [
  {
    id: 1,
    nome: "Calcinha Renda Premium",
    descricao: "Renda delicada, confortável e sensual para o dia a dia."
  },
  {
    id: 2,
    nome: "Calcinha Conforto",
    descricao: "Tecido macio com ajuste perfeito ao corpo."
  },
  {
    id: 3,
    nome: "Calcinha Luxo",
    descricao: "Modelo sofisticado com acabamento em renda."
  }
];

const catalogo = document.getElementById("catalogo");

produtos.forEach(produto => {
  catalogo.innerHTML += `
    <div class="card-produto">
      <img src="imagens/calcinha-${produto.id}-branco.jpg">

      <h3>${produto.nome}</h3>

      <p class="descricao">${produto.descricao}</p>

      <a class="btn-whatsapp"
        href="https://wa.me/5554992361064?text=Tenho interesse em ${produto.nome}">
        Ver no WhatsApp
      </a>
    </div>
  `;
});