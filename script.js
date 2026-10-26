// Filtro do menu
const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");
tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(t => t.setAttribute("aria-pressed", t === tab));
  cards.forEach(c => { c.hidden = tab.dataset.cat !== "all" && c.dataset.cat !== tab.dataset.cat; });
}));

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