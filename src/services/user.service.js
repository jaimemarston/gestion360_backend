
import { sequelize } from "../database/db.js";
import { Sequelize } from "sequelize";
import {
  Usuario
} from "../models/index.js";
import bcryptjs from 'bcryptjs';

const importUsers = async (data) => {

  const salt = bcryptjs.genSaltSync();


  const dataUser = await data.map((row) => {
    const user = {
      nombre: row.nombre,
      codigo: row.codigo,
      dni: row.docIdentidad,
      password: bcryptjs.hashSync(row.docIdentidad, salt),
      estado: row.estado,
      email: row.email,
      rol: 'USER_ROLE'

    }

    return user;
  })

  const result = await Usuario.bulkCreate(dataUser, {
    ignoreDuplicates: true
  })

  const transaction = await sequelize.transaction();


  try {

    const usuariosConCorreosEspecificos = await Usuario.findAll({
      attributes: ['email'], // Seleccionar solo el atributo 'id'
      where: {
        email: {
          [Sequelize.Op.in]: dataUser.map(user => user.email),
        },
      },
    });

    const alreadyExistEmail = usuariosConCorreosEspecificos.map(user => user.email);


    console.log("HERE 0");

    console.log("HERE 1");
    const updatePromises = dataUser.map(async (updatedRecord) => {
      if (updatedRecord.email && !alreadyExistEmail.includes(updatedRecord.email)) {
        await Usuario.update(
          {
            codigo: updatedRecord.codigo,
            nombre: updatedRecord.nombre,
            estado: updatedRecord.estado,
            email: updatedRecord.email,
          },
          {
            where: { dni: updatedRecord.dni },
            transaction,
          }
        );
      }
      else {
        await Usuario.update(
          {
            codigo: updatedRecord.codigo,
            nombre: updatedRecord.nombre,
            estado: updatedRecord.estado,
          },
          {
            where: { dni: updatedRecord.dni },
            transaction,
          }
        );
      }
    });

    await Promise.all(updatePromises);
    console.log("HERE 3");
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Error en la actualización masiva USUARIOS:', error.message);
  }

  // Movemos la confirmación de la transacción fuera del bloque try-catch
  try {
    if (transaction) {
      await transaction.commit();
    }
  } catch (commitError) {
    console.error('Error al confirmar la transacción:', commitError.message);
  }

  return result;
}

export default {
  importUsers
}