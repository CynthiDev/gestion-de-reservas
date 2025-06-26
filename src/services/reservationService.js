import { ReservationMesa, ReservationTurnos, ReservationState, UserRol,} from "../core/enums.js";
import { DateTime } from "luxon";
import Reservation from "../models/Reservation.js";
import User from "../models/User.js";

export async function crearReserva(reservationData) {
  try {
    //ValidacionFechaTurno
    const fechaValida = await esFechaTurnoValido(
      reservationData.fechaDeTurno,
      reservationData.numMesa
    );
    if (!fechaValida) {
      throw {
        isClientError: true,
        message: `La reserva para la mesa ${reservationData.numMesa} en la fecha ${reservationData.fechaDeTurno} no es válida.`,
      };
    }

    console.log("reuestBody: ", reservationData);
    const nuevaReserva = new Reservation(reservationData);
    await nuevaReserva.save();
    return nuevaReserva; // Retornar la nueva reserva
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw error;
  }
}

export async function getReservasPorRolUsuario(username) {
  try {
    // Obtener el usuario por su username desde la base de datos
    const usuarioEncontrado = await User.findOne({ username });

    if (!usuarioEncontrado) {
      throw {
        isClientError: true,
        message: `No se encontró ningún usuario registrado con el username: ${username}`,
      };
    }

    let reservasSelected;

    // Filtrar reservas según el rol del usuario
    if (usuarioEncontrado.rol === UserRol.CLIENTE) {
      reservasSelected = await Reservation.find({ usernameUsuarioCreador: username });
    } else if (usuarioEncontrado.rol === UserRol.PERSONAL) {
      reservasSelected = await Reservation.find(); // Todas las reservas
    }

    return reservasSelected;
  } catch (error) {
    console.error("Error al  obtener las reservas:", error);
    throw error;
  }
}

export async function actualizarEstado(idReserva, nuevoEstado) {
  try {
    if (!esEstadoValido(nuevoEstado)) {
      throw {
        isClientError: true,
        message: `El estado: ${nuevoEstado} , no es un valor válido`,
      };
    }

    const reservaActualizada = await Reservation.findByIdAndUpdate(
      idReserva,
      { estado: nuevoEstado },
      { new: true } // Opciones: devolver el documento actualizado
    );

    if (!reservaActualizada) {
      throw {
        isClientError: true,
        message: `No se encontró ninguna reserva con el ID: ${idReserva}`,
      };
    }

    // Retornar todas las reservas después de actualizar el estado de la reserva
    const todasLasReservas = await Reservation.find();
    return todasLasReservas;
  } catch (error) {
    console.error("Error al actualizar Estado: ", error);
    throw error;
  }
}

export async function eliminarReservaPorId(idReserva) {
  try {
    // Buscar y eliminar la reserva por ID usando Mongoose
    const reservaEliminada = await Reservation.findByIdAndDelete(idReserva);

    if (!reservaEliminada) {
      throw {
        isClientError: true,
        message: `No se encontró ninguna reserva con el ID: ${idReserva}`,
      };
    }

    // Retornar todas las reservas restantes después de la eliminación
    const todasLasReservas = await Reservation.find();
    return todasLasReservas;
  } catch (error) {
    console.error("Error al eliminar la reserva:", error);
    throw error;
  }
}

export async function getFechaTurnosDisponibles() {
  try {
    // Obtener las reservas activas directamente desde MongoDB
    const reservasActivas = await Reservation.find({ 
      estado: { $in: [ReservationState.PENDIENTE, ReservationState.CONFIRMADA, ReservationState.COMPLETADA] }
    });
    const totalTurnos = obtenerTotalDeturnos();
    const turnosDisponibles = eliminarTurnosOcupados(totalTurnos,reservasActivas);
    return turnosDisponibles; // Retornar la nueva reserva
  } catch (error) {
    console.error("Error al obtener los turnos disponibles:", error);
    throw error;
  }
}




//METODOS PRIVADOS

function eliminarTurnosOcupados(totalDeTurnos, reservasActivas) {
  const turnosReservados = new Set(
    reservasActivas.map(
      (reserva) =>
        `${reserva.numMesa}-${new Date(reserva.fechaDeTurno).toISOString()}`
    )
  );
  const turnosActualizados = totalDeTurnos.filter(
    (turno) => !turnosReservados.has(`${turno.mesa}-${turno.turno}`)
  );
  return turnosActualizados;
}


function obtenerTotalDeturnos() {
  const totalDeTurnos = [];
  Object.values(ReservationMesa).forEach((mesa) => {
    Object.values(ReservationTurnos).forEach((turno) => {
      totalDeTurnos.push({ mesa, turno });
    });
  });
  return totalDeTurnos;
}

function esEstadoValido(nuevoEstado) {
  return Object.values(ReservationState).includes(nuevoEstado);
}

export async function esFechaTurnoValido(fechaDeTurno, numeroMesa) {
  const turnosDisponibles = await getFechaTurnosDisponibles();
 // Buscar el turno en el array de turnos disponibles
 const existeFecha = turnosDisponibles.find(turno => 
  turno.mesa == numeroMesa && turno.turno == fechaDeTurno
);
  return existeFecha;
}
