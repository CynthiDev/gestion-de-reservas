import * as reservationService from '../services/reservationService.js';
const MSG_ERROR_500 = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
const HEADER_ACCEPT = 'accept';
const ACCEPT_POSTMAN = '*/*';

export async function crearReserva( req, res) {
    try {
        const { reserva, nombreCliente, comentario, usernameUsuarioCreador } = req.body;
        const [numMesa, fechaDeTurno] = reserva.split('|');
        const reservaCompleta = {
            numMesa,
            fechaDeTurno,
            nombreCliente,
            comentario,
            usernameUsuarioCreador
        };

        const nuevaReserva = await reservationService.crearReserva(reservaCompleta);
        if(!nuevaReserva) return res.status(404).json({ message: `El usuario con username: ${req.body.usernameUsuarioCreador}, no está registrado en la base de datos ` }); 
        // Respuesta exitosa
        if (req.get(HEADER_ACCEPT) === ACCEPT_POSTMAN) { //valor seteado desde Postman
            return res.status(201).json(nuevaReserva);
        } 

        return res.render('reservationConfirmed')
    } catch (error) {
        console.error("Error en el controlador:", error);
        if (error.isClientError) {
            return res.status(error.statusCode || 400).json({ message: error.message });
        }
        
        // Si el error es de validación de Mongoose 
        if (error.name === 'ValidationError') {
        if (error.errors && error.errors.usernameUsuarioCreador) {
           return res.status(400).send({
        message: error.errors.usernameUsuarioCreador.message,  
         });
        }

        return res.status(500).json({ message: MSG_ERROR_500});
    }}
};



export async function obtenerReservasPorRolDeUsuario (req, res) {
    try {
        const reservas = await reservationService.getReservasPorRolUsuario(req.params.username);

        console.log(reservas)
        if(!reservas || reservas.length === 0){
            return res.status(404).json({ message: 'No se encontraron reservas' });
        }
        if (req.get(HEADER_ACCEPT) === ACCEPT_POSTMAN) { //valor seteado desde Postman
            return res.json(reservas);
        } 

        return res.render('reservationList', { listaReservas: reservas });
    } catch (error) {
        console.error("Error en el controlador:", error);
        if (error.isClientError) {
            return res.status(error.statusCode || 400).json({ message: error.message });
        }
        console.log(error)
        return res.status(500).json({ message: MSG_ERROR_500});
    }
};


export async function actualizarEstadoReserva (req, res) {
    try {
        const reservas = await reservationService.actualizarEstado(req.params.id, req.params.nuevoEstado);
        if (!reservas || reservas.length === 0) {
            return res.status(404).json({ message: `No se encontró la reserva con id: ${req.params.id}` });
        }
        return res.json(reservas);
    } catch (error) {
        console.error("Error en el controlador:", error);
        if (error.isClientError) {
            return res.status(error.statusCode || 400).json({ message: error.message });
        }
        return res.status(500).json({ message: MSG_ERROR_500 });
    }
};


export async function eliminarReserva (req, res) {
    try {
        const reservas = await reservationService.eliminarReservaPorId(req.params.id);
        if (!reservas || reservas.length === 0) {
            return res.status(404).json({ message: `No se encontró la reserva con id: ${req.params.id}` });
        }
        return res.json(reservas);
    } catch (error) {
        console.error("Error en el controlador:", error);
        if (error.isClientError) {
            return res.status(error.statusCode || 400).json({ message: error.message });
        }
        return res.status(500).json({ message: MSG_ERROR_500});
    }
};



export async function obtenerFechaTurnosDisponibles (req, res) {
    try {
        const fechaTurnosDisponibles = await reservationService.getFechaTurnosDisponibles();
        if(!fechaTurnosDisponibles || fechaTurnosDisponibles.length === 0){
            return res.status(404).json({ message: 'No se encontraron turnos disponibles' });
        }
        if (req.get(HEADER_ACCEPT) === ACCEPT_POSTMAN) { //valor seteado desde Postman
            return res.json(fechaTurnosDisponibles);
        }

        return res.render('newReservation', {fechasDisponibles: fechaTurnosDisponibles, user: req.session.user});
    } catch (error) {
        console.error("Error en el controlador:", error);
        if (error.isClientError) {
            return res.status(error.statusCode || 400).json({ message: error.message });
        }
        return res.status(500).json({ message: MSG_ERROR_500});
    }
};
