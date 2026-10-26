// Troca pelo link da Glovo do restaurante
const GLOVO_URL = "https://glovoapp.com/pt/pt/porto/";

// Filtro do menu
const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");
tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(t => t.setAttribute("aria-pressed", t === tab));
  cards.forEach(c => { c.hidden = tab.dataset.cat !== "all" && c.dataset.cat !== tab.dataset.cat; });
}));

// Faixa em movimento: duplica a lista para o ciclo ser contínuo
const track = document.getElementById("track");
const first = track.querySelector("ul");
for (let i = 0; i < 3; i++) {
  const copy = first.cloneNode(true);
  copy.setAttribute("aria-hidden", "true");
  track.appendChild(copy);
}

// Menu mobile
const toggle = document.getElementById("toggle");
const nav = document.getElementById("mainnav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

// Lista de pedido
const eur = v => v.toFixed(2).replace(".", ",") + " €";
const cart = {}; // nome -> {price, qty}
const bar = document.getElementById("cartbar");
const list = document.getElementById("cartList");

function drawCart() {
  const names = Object.keys(cart);
  if (!names.length) { bar.classList.remove("on", "open"); document.body.classList.remove("has-cart"); return; }
  let total = 0, count = 0;
  list.innerHTML = "";
  names.forEach(n => {
    const { price, qty } = cart[n];
    total += price * qty; count += qty;
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = n + " · " + eur(price * qty);
    const ctrl = document.createElement("span");
    ctrl.className = "qty";
    const minus = document.createElement("button");
    minus.textContent = "−"; minus.setAttribute("aria-label", "Remover um " + n);
    minus.addEventListener("click", () => { if (--cart[n].qty <= 0) delete cart[n]; drawCart(); });
    const q = document.createElement("b"); q.textContent = qty;
    const plus = document.createElement("button");
    plus.textContent = "+"; plus.setAttribute("aria-label", "Adicionar um " + n);
    plus.addEventListener("click", () => { cart[n].qty++; drawCart(); });
    ctrl.append(minus, q, plus);
    li.append(label, ctrl);
    list.appendChild(li);
  });
  document.getElementById("cartCount").textContent = "O teu pedido (" + count + ")";
  document.getElementById("cartTotal").textContent = eur(total);
  bar.classList.add("on");
  document.body.classList.add("has-cart");
}

document.querySelectorAll(".add").forEach(b => b.addEventListener("click", () => {
  const n = b.dataset.name;
  cart[n] = cart[n] || { price: parseFloat(b.dataset.price), qty: 0 };
  cart[n].qty++;
  drawCart();
  bar.classList.remove("pulse"); void bar.offsetWidth; bar.classList.add("pulse");
}));
document.getElementById("cartToggle").addEventListener("click", () => {
  const open = bar.classList.toggle("open");
  document.getElementById("cartToggle").setAttribute("aria-expanded", open);
});
document.getElementById("cartClear").addEventListener("click", () => {
  Object.keys(cart).forEach(k => delete cart[k]); drawCart();
});
document.getElementById("cartGo").addEventListener("click", () => {
  window.open(GLOVO_URL, "_blank", "noopener");
});

// Formulário: valida e abre o email
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const n = document.getElementById("n").value.trim();
  const em = document.getElementById("e").value.trim();
  const m = document.getElementById("m").value.trim();
  const msg = document.getElementById("msg");
  if (!n || !m || !/^\S+@\S+\.\S+$/.test(em)) {
    msg.className = "msg err";
    msg.textContent = "Preenche o nome, um email válido e a mensagem.";
    return;
  }
  msg.className = "msg";
  msg.textContent = "A abrir o teu email para enviares a mensagem.";
  location.href = "mailto:info@smashed.pt?subject=" + encodeURIComponent("Mensagem de " + n)
    + "&body=" + encodeURIComponent(m + "\n\n" + n + " (" + em + ")");
});

// Documentos legais (modelos: completar os campos entre [ ])
const DOCS = {
  priv: ["Política de Privacidade", [
    "Responsável pelo tratamento: [denominação social], NIF [a preencher], Rua de Santa Catarina, Porto. Contacto: info@smashed.pt.",
    "Dados tratados: nome, email e mensagem que nos enviares através do formulário ou por email, apenas para responder ao teu pedido.",
    "Este site não guarda os dados do formulário: ao enviar, abre-se o teu programa de email. A lista de pedido não é guardada nem enviada; a encomenda é concluída na Glovo, que tem a sua própria política de privacidade.",
    "Conservamos os dados apenas o tempo necessário para responder. Tens direito de acesso, retificação, apagamento, limitação e oposição, através de info@smashed.pt.",
    "Podes apresentar reclamação à Comissão Nacional de Proteção de Dados (cnpd.pt)."
  ]],
  cook: ["Política de Cookies", [
    "Este site não utiliza cookies de publicidade nem de análise.",
    "Os tipos de letra são carregados a partir do Google Fonts, o que pode implicar o envio do teu endereço IP à Google.",
    "Se, no futuro, forem usados cookies não essenciais, será pedido o teu consentimento prévio."
  ]],
  termos: ["Termos e Condições", [
    "Entidade: [denominação social], NIF [a preencher], Rua de Santa Catarina, Porto.",
    "Os preços apresentados incluem IVA à taxa legal em vigor e podem ser alterados sem aviso prévio.",
    "As encomendas são concluídas na Glovo e ficam sujeitas aos termos dessa plataforma.",
    "A marca, o logótipo e os conteúdos deste site pertencem à SMASHED Burger and Fries e não podem ser usados sem autorização.",
    "Em caso de litígio de consumo, podes recorrer a uma entidade de resolução alternativa de litígios: [entidade a preencher]."
  ]],
  alerg: ["Alergénios", [
    "Os nossos produtos podem conter ou ter estado em contacto com alergénios.",
    "Se tiveres alguma alergia ou intolerância, informa a equipa antes de fazeres o pedido.",
    "A lista completa de alergénios de cada produto está disponível no restaurante: [a confirmar com o cliente]."
  ]]
};
const dlg = document.getElementById("legal");
document.querySelectorAll("[data-doc]").forEach(b => b.addEventListener("click", () => {
  const [title, paras] = DOCS[b.dataset.doc];
  document.getElementById("lt").textContent = title;
  const body = document.getElementById("lb");
  body.innerHTML = "";
  paras.forEach(t => { const p = document.createElement("p"); p.textContent = t; body.appendChild(p); });
  dlg.showModal();
}));