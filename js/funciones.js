import { contenidoResumen, contenidoPlatillos } from './selectores.js';

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

        contenidoPlatillos.appendChild(row);
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
    // Limpiar el codigo HTML previo
    limpiarHTML();

    if (cliente.pedido.length) {
        // Mostrar el resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();        
    }
}

function actualizarResumen() {
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6','card','py-2','px-3','shadow');

    // Titulo de seccion
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4','text-center');

    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: '; 
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa
    mesaSpan.classList.add('fw-normal');
    mesa.appendChild(mesaSpan);

    const hora = document.createElement('p');
    hora.textContent = 'Hora: '; 
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora
    horaSpan.classList.add('fw-normal');
    hora.appendChild(horaSpan);

    // Iterar sobre el array de pedidos
    const lista = document.createElement('ul');
    lista.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, precio, cantidad, id } = articulo;

        const elemento = document.createElement('li');
        elemento.classList.add('list-group-item');

        const nombreTexto = document.createElement('h4');
        nombreTexto.classList.add('my-4');
        nombreTexto.textContent = nombre;

        const contenido = document.createElement('div');
        contenido.classList.add('d-flex','justify-content-between','align-items-center')

        const contenidoTexto = document.createElement('div');
        contenidoTexto.classList.add('d-flex','flex-column');

        const contCantPrec = document.createElement('div');
        contCantPrec.classList.add('d-flex','gap-4');

        const cantidadTexto = document.createElement('p');
        cantidadTexto.classList.add('fw-bold');
        cantidadTexto.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
        cantidadTexto.appendChild(cantidadValor);

        const precioTexto = document.createElement('p');
        precioTexto.classList.add('fw-bold');
        precioTexto.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}.00`;
        precioTexto.appendChild(precioValor);

        contCantPrec.appendChild(cantidadTexto);
        contCantPrec.appendChild(precioTexto);

        const subtotalTexto = document.createElement('p');
        subtotalTexto.classList.add('fw-bold');
        subtotalTexto.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio,cantidad);
        subtotalTexto.appendChild(subtotalValor);

        contenidoTexto.appendChild(contCantPrec);
        contenidoTexto.appendChild(subtotalTexto);

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent = 'Eliminar';

        // Funcion para eliminar del pedido
        btnEliminar.onclick = () => eliminarProducto(id);

        contenido.appendChild(contenidoTexto);
        contenido.appendChild(btnEliminar);


        elemento.appendChild(nombreTexto);
        elemento.appendChild(contenido);


        lista.appendChild(elemento);
    })


    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(lista);

    contenidoResumen.appendChild(resumen);


    // Mostrar formulario de propinas
    formularioPropinas();
}

function eliminarProducto(id) {
    const input = document.querySelector(`#platillo-${id}`);
    const { pedido } = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id );
    cliente.pedido = [...resultado];
    
    // Limpiar el codigo HTML previo
    limpiarHTML();

    if (cliente.pedido.length) {
        // Mostrar el resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();        
    }

    // Regresamos el valor del input a 0
    input.value = 0;
}

function calcularSubtotal(precio, cantidad) {
    return `$${precio*cantidad}.00`;
}

function limpiarHTML() {
    while(contenidoResumen.firstChild) {
        contenidoResumen.removeChild(contenidoResumen.firstChild);
    }
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

function mensajePedidoVacio() {
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenidoResumen.appendChild(texto);
}

function formularioPropinas() {
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6','formulario');
    
    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-2','px-3','shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Propina';

    // Radio button 10% de propina
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);
    
    // Radio button 25% de propina
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    // Radio button 50% de propina
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);


    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    formulario.appendChild(divFormulario);

    contenidoResumen.appendChild(formulario);
}

function calcularPropina(e) {
    const { pedido } = cliente;
    let subtotal = 0;

    pedido.forEach( articulo => {
        subtotal += articulo.cantidad*articulo.precio;
    })
    // Valor del radio button seleccionado con el porcentaje de propina
    const propinaSeleccionada = parseInt(e.target.value);

    // Calcular propina en base al porcentaje
    const propina = subtotal * (propinaSeleccionada/100);

    // Calcular el total
    const total = propina + subtotal;
    console.log(`Subtotal: ${subtotal} \nPropina: ${propina} \nTotal: ${total}`);
}

export { guardarCliente };
