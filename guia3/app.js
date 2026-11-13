document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre').value.trim();
  const celular = document.getElementById('celular').value.trim();
  
  const errorNombre = document.getElementById('error-nombre');
  const errorCelular = document.getElementById('error-celular');
  const estadoDiv = document.getElementById('estado-envio');
  
  let valido = true;

  if (nombre === '') {
    errorNombre.textContent = 'Por favor, ingresa tu nombre completo.';
    valido = false;
  } else {
    errorNombre.textContent = '';
  }

  const regexCelular = /^9\d{8}$/;
  if (!regexCelular.test(celular)) {
    errorCelular.textContent = 'El celular debe tener 9 dígitos y empezar con 9.';
    valido = false;
  } else {
    errorCelular.textContent = '';
  }

  if (valido) {
    estadoDiv.style.display = 'block';
    estadoDiv.style.background = '#D4EDDA';
    estadoDiv.style.color = '#155724';
    estadoDiv.style.padding = '14px';
    estadoDiv.style.borderRadius = '8px';
    estadoDiv.style.marginTop = '20px';
    estadoDiv.style.fontWeight = 'bold';
    estadoDiv.style.textAlign = 'center';
    estadoDiv.textContent = `¡Gracias ${nombre}! Tu pedido ha sido registrado con éxito.`;
    this.reset();
  } else {
    estadoDiv.style.display = 'none';
  }
});