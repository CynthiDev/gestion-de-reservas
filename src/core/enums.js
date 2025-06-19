import {crearFechaUTC} from '../utils/function.js';

export const ReservationState = {
    PENDIENTE: 'Pendiente',
    CONFIRMADA: 'Confirmada',
    CANCELADA: 'Cancelada',
    COMPLETADA: 'Completada'
};

export const UserRol = {
    CLIENTE: 'Cliente',
    PERSONAL: 'Personal'
}

export const ReservationMesa = {
    UNO: 1,
    DOS: 2,
    TRES: 3,
    CUATRO: 4,
    CINCO: 5,
}


export const ReservationTurnos = {
    HOY_TURNO_UNO: crearFechaUTC(20,0,0),
    HOY_TURNO_DOS: crearFechaUTC(21,0,0),
    HOY_TURNO_TRES: crearFechaUTC(22,0,0),
    MANIANA_TURNO_UNO: crearFechaUTC(20,0,1),
    MANIANA_TURNO_DOS: crearFechaUTC(21,0,1),
    MANIANA_TURNO_TRES: crearFechaUTC(22,0,1),
}