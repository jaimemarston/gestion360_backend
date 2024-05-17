import { request, response } from 'express';
import { validateRegistroPresupuesto } from '../helpers/schemaPresupuestoFinanciero.js';
import { RegistroPresupuestoFinanciero } from "../models/index.js";
import { HttpStatus } from '../utils/status.utils.js';
import presupuestoFinanciero from '../services/presupuestoFinanciero.service.js';
import fs from "fs";

const registroPresupuestoFinancieroOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const presupuestos = await RegistroPresupuestoFinanciero.findOne({
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

const registroPresupuestoFinancieroAll = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const { rows:presupuestos, count } = await RegistroPresupuestoFinanciero.findAndCountAll({
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

const registroPresupuestoFinancieroAdd = async (req = request, res = response) => {
  const { body } = req;
  // console.log(body);
  const { error } = validateRegistroPresupuesto(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    const existCode = await RegistroPresupuestoFinanciero.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }

    const presupuestos = await RegistroPresupuestoFinanciero.create({ ...body });
    res
      .status(201)
      .json({ message: 'Se ha creado con éxito', presupuestos });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};

const registroPresupuestoFinancieroAddAll = async (req = request, res = response) => {
try {
  console.log(req.file.path)

    const response = await presupuestoFinanciero.importBudgets(req.file.path);
    return res.status(HttpStatus.CREATED).json({
      response
    });
} catch (error) {
  console.error("ERROR IN registroPresupuestoFinancieroAddAll",error);
  fs.unlinkSync(req.file.path);

  return res.status(HttpStatus.BAD_REQUEST).json({
    error
  });
}
};

const registroPresupuestoFinancieroUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const presupuestos = await RegistroPresupuestoFinanciero.findByPk(id);
    // const existCode = await RegistroPresupuestoFinanciero.findOne({
    //   where: { codigo: body.codigo },
    // });

    // if (existCode) {
    //   return res.status(404).json({ message: 'El código ya existe' });
    // }

    if (!presupuestos) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

    await RegistroPresupuestoFinanciero.update(
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

const registroPresupuestoFinancieroDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const presupuestos = await RegistroPresupuestoFinanciero.findByPk(id);
    if (!presupuestos) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    await presupuestos.destroy({where: {id}});
    res.status(200).json({ message: 'Se elimino con éxito', presupuestos });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const registroPresupuestoFinancieroBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const presupuestos = await RegistroPresupuestoFinanciero.findByPk(element);
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
  registroPresupuestoFinancieroOne,
  registroPresupuestoFinancieroAll,
  registroPresupuestoFinancieroAdd,
  registroPresupuestoFinancieroAddAll,
  registroPresupuestoFinancieroUpdate,
  registroPresupuestoFinancieroDelete,
  registroPresupuestoFinancieroBlockDelete,
};
