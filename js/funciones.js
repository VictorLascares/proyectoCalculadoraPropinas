let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comidas',
    2: 'Bebidas',
    3: 'Postres'
}


function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar campos vacios
    const camposVacios = [ mesa, hora ].some(campo => campo === '');

    if (camposVacios) {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }
    // Asignando datos del formulario al cliente
    cliente = { ...cliente, mesa, hora };

    // Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();
    
    // Mostrar las secciones
    mostrarSecciones();

    // Obtener Platillos de la API de JSON-Server
    obtenerPlatillos();
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error));
}

function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');
    platillos.forEach(platillo => {
        const row = document.createElement('tr');

        const nombre = document.createElement('td');
        nombre.textContent = platillo.nombre;
        nombre.classList.add('col-md-4');

        const precio = document.createElement('td');
        precio.textContent = `$${platillo.precio}.00`;
        precio.classList.add('col-md-3');

        const categoria = document.createElement('td');
        categoria.textContent = categorias[platillo.categoria];
        categoria.classList.add('col-md-3');


        const contInput = document.createElement('td');
        contInput.classList.add('col-md-2');
        const cantidad = document.createElement('input');
        cantidad.type = 'number';
        cantidad.min = 0;
        cantidad.value = 0;
        cantidad.id = `platillo-${platillo.id}`;

        contInput.appendChild(cantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(contInput);

        contenido.appendChild(row);
    })
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}


function mostrarAlerta(msg) {
    const alerta = document.querySelector('.alerta');
    if (!alerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('invalid-feedback','d-block','text-center','alerta');
        alerta.textContent = msg;

        document.querySelector('.modal-body form').appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

export { guardarCliente };
