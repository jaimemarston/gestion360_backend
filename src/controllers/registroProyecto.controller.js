import { request, response } from 'express';
import { validateRegistroProyecto } from '../helpers/schemaRegistroProyecto.js';
import { RegistroProyecto, Solicitud } from "../models/index.js";
import { HttpStatus } from '../utils/status.utils.js';
import projectService from '../services/project.service.js';
import fs from "fs";

const regProyectoOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const registroProyecto = await RegistroProyecto.findOne({
      where: { id, estado: true },
    });

    if (!registroProyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json({ message: 'Proyecto encontrado', registroProyecto });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};


const regProyectoOneByName = async (req = request, res = response) => {
  const { proyecto } = req.params;
/* 
  const project = decodeURIComponent(proyecto) */
  console.log(proyecto)
  try {
    const registroProyecto = await RegistroProyecto.findOne({
      where: { nombreAbreviado: `${proyecto}`, estado: true },
    });

    if (!registroProyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json({ message: 'Proyecto encontrado', registroProyecto });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const regProyectoAll = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const { rows:registroProyecto, count } = await RegistroProyecto.findAndCountAll({
      where: { estado: true },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset,
   
    });

    res
      .status(200)
      .json({ message: 'Lista de proyectos', registroProyecto: registroProyecto || [], count });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};



const proyectoAll = async (req = request, res = response) => {
  try {

    const { rows:registroProyecto } = await RegistroProyecto.findAndCountAll({
      where: { estado: true },

   
    });

    res
      .status(200)
      .json({ message: 'Lista de proyectos', registroProyecto: registroProyecto || [] });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};



const regProyectoAdd = async (req = request, res = response) => {
  const { body } = req;
  // console.log(body);
  const { error } = validateRegistroProyecto(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    const existCode = await RegistroProyecto.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }

    const registroProyecto = await RegistroProyecto.create({ ...body });
    res
      .status(201)
      .json({ message: 'Se ha creado con éxito', registroProyecto });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};

const regProyectoAddAll = async (req = request, res = response) => {
try {
  console.log(req.file.path)

    const response = await projectService.importProjects(req.file.path);
    return res.status(HttpStatus.CREATED).json({
      response
    });
} catch (error) {
  console.error("ERROR IN regProyectoAddAll",error);
  fs.unlinkSync(req.file.path);

  return res.status(HttpStatus.BAD_REQUEST).json({
    error
  });
}
};

const regProyectoUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const registroProyecto = await RegistroProyecto.findByPk(id);
    // const existCode = await RegistroProyecto.findOne({
    //   where: { codigo: body.codigo },
    // });

    // if (existCode) {
    //   return res.status(404).json({ message: 'El código ya existe' });
    // }

    if (!registroProyecto) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

    await RegistroProyecto.update(
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

const regProyectoDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const registroProyecto = await RegistroProyecto.findByPk(id);
    if (!registroProyecto) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    
   
  const count = await Solicitud.count({ where: { registroProyectoId: registroProyecto.id } });
  if (count > 0) {

  
    return res.status(400).json({ message: 'No se puede eliminar el proyecto porque tiene solicitudes asociadas.' });
   
  } 
    await registroProyecto.destroy()
  

  return  res.status(200).json({ message: 'Se elimino con éxito', registroProyecto }); 
  } catch (err) {
   
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const regProyectoBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const registroProyecto = await RegistroProyecto.findByPk(element);
      // if (!registroProyecto) {
      //   return res.status(404).json({ message: 'El dato ingresado no existe' });
      // }
      await registroProyecto.update({ estado: false });
      if (body.length - 1 === index) {
        res.status(200).json({ message: 'Se han eliminado con éxito' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

export {
  regProyectoOne,
  regProyectoAll,
  regProyectoAdd,
  regProyectoAddAll,
  regProyectoUpdate,
  regProyectoDelete,
  regProyectoBlockDelete,
  regProyectoOneByName,
  proyectoAll
};
