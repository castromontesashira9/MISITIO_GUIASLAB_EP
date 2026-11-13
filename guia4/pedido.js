let pedido = [];
const lista = document.getElementById('lista-pedido');
const totalTexto = document.getElementById('total');
const contadorItems = document.getElementById('contador-items');
const btnProcesar = document.getElementById('btn-procesar');
const btnVaciar = document.getElementById('btn-vaciar');
const inputBuscar = document.getElementById('input-buscar');
const selectPago = document.getElementById('forma-pago');
const seccionTarjeta = document.getElementById('seccion-tarjeta');
const seccionYape = document.getElementById('seccion-yape');

function soles(monto) {
  return 'S/ ' + monto.toFixed(2);
}

// Mostrar u ocultar secciones de pago según la opción elegida
if (selectPago) {
  selectPago.addEventListener('change', () => {
    const valor = selectPago.value;
    if (seccionTarjeta) seccionTarjeta.style.display = (valor === 'Tarjeta') ? 'block' : 'none';
    if (seccionYape) seccionYape.style.display = (valor === 'Yape / Plin') ? 'block' : 'none';
  });
}

function renderizarCanasta() {
  if (!lista) return;
  lista.replaceChildren();

  if (pedido.length === 0) {
    const liVacio = document.createElement('li');
    liVacio.className = 'carrito-vacio';
    liVacio.textContent = 'Tu carrito está vacío. ¡Agrega productos del catálogo!';
    lista.append(liVacio);
    if (totalTexto) totalTexto.textContent = 'S/ 0.00';
    if (contadorItems) contadorItems.textContent = '0 productos';
    return;
  }

  let totalAcumulado = 0;
  let totalCantidad = 0;

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
    accionesDiv.className = 'item-acciones';

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
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.onclick = () => eliminarItem(item.id);

    accionesDiv.append(btnMenos, btnMas, btnEliminar);
    li.append(infoTexto, accionesDiv, subtotalTexto);
    lista.append(li);

    totalAcumulado += item.precio * item.cantidad;
    totalCantidad += item.cantidad;
  }

  if (totalTexto) totalTexto.textContent = soles(totalAcumulado);
  if (contadorItems) contadorItems.textContent = `${totalCantidad} ${totalCantidad === 1 ? 'producto' : 'productos'}`;
}

function cambiarCantidad(id, cambio) {
  const item = pedido.find(i => i.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      eliminarItem(id);
    } else {
      renderizarCanasta();
    }
  }
}

function eliminarItem(id) {
  pedido = pedido.filter(i => i.id !== id);
  renderizarCanasta();
}

// Vaciar carrito completo
if (btnVaciar) {
  btnVaciar.onclick = () => {
    pedido = [];
    renderizarCanasta();
  };
}

// Evento click en "Añadir"
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-anadir');
  if (!btn) return;
  
  const prod = btn.closest('.producto');
  const id = prod.dataset.id;
  const nombre = prod.dataset.nombre;
  const precio = Number(prod.dataset.precio);
  
  const existente = pedido.find(i => i.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    pedido.push({ id, nombre, precio, cantidad: 1 });
  }
  
  renderizarCanasta();
  
  btn.textContent = '¡Añadido! ✓';
  btn.style.backgroundColor = '#27AE60';
  setTimeout(() => {
    btn.textContent = 'Añadir';
    btn.style.backgroundColor = '#C68B59';
  }, 1000);
});

// Buscador corregido: ahora busca coincidencias parciales (ej. "pan" muestra francés, yema y chancay)
if (inputBuscar) {
  inputBuscar.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase().trim();
    const productos = document.querySelectorAll('.producto');
    
    productos.forEach(prod => {
      const nombre = prod.dataset.nombre;
      if (nombre.includes(texto)) {
        prod.style.display = 'flex';
      } else {
        prod.style.display = 'none';
      }
    });
  });
}

// Validar y procesar pedido con verificación completa de campos
if (btnProcesar) {
  btnProcesar.onclick = () => {
    if (pedido.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de pagar.');
      return;
    }

    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const telefonoCliente = document.getElementById('telefono-cliente').value.trim();
    const direccionCliente = document.getElementById('direccion-cliente').value.trim();
    const formaPago = selectPago.value;

    if (!nombreCliente) {
      alert('Por favor, ingresa tu nombre y apellido.');
      document.getElementById('nombre-cliente').focus();
      return;
    }

    if (!telefonoCliente || telefonoCliente.length < 9) {
      alert('Por favor, ingresa un número de celular válido de 9 dígitos.');
      document.getElementById('telefono-cliente').focus();
      return;
    }

    if (!direccionCliente) {
      alert('Por favor, ingresa una dirección de entrega o indica recojo en tienda.');
      document.getElementById('direccion-cliente').focus();
      return;
    }

    // Validación según forma de pago elegida
    if (formaPago === 'Tarjeta') {
      const numTarjeta = document.getElementById('num-tarjeta').value.trim();
      const expTarjeta = document.getElementById('exp-tarjeta').value.trim();
      const cvvTarjeta = document.getElementById('cvv-tarjeta').value.trim();

      if (numTarjeta.length < 16 || !expTarjeta || !cvvTarjeta) {
        alert('Por favor, completa correctamente los datos de tu tarjeta de crédito o débito.');
        return;
      }
      alert(`¡Pago con Tarjeta aprobado!\nGracias ${nombreCliente}, tu pedido ha sido procesado con éxito.`);
    } else if (formaPago === 'Yape / Plin') {
      const yapeCel = document.getElementById('yape-celular').value.trim();
      const yapeCod = document.getElementById('yape-codigo').value.trim();

      if (yapeCel.length < 9 || !yapeCod) {
        alert('Por favor, ingresa el celular desde donde yapeaste y el código de aprobación/operación.');
        return;
      }
      alert(`¡Pago con Yape / Plin verificado!\nGracias ${nombreCliente}, código de operación: ${yapeCod}.`);
    } else {
      alert(`¡Pedido registrado con éxito!\nGracias ${nombreCliente}. Pagarás en efectivo al recibir tu pedido.`);
    }

    // Limpiar formulario y carrito
    pedido = [];
    renderizarCanasta();
    document.getElementById('nombre-cliente').value = '';
    document.getElementById('telefono-cliente').value = '';
    document.getElementById('direccion-cliente').value = '';
    document.getElementById('num-tarjeta').value = '';
    document.getElementById('exp-tarjeta').value = '';
    document.getElementById('cvv-tarjeta').value = '';
    document.getElementById('yape-celular').value = '';
    document.getElementById('yape-codigo').value = '';
    if (seccionTarjeta) seccionTarjeta.style.display = 'none';
    if (seccionYape) seccionYape.style.display = 'none';
    if (selectPago) selectPago.value = 'Efectivo';
  };
}