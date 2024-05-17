import { request, response } from 'express';
import { validateRegistroActividad } from '../helpers/schemaRegistroActividad.js';
import { RegistroActividad } from '../models/index.js';

const regActividadOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const registroActividad = await RegistroActividad.findOne({
      where: { id, estado: true },
    });

    if (!registroActividad) {
      return res
        .status(404)
        .json({ message: 'Lugar de comisión no encontrado' });
    }
    res.status(200).json({ message: 'Lugar encontrado', registroActividad });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const regActividadAll = async (req = request, res = response) => {
  try {

    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;


    const [rows, count] = await Promise.all([
      RegistroActividad.findAndCountAll({
        order: [['id', 'DESC']],
        where: { estado: true },
        limit: pageSize,
        offset

      }),
      RegistroActividad.count({
        where: { estado: true },
      }),
    ]);
    res.status(200).json({
      message: 'Lista de lugares de comisión',
      registroActividad: rows,
      count,
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const regActividadAdd = async (req = request, res = response) => {
  const { body } = req;
  const { error } = validateRegistroActividad(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    //  const existCode = await RegistroActividad.findOne({
    //    where: { codigo: body.codigo },
    //  });

    //  if (existCode) {
    //    return res.status(404).json({ message: 'El código ya existe' });
    //  }

    const registroActividad = await RegistroActividad.create({ ...body });
    res
      .status(201)
      .json({ message: 'Se ha creado con éxito', registroActividad });
  } catch (err) {
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};

const regActividadUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const registroActividad = await RegistroActividad.findByPk(id);

    if (!registroActividad) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

    await RegistroActividad.update(
      { ...body },
      {
        where: {
          id,
        },
      }
    );

    res.json({
      message: 'Registro de actividad actualizado',
      registroActividad: { ...body },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const regActividadDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const registroActividad = await RegistroActividad.findByPk(id);
    if (!registroActividad) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    await registroActividad.update({ estado: false });
    res
      .status(200)
      .json({ message: 'Se elimino con éxito', registroActividad });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const regActividadBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const registroActividad = await RegistroActividad.findByPk(element);
      // if (!registroActividad) {
      //   return res.status(404).json({ message: 'El dato ingresado no existe' });
      // }
      await registroActividad.update({ estado: false });
      if (body.length - 1 === index) {
        res.status(200).json({ message: 'Se han eliminado con éxito' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

export {
  regActividadAll,
  regActividadOne,
  regActividadAdd,
  regActividadUpdate,
  regActividadDelete,
  regActividadBlockDelete,
};
