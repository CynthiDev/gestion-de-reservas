import { DateTime } from 'luxon';
import fs from 'fs/promises'; 

/**
 * Retorna una fecha Personalizada en formato ISO
 * @param {number} horas 
 * @param {number} minutos 
 * @param {number} diasASumar - que se suman a la fecha de hoy 
 * @returns la fecha en formato ISO
 */
export function crearFechaUTC(horas, minutos, diasASumar = 0) {
    const hoy = DateTime.local();
    const fechaConDias = hoy.plus({ days: diasASumar });
    const fechaAjustada = fechaConDias.set({ hour: horas, minute: minutos, second: 0, millisecond: 0 });
    const fechaComoUTC = fechaAjustada.setZone('utc', { keepLocalTime: true }); // Convierto a UTC manteniendo la hora local
    return fechaComoUTC.toISO();
}


/**
 * Lee un archivo JSON
 * @param {string} filePath 
 * @returns {Object}
 */
export async function leerArchivoJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data); // Parsear a objeto
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        throw error;
    }
}
