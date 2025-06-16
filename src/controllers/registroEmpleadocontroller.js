import { request, response } from 'express';
import {  RegistroDocumento, registroEmpleado } from '../models/index.js';
import empleadoService from '../services/empleado.service.js';
import userService from '../services/user.service.js';
import { Sequelize } from "sequelize";

const addEmpleado = async (req = request, res = response) => {
  try {

    console.log(req.file.path)
    const {result, data} = await empleadoService.importEmpleados(req.file.path);
    const user = await userService.importUsers(data)
    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', result });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};


const getEmpleado = async (req = request, res = response) => {
  try {

    const registroEmpleados = await registroEmpleado.findAll({
      include: [ { model: RegistroDocumento } ]
    })
    res
    .status(201)
    .json({ message: 'Se han encontrado empleados con éxito', registroEmpleados });
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};

const getEmpleadoState = async (req = request, res = response) => {

  const { estado } = req.params;
  let whereEstado = {
    where: {
      estado: {
        [Sequelize.Op.eq]: estado === 'activo'
      }
    }
  };

  if (estado === 'activo' || estado === 'inactivo') {
    whereEstado.estado = estado === 'activo';
  }

  const { documentsFilter, firmedStatus} = req.query;
  const filterDocument = documentsFilter !== 'todos'

  const queryDocument = {
    where: {
      tipodoc : {
        [Sequelize.Op.eq]: documentsFilter
      },
      estado: {
        [Sequelize.Op.eq]: firmedStatus === 'true'
      },
    }
  };

  try {
    const registroEmpleados = await registroEmpleado.findAll({
      where: whereEstado,
      include: [
        {
          model: RegistroDocumento,
          required: documentsFilter === 'null' ? false : true,
          where: { estado: query },
          order: [
            ['estado', 'ASC'],
            ['certified', 'ASC']
          ]
        }
      ],
      order: [
        [{ model: RegistroDocumento }, 'estado', 'ASC'],
        [{ model: RegistroDocumento }, 'certified', 'ASC']
      ]
    })
    res
    .status(201)
    .json({ message: 'Se han encontrado empleados con éxito', registroEmpleados });
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};

const getEmpleadoByDni = async (req = request, res = response) => {
  const dni = req.params.dni;

  try {

    const registroEmpleados = await registroEmpleado.findAll({
      where:{ndocumento:dni},
      include: [
        {
          model: RegistroDocumento,
          order: [
            ['estado', 'ASC'],
            ['certified', 'ASC']
          ]
        }
      ],
      order: [
        [{ model: RegistroDocumento }, 'estado', 'ASC'],
        [{ model: RegistroDocumento }, 'certified', 'ASC']
      ]
    })
    res
    .status(201)
    .json({ message: 'Se han encontrado empleados con éxito', registroEmpleados });
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};

const deleteEmpleado = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const registroEmpleados = await registroEmpleado.destroy({where:{id}})
    res
    .status(201)
    .json({ message: 'Se ha eliminado el  empleado con éxito', registroEmpleados });
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};



export {
  addEmpleado,
  getEmpleado,
  deleteEmpleado,
  getEmpleadoByDni,
  getEmpleadoState
};