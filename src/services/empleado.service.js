import xlsx from "xlsx";
import fs from "fs";
import { registroEmpleado, Usuario } from "../models/index.js";
import bcryptjs from 'bcryptjs';
import { sequelize } from "../database/db.js";
import { Sequelize } from "sequelize";

const importEmpleados = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // Eliminar la primera fila (encabezados de columna)
  rows.shift();
  rows.shift();

  const data = rows.map((row) => {
    const registro = {
      codigo: row[0].toString().trim(),
      docIdentidad: row[8].toString().trim(),
      ndocumento: row[8].toString().trim(),
      nombre: row[5].toString().trim(),
      estado: row[66].toString().trim(),
      phone: row[13].toString().trim(),
      cargo: row[15].toString().trim(),
      email: row[14].toString().trim(),
    };

    return registro
  });

  const result = await registroEmpleado.bulkCreate(data, {
    ignoreDuplicates: true
  });

  const transaction = await sequelize.transaction();


  try {
    const usuariosConCorreosEspecificos = await registroEmpleado.findAll({
      attributes: ['email'], // Seleccionar solo el atributo 'id'
      where: {
        email: {
          [Sequelize.Op.in]: data.map(user => user.email),
        },
      },
    });

    const alreadyExistEmail = usuariosConCorreosEspecificos.map(user => user.email);

    const updatePromises = data.map(async (updatedRecord) => {
      if (updatedRecord.email && !alreadyExistEmail.includes(updatedRecord.email)) {
        await registroEmpleado.update(
          {
            codigo: updatedRecord.codigo,
            nombre: updatedRecord.nombre,
            estado: updatedRecord.estado,
            phone: updatedRecord.phone,
            cargo: updatedRecord.cargo,
            email: updatedRecord.email,
          },
          {
            where: { docIdentidad: updatedRecord.docIdentidad },
            transaction,
          }
        );
      }
      else {
        await registroEmpleado.update(
          {
            codigo: updatedRecord.codigo,
            nombre: updatedRecord.nombre,
            estado: updatedRecord.estado,
            phone: updatedRecord.phone,
            cargo: updatedRecord.cargo,
          },
          {
            where: { docIdentidad: updatedRecord.docIdentidad },
            transaction,
          }
        );
      }
    });

    await Promise.all(updatePromises);
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Error en la actualización masiva:', error.message);
  }

  // Movemos la confirmación de la transacción fuera del bloque try-catch
  try {
    if (transaction) {
      await transaction.commit();
    }
  } catch (commitError) {
    console.error('Error al confirmar la transacción:', commitError.message);
  }

  fs.unlinkSync(filePath);
  return { result, data };
}

export default {
  importEmpleados
}