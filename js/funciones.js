let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};


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
        .then(resultado => console.log(resultado))
        .catch(error => console.log(error));
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
