import { request, response } from 'express';
import { validateRegistroCargo } from '../helpers/schemaRegistroCargo.js';
import { RegistroCargo } from '../models/index.js';
import cargoService from '../services/cargos.service.js';
import { HttpStatus } from '../utils/status.utils.js';
import fs from "fs";

const cargoOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const registroCargo = await RegistroCargo.findOne({
      where: { id, estado: true },
    });

    if (!registroCargo) {
      return res
        .status(404)
        .json({ message: 'Lugar de comisión no encontrado' });
    }
    res
      .status(200)
      .json({ message: 'Lugar encontrado', lugarComision: registroCargo });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const cargoAll = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const { rows:registroCargo, count } = await RegistroCargo.findAndCountAll({
      where: { estado: true },
      limit: pageSize,
      
      offset,
      order: [['id', 'DESC']],
    });

    res
      .status(200)
      .json({ message: 'Lista de cargos', registroCargo: registroCargo || [], count });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const cargoAdd = async (req = request, res = response) => {
  const { body } = req;
  const { error } = validateRegistroCargo(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    const existCode = await RegistroCargo.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }

    const registroCargo = await RegistroCargo.create({ ...body });
    res.status(201).json({ message: 'Se ha creado con éxito', registroCargo });
  } catch (err) {
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};

const cargoAddAll = async (req = request, res = response) => {
  try {
    console.log(req.file.path)
  
      const response = await cargoService.importCargos(req.file.path);
      return res.status(HttpStatus.CREATED).json({
        response
      });
  } catch (error) {
    console.error("ERROR IN cargoAddAll",error);
    fs.unlinkSync(req.file.path);
  
    return res.status(HttpStatus.BAD_REQUEST).json({
      error
    });
  }
};

const cargoUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const registroCargo = await RegistroCargo.findByPk(id);
/*     const existCode = await RegistroCargo.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }
 */
    if (!registroCargo) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

    await RegistroCargo.update(
      { ...body },
      {
        where: {
          id,
        },
      }
    );

    res.json({
      message: 'Lugar de comision actualizado',
      registroCargo: { ...body },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const cargoDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const registroCargo = await RegistroCargo.findByPk(id);
    if (!registroCargo) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    await registroCargo.destroy();
    res.status(200).json({ message: 'Se elimino con éxito', registroCargo });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const cargoBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const registroCargo = await RegistroCargo.findByPk(element);
      // if (!registroCargo) {
      //   return res.status(404).json({ message: 'El dato ingresado no existe' });
      // }
      await registroCargo.update({ estado: false });
      if (body.length - 1 === index) {
        res.status(200).json({ message: 'Se han eliminado con exito' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

export {
  cargoOne,
  cargoAll,
  cargoAdd,
  cargoAddAll,
  cargoUpdate,
  cargoDelete,
  cargoBlockDelete,
};
