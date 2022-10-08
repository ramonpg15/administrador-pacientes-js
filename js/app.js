// * Seleccionar inputs
const pacienteInput = document.querySelector('#paciente')
const fechaInput = document.querySelector('#fecha')
const telefonoInput = document.querySelector('#telefono')
const citaInput = document.querySelector('#cita')
const sintomasInput = document.querySelector('#sintomas')
//* Seleccionar formulario
const formulario = document.querySelector('#nueva-cita')
//* Seleccionar donde se desplegan las citas
const contenedorCitas = document.querySelector('#citas')
let editando;
class Citas {
    constructor() {
        this.citas = JSON.parse(localStorage.getItem('citas')) || []
    }
    agregarCitas(cita) {
        this.citas = [...this.citas, cita]
        console.log('This citas', this.citas);
        agregarLocalStorage(this.citas)
    }
    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id)
        agregarLocalStorage(this.citas)
    }
    editarCita(citaActualizar) {
        this.citas = this.citas.map(cita => cita.id === citaActualizar.id ? citaActualizar : cita)
        agregarLocalStorage(this.citas)
    }

}
class UI {
    imprimirAlerta(mensaje, tipo) {
        const errorPrevio = document.querySelector('.alert-danger')
        if (errorPrevio) {
            return
        }
        const exitoPrevio = document.querySelector('.alert-success')
        if (exitoPrevio) {
            return
        }
        const divMensaje = document.createElement('DIV')
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12')
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }
        divMensaje.textContent = mensaje
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('agregar-cita'))
        setTimeout(() => {
            divMensaje.remove()
        }, 2000);
    }
    imprimirCitas({ citas }) {
        this.limpiarHTML()
        console.log('Citas===>', citas);
        citas.forEach(c => {
            const { paciente, fecha, telefono, cita, sintomas, id } = c
            const divCita = document.createElement('DIV')
            divCita.classList.add('cita', 'p-3')
            divCita.dataset.id = id
            //* Scriptin de los elementos de la cita
            const pacienteParrafo = document.createElement('H2')
            pacienteParrafo.classList.add('card-title', 'font-weight-bolder')
            pacienteParrafo.textContent = paciente
            const fechaParrafo = document.createElement('P')
            fechaParrafo.classList.add('card-title', 'font-weight-bolder')
            fechaParrafo.innerHTML = `<span class='font-weight-bolder'>Fecha de nacimiento:</span>${fecha}`
            const telefonoParrafo = document.createElement('P')
            telefonoParrafo.classList.add('card-title', 'font-weight-bolder')
            telefonoParrafo.innerHTML = `<span class='font-weight-bolder'>Telefono:</span>${telefono}`
            const citaParrafo = document.createElement('P')
            citaParrafo.classList.add('card-title', 'font-weight-bolder')
            citaParrafo.innerHTML = `<span class='font-weight-bolder'>Fecha de la cita:</span>${cita}`
            const sintomasParrafo = document.createElement('P')
            sintomasParrafo.classList.add('card-title', 'font-weight-bolder')
            sintomasParrafo.innerHTML = `<span class='font-weight-bolder'>Sintomas:</span>${sintomas}`
            const btnEliminar = document.createElement('button')
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2')
            btnEliminar.innerHTML = 'Eliminar'
            btnEliminar.onclick = () => eliminarCita(id)
            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn', 'btn-info')
            btnEditar.innerHTML = 'Editar'
            btnEditar.onclick = () => cargarEdicion(c)
            //* Agregar parrafos al divCita
            divCita.appendChild(pacienteParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(citaParrafo)
            divCita.appendChild(sintomasParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)
            //* Agregar citas al html
            contenedorCitas.appendChild(divCita)
        });
    }
    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI()
const adminstrarCitas = new Citas()

listeners()
function listeners() {
    pacienteInput.addEventListener('input', validarInput)
    fechaInput.addEventListener('input', validarInput)
    telefonoInput.addEventListener('input', validarInput)
    citaInput.addEventListener('input', validarInput)
    sintomasInput.addEventListener('input', validarInput)
    formulario.addEventListener('submit', nuevaCita)
    document.addEventListener('DOMContentLoaded', () => {
        ui.imprimirCitas(adminstrarCitas)
    })
}

const citaObj = {
    paciente: '',
    fecha: '',
    telefono: '',
    cita: '',
    sintomas: ''
}

function validarInput(e) {
    citaObj[e.target.name] = e.target.value
    console.log('CitaObj', citaObj);
}

function nuevaCita(e) {
    e.preventDefault()
    const { paciente, fecha, telefono, cita, sintomas } = citaObj
    if (paciente === '' || fecha === '' || telefono === '', cita === '' || sintomas === '') {
        console.log('Vacio');
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return
    }
    if (editando) {
        ui.imprimirAlerta('Se modifico correctamente')
        // * Pasar el objeto de la cita a edicion
        adminstrarCitas.editarCita({ ...citaObj })
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita'
        editando = false
    }
    else {
        //*Generar ID unico
        citaObj.id = Date.now()
        adminstrarCitas.agregarCitas({ ...citaObj })
        ui.imprimirAlerta('Se agrego correctamente')
    }
    formulario.reset()
    reiniciarObjeto()
    ui.imprimirCitas(adminstrarCitas)
}
function reiniciarObjeto() {
    citaObj.paciente = '';
    citaObj.fecha = '';
    citaObj.telefono = '';
    citaObj.cita = '';
    citaObj.sintomas = '';
}
function eliminarCita(idx) {
    console.log('id=>', idx);
    adminstrarCitas.eliminarCita(idx)
    ui.imprimirAlerta('La cita se elimino con extio', 'success')
    ui.imprimirCitas(adminstrarCitas)
}
function cargarEdicion(citaEditar) {
    console.log('Cita editar====>', citaEditar);
    const { paciente, fecha, telefono, cita, sintomas, id } = citaEditar
    // * Llenar inputs
    pacienteInput.value = paciente
    fechaInput.value = fecha
    telefonoInput.value = telefono
    citaInput.value = cita
    sintomasInput.value = sintomas
    // *LLenar el objeto
    citaObj.paciente = paciente
    citaObj.fecha = fecha
    citaObj.telefono = telefono
    citaObj.cita = cita
    citaObj.sintomas = sintomas
    citaObj.id = id
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios'
    editando = true
}
function agregarLocalStorage(citas) {
    localStorage.setItem('citas', JSON.stringify(citas))
}