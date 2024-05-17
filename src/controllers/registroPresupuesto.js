import { request, response } from 'express';
import { validateRegistroPresupuesto } from '../helpers/schemaPresupuestoFinanciero.js';
import { registroPresupuesto as RegistroPresupuesto } from "../models/index.js";
import { HttpStatus } from '../utils/status.utils.js';
import presupuesto from '../services/presupuesto.service.js';
import fs from "fs";

const registroPresupuestoOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const presupuestos = await RegistroPresupuesto.findOne({
      where: { id, estado: true },
    });

    if (!presupuestos) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json({ message: 'Proyecto encontrado', presupuestos });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const registroPresupuestoAll = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const { rows:presupuestos, count } = await RegistroPresupuesto.findAndCountAll({
      where: { estado: true },
      limit: pageSize,
      offset,
      order: [['id', 'DESC']],
    });

    res
      .status(200)
      .json({ message: 'Lista de presupuestos', presupuestos: presupuestos || [], count });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const registroPresupuestoAdd = async (req = request, res = response) => {
  const { body } = req;

  const { error } = validateRegistroPresupuesto(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    const existCode = await RegistroPresupuesto.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }

    const presupuestos = await RegistroPresupuesto.create({ ...body });
    res
      .status(201)
      .json({ message: 'Se ha creado con éxito', presupuestos });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};

const registroPresupuestoAddAll = async (req = request, res = response) => {
try {
 

    const response = await presupuesto.importBudgets(req.file.path);
    return res.status(HttpStatus.CREATED).json({
      response
    });
} catch (error) {
  console.error("ERROR IN registroPresupuestoAddAll",error);
  fs.unlinkSync(req.file.path);

  return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error en datos, puede que sea duplicado' });
}
};

const registroPresupuestoUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const presupuestos = await RegistroPresupuesto.findByPk(id);
    // const existCode = await RegistroPresupuesto.findOne({
    //   where: { codigo: body.codigo },
    // });

    // if (existCode) {
    //   return res.status(404).json({ message: 'El código ya existe' });
    // }

    if (!presupuestos) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

    await RegistroPresupuesto.update(
      { ...body },
      {
        where: {
          id,
        },
      }
    );

    res.json({
      message: 'Proyecto actualizado',
      proyecto: { ...body },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const registroPresupuestoDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const presupuestos = await RegistroPresupuesto.findByPk(id);
    if (!presupuestos) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    await presupuestos.destroy( {where: {id}} );
    res.status(200).json({ message: 'Se elimino con éxito', presupuestos });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const registroPresupuestoBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const presupuestos = await RegistroPresupuesto.findByPk(element);
      // if (!presupuestos) {
      //   return res.status(404).json({ message: 'El dato ingresado no existe' });
      // }
      await presupuestos.update({ estado: false });
      if (body.length - 1 === index) {
        res.status(200).json({ message: 'Se han eliminado con éxito' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

export {
  registroPresupuestoOne,
  registroPresupuestoAll,
  registroPresupuestoAdd,
  registroPresupuestoAddAll,
  registroPresupuestoUpdate,
  registroPresupuestoDelete,
  registroPresupuestoBlockDelete,
};
