import { request, response } from 'express';
import { validateSolicitudProductoSchema } from '../helpers/schemaSolicitudProducto.js';
import {
  RegistroProyecto,
  Solicitud,
  SolicitudProducto,
  LugarComision,
} from '../models/index.js';
import { Op } from 'sequelize';

const solicitudProductoAll = async (req = request, res = response) => {
  try {

    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;


    const [producto, count] = await Promise.all([
      SolicitudProducto.findAndCountAll({
        order: ['id'],
        where: { estado: true },
        limit: pageSize,
        offset

      }),
       SolicitudProducto.count({
        where: { estado: true },
      }), 
    ]);
  
    res
      .status(200)
      .json({ message: 'Lista de Productos', data: producto, count });
    
  } catch (error) {
    
  }


};

const solicitudProductoAdd = async (req = request, res = response) => {
  const { body } = req;
  const { solicitudId } = body;

  /*   const { error } = validateSolicitudProductoSchema(req.body); */
/*   if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  } */

  try {
    const resultId = await Solicitud.findOne({
      where: {
        [Op.and]: [{ id: solicitudId }, { estado: true }],
      },
    });

    // const exitsProyecto = await RegistroProyecto.findOne({
    //   where: { id: partidaPresupuestal },
    // });

    // if (!exitsProyecto) {
    //   return res.status(404).json({ message: 'No existe el proyecto' });
    // }

    if (!resultId) {
      return res.status(400).json({ message: 'No existe el usuario' });
    }

    const producto = await SolicitudProducto.create({ ...body });

    res
      .status(201)
      .json({ message: 'El producto ha sido creado con éxito', producto });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({ message: 'hable con el administrador', error });
  }
};


const solicitudProductoUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const  solicitud  = req.body;

  console.log(solicitud)


  try {
    const producto = await SolicitudProducto.update(
      {...solicitud},
      {
        where: {
          id,
        },
      });


    if (!producto) {
      return res.status(400).json({ message: 'No existe el usuario' });
    }

   /*  const producto = await SolicitudProducto.create({ ...body }); */

    res
      .status(201)
      .json({ message: 'El producto ha sido creado con éxito', producto });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({ message: 'hable con el administrador', error });
  }
};





const solicitudProductoDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await SolicitudProducto.findByPk(id);
  try {
    if (!producto) {
      return res.status(404).json({ message: 'No existe el producto' });
    }
    await SolicitudProducto.destroy({ where: { id } });
    res.json({ message: 'Producto eliminado', producto });
  } catch (error) {
    res.json({ message: 'Hable con el administrador', error });
  }
};

export { solicitudProductoAll, solicitudProductoAdd, solicitudProductoDelete, solicitudProductoUpdate };
