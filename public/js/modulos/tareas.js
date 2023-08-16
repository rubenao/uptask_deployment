const tareas = document.querySelector('.listado-pendientes')
import axios from 'axios'
import Swal from 'sweetalert2'
import {actualizarAvance} from './funciones/avance'

if(tareas){

    tareas.addEventListener('click', e=>{

        if(e.target.classList.contains('fa-circle-check')){
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea

            // request hacia /tarea/:id

            const url = `${location.origin}/tareas/${idTarea}`

            axios.patch(url, { idTarea})
                .then(function (respuesta){
                    if(respuesta.status == 200){
                        icono.classList.toggle('completo')

                        actualizarAvance()
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){


            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea
            
            Swal.fire({
                title: 'Deseas borrar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                cancelButtonText: 'No, cancelar'
              }).then((result) => {
                if (result.isConfirmed) {

                    const url = `${location.origin}/tareas/${idTarea}`

                    //enviar el delete por medio de axios

                    axios.delete(url , {params: {idTarea}})
                        .then(function (respuesta){
                            if (respuesta.status === 200){
                                //eliminar el nodo
                                tareaHTML.parentElement.removeChild(tareaHTML)

                                //creando alerta

                                Swal.fire(
                                    'tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance()
                            }
                        })
                }
              })
        }
        
    })
}


export default tareas;