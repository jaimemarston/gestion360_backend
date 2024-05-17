import { request, response } from 'express';
import { validateLugarSolicitud } from '../helpers/lugarSolicitud.js';
import { LugarComision, Solicitud } from '../models/index.js';
import placeCommisionService from '../services/placesCommission.service.js';
import { HttpStatus } from '../utils/status.utils.js';
import fs from "fs";
import { CONNREFUSED } from 'dns';

const comisionOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const lugarComision = await LugarComision.findOne({
      where: { id, estado: true },
    });

    if (!lugarComision) {
      return res
        .status(404)
        .json({ message: 'Lugar de comisión no encontrado' });
    }
    res.status(200).json({ message: 'Lugar encontrado', lugarComision });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const comisionAll = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const { rows:comisiones, count } = await LugarComision.findAndCountAll({
      where: { estado: true },
      limit: pageSize,
      offset,
      order: [['id', 'DESC']],
    });

    res
      .status(200)
      .json({ message: 'Lista de cargos', comisiones: comisiones || [], count });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const comision = async (req = request, res = response) => {
  try {

    const { rows:comisiones, count } = await LugarComision.findAndCountAll({
      order: [['id', 'DESC']],
    });

    res
      .status(200)
      .json({ message: 'Lista de cargos', comisiones: comisiones || [], count });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const comisionAdd = async (req = request, res = response) => {
  const { body } = req;
  const { error } = validateLugarSolicitud(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    const existCode = await LugarComision.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }

    const lugarComision = await LugarComision.create({ ...body });
    res.status(201).json({ message: 'Se ha creado con éxito', lugarComision });
  } catch (err) {
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};

const comisionAddAll = async (req = request, res = response) => {
  try {
    console.log(req.file.path)
  
      const response = await placeCommisionService.importPlacesCommission(req.file.path);
      return res.status(HttpStatus.CREATED).json({
        response
      });
  } catch (error) {
    console.error("ERROR IN comisionAddAll",error);
    fs.unlinkSync(req.file.path);
  
    return res.status(HttpStatus.BAD_REQUEST).json({
      error
    });
  }
};

const comisionUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const lugarComision = await LugarComision.findByPk(id);
/*     const existCode = await LugarComision.findOne({
      where: { codigo: body.codigo },
    });
 */
/*     if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }
 */
    if (!lugarComision) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

    await LugarComision.update(
      { ...body },
      {
        where: {
          id,
        },
      }
    );

    res.json({
      message: 'Lugar de comisión actualizado',
      lugar: { ...body },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const comisionDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const lugarComision = await LugarComision.findByPk(id);
    
    if (!lugarComision) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

   

    const count = await Solicitud.count({where: {lugarComision: id}});

    if (count > 0) {
      return res.status(400).json({ message: 'No se puede eliminar la comision  porque tiene solicitudes asociadas.' });
     
    } 
    await lugarComision.destroy();
   return  res.status(200).json({ message: 'Se elimino con éxito' });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const comisionBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const lugarComision = await LugarComision.findByPk(element);
      // if (!lugarComision) {
      //   return res.status(404).json({ message: 'El dato ingresado no existe' });
      // }
      await lugarComision.update({ estado: false });
      if (body.length - 1 === index) {
        res.status(200).json({ message: 'Se han eliminado con éxito' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

export {
  comisionOne,
  comisionAll,
  comisionAdd,
  comisionAddAll,
  comisionUpdate,
  comisionDelete,
  comisionBlockDelete,
  comision
};
