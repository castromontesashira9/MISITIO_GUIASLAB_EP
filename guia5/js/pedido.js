let pedido = [];

function soles(monto) {
  return 'S/ ' + monto.toFixed(2);
}

function render() {
  const lista = document.getElementById('lista-pedido');
  const totalTexto = document.getElementById('total');
  const pedidoVacio = document.getElementById('pedido-vacio');
  
  if (!lista) return;
  lista.replaceChildren();

  if (pedido.length === 0) {
    if (pedidoVacio) pedidoVacio.style.display = 'block';
    if (totalTexto) totalTexto.textContent = 'S/ 0.00';
    return;
  }

  if (pedidoVacio) pedidoVacio.style.display = 'none';

  let totalAcumulado = 0;

  for (const item of pedido) {
    const li = document.createElement('li');
    li.className = 'item-carrito';

    const infoTexto = document.createElement('span');
    infoTexto.className = 'item-info';
    infoTexto.textContent = `${item.nombre} (x${item.cantidad})`;

    const subtotalTexto = document.createElement('span');
    subtotalTexto.className = 'item-subtotal';
    subtotalTexto.textContent = soles(item.precio * item.cantidad);

    const accionesDiv = document.createElement('div');
    accionesDiv.className = 'item-acciones d-flex gap-1 align-items-center';

    const btnMenos = document.createElement('button');
    btnMenos.textContent = '-';
    btnMenos.className = 'btn-cant';
    btnMenos.onclick = () => cambiarCantidad(item.id, -1);

    const btnMas = document.createElement('button');
    btnMas.textContent = '+';
    btnMas.className = 'btn-cant';
    btnMas.onclick = () => cambiarCantidad(item.id, 1);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-quitar ms-2';
    btnEliminar.onclick = () => eliminarItem(item.id);

    accionesDiv.append(btnMenos, btnMas, btnEliminar);
    li.append(infoTexto, accionesDiv, subtotalTexto);
    lista.append(li);

    totalAcumulado += item.precio * item.cantidad;
  }

  if (totalTexto) totalTexto.textContent = soles(totalAcumulado);
}

function cambiarCantidad(id, cambio) {
  const item = pedido.find(i => i.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      eliminarItem(id);
    } else {
      render();
    }
  }
}

function eliminarItem(id) {
  pedido = pedido.filter(i => i.id !== id);
  render();
}

function anunciar(mensaje) {
  const aviso = document.getElementById('aviso');
  if (aviso) {
    aviso.textContent = mensaje;
  }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-anadir');
  if (!btn) return;
  
  const prod = btn.closest('.producto');
  const nombre = prod.dataset.nombre;
  const id = nombre.toLowerCase().replace(/\s+/g, '-');
  const precio = Number(prod.dataset.precio);
  
  const existente = pedido.find(i => i.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    pedido.push({ id, nombre, precio, cantidad: 1 });
  }
  
  render();
  anunciar(`Se añadió ${nombre} al pedido.`);
});