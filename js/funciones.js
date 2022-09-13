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
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `platillo-${platillo.id}`;

        // Funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = () => {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});
        };

        contInput.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(contInput);

        contenido.appendChild(row);
    })
}

function agregarPlatillo(platillo) {
    // Extraer el pedido actual
    let { pedido } = cliente;
    if (platillo.cantidad > 0) {
        // Comprueba si el elemento ya existe en el array
        if (pedido.some( articulo => articulo.id === platillo.id )) {
        // El articulo ya existe, actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if (articulo.id === platillo.id) {
                    articulo.cantidad = platillo.cantidad;
                }
                return articulo;
            })
            // Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            // El articulo no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, platillo];
        }
    } else {
        const resultado = pedido.filter( articulo => articulo.id !== platillo.id );
        cliente.pedido = [...resultado];
    }
    console.log(cliente);
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
