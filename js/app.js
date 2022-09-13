import { btnGuardarCliente } from './selectores.js';
import { guardarCliente } from './funciones.js';


window.onload = function() {
    btnGuardarCliente.addEventListener('click', guardarCliente);
}

    
