import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Reservation from '../src/models/Reservation.js';
import { crearReserva } from '../src/services/reservationService.js';
import { crearUsuario } from '../src/services/userService.js';
import { ReservationMesa, ReservationTurnos } from '../src/core/enums.js';


describe('Pruebas para crearReserva', () => {
  let mongoServer;

  beforeAll(async () => {
    console.error = () => {};
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Insertar un usuario real en la DB
    await crearUsuario({
      nombre: 'Juan',
      apellido: 'Pérez',
      username: 'jp',
      rol: 'Cliente',
      password: 'juanperez'
    });
  });

  afterEach(async () => {
    await Reservation.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('debería crear una reserva correctamente', async () => {
    const requestBody = {
      reserva: `${ReservationMesa.CUATRO}|${ReservationTurnos.MANIANA_TURNO_UNO}`,
      nombreCliente: 'Juan Pérez',
      comentario: 'Cena',
      usernameUsuarioCreador: 'jp',
    };

    const [numMesa, fechaDeTurno] = requestBody.reserva.split('|');
    const reservationData = {
      numMesa: parseInt(numMesa, 10),
      fechaDeTurno: fechaDeTurno,
      nombreCliente: requestBody.nombreCliente,
      comentario: requestBody.comentario,
      usernameUsuarioCreador: requestBody.usernameUsuarioCreador,
    };

    const nuevaReserva = await crearReserva(reservationData);

    expect(nuevaReserva).toHaveProperty('_id');
    expect(nuevaReserva.numMesa).toBe(parseInt(numMesa, 10));
    expect(nuevaReserva.nombreCliente).toBe('Juan Pérez');
    expect(nuevaReserva.comentario).toBe('Cena');
    expect(nuevaReserva.usernameUsuarioCreador).toBe('jp');
    expect(nuevaReserva.estado).toBe('Pendiente');
  });

  //TEST 2:
  it('debería lanzar un error si la fecha no es válida', async () => {
    const reservationData = {
      numMesa: 4,
      fechaDeTurno: '2000-11-22T20:00:00.000Z',
      nombreCliente: 'Juan Pérez',
      comentario: 'Cena',
      usernameUsuarioCreador: 'jp',
    };

    await expect(crearReserva(reservationData)).rejects.toEqual({
      isClientError: true,
      message: `La reserva para la mesa ${reservationData.numMesa} en la fecha ${reservationData.fechaDeTurno} no es válida.`,
    });
  });

  //TEST 3:
  it('debería lanzar un error si el usuario no existe', async () => {
    const requestBody = {
      reserva: `${ReservationMesa.CUATRO}|${ReservationTurnos.MANIANA_TURNO_UNO}`,
      nombreCliente: 'Juan Pérez',
      comentario: 'Cena',
      usernameUsuarioCreador: 'usuarioInexistente',
    };

    const [numMesa, fechaDeTurno] = requestBody.reserva.split('|');
    const reservationData = {
      numMesa: parseInt(numMesa, 10),
      fechaDeTurno: fechaDeTurno,
      nombreCliente: requestBody.nombreCliente,
      comentario: requestBody.comentario,
      usernameUsuarioCreador: requestBody.usernameUsuarioCreador,
    };

    await expect(crearReserva(reservationData)).rejects.toThrow(
      `El usuario con username ${reservationData.usernameUsuarioCreador} no existe en la base de datos.`
    );
  });

});