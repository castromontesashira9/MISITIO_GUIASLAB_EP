document.getElementById('confirmarVaciar').addEventListener('click', () => {
  pedido.length = 0;
  render();
  anunciar('Se vació el pedido. Total: S/ 0.00.');
});