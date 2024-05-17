import { request, response } from 'express';
import { validateRendicionGastos } from '../helpers/schemaRendicionGastos.js';
import {
  RegistroProyecto,
  RendicionGastos,
  RendicionGastosProducto,
} from '../models/index.js';

const rendGastosOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
  const [rendGastosProducts, producto] = await Promise.all([
    RendicionGastos.findByPk(id),
    RendicionGastosProducto.findAll({
      where: { rendicionGastosId: id },
    }),
  ]);

    if (!rendGastosProducts) {
      return res.status(404).json({ message: 'Id no encontrado' });
    }
    const { dataValues } = {
      ...rendGastosProducts,
    };

    dataValues.productos = producto;
    const suma = producto
      .map((item) => {
        let variable = Number(item.importe);
        return variable;
      })
      .reduce((prev, curr) => prev + curr, 0);
    res.status(200).json({
      message: 'Rendición encontrado',
      rendGastosProducts: dataValues,
      total: suma,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const rendGastosAll = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const {rows, count}  = await  RendicionGastos.findAndCountAll({
      where: { estado: true },
      limit: pageSize,
      offset,
      order: [['id', 'DESC']],
    });

    res.status(200).json({
      message: 'Lista de rendición de gastos',
      rendicionGastos: rows || [],
      count,
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};
const rendGastosAdd = async (req = request, res = response) => {
  const { body } = req;
  const { proyecto } = body;
  const { error } = validateRendicionGastos(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }

  try {
    const lista = await RendicionGastos.findAll({
      order: ['id'],
    });

    let nroLista = lista.length + 1;
    let nroSolicitud;

    if (nroLista <= 9) {
      nroSolicitud = `ABC00000${nroLista}`;
    } else if (nroLista <= 99) {
      nroSolicitud = `ABC0000${nroLista}`;
    } else if (nroLista <= 999) {
      nroSolicitud = `ABC000${nroLista}`;
    } else if (nroLista <= 9999) {
      nroSolicitud = `ABC00${nroLista}`;
    } else if (nroLista <= 99999) {
      nroSolicitud = `ABC0${nroLista}`;
    } else {
      nroSolicitud = `ABC${nroLista}`;
    }

    body.numeroRendicion = nroSolicitud;

    const exitsProyecto = await RegistroProyecto.findOne({
      where: { id: proyecto },
    });

    if (!exitsProyecto) {
      return res.status(404).json({ message: 'No existe el proyecto' });
    }

    const rendicionGastos = await RendicionGastos.create({ ...body });

    res
      .status(201)
      .json({ message: 'Se ha creado con éxito', rendicionGastos });
  } catch (err) {
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};

const rendGastosUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const rendicionGastos = await RendicionGastos.findByPk(id);

    if (!rendicionGastos) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

    await RendicionGastos.update(
      { ...body },
      {
        where: {
          id,
        },
      }
    );

    res.json({
      message: 'Rendicion de gastos actualizado',
      rendicionGastos: { ...body },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const rendGastosDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const rendicionGastos = await RendicionGastos.findByPk(id);
    if (!rendicionGastos) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    await rendicionGastos.update({ estado: false });
    res.status(200).json({ message: 'Se elimino con éxito', rendicionGastos });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const rendGastosBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const rendicionGastos = await RendicionGastos.findByPk(element);
      // if (!rendicionGastos) {
      //   return res.status(404).json({ message: 'El dato ingresado no existe' });
      // }
      await rendicionGastos.update({ estado: false });
      if (body.length - 1 === index) {
        res.status(200).json({ message: 'Se han eliminado con éxito' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

export {
  rendGastosAll,
  rendGastosOne,
  rendGastosAdd,
  rendGastosUpdate,
  rendGastosDelete,
  rendGastosBlockDelete,
};
