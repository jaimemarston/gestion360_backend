import { request, response } from 'express';
import {  RegistroDocumento, registroEmpleado } from '../models/index.js';
import empleadoService from '../services/empleado.service.js';
import userService from '../services/user.service.js';
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
      include: [
        {
          model: RegistroDocumento
        }
      ]
    })
    res
    .status(201)
    .json({ message: 'Se han encontrado empleados con éxito', registroEmpleados });
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};

const getEmpleadoState = async (req = request, res = response) => {

  const {estado} = req.params;
  let whereEstado = {};

  if (estado === 'activo') {
    whereEstado.estado = true;
  } else if (estado === 'inactivo') {
    whereEstado.estado = false;
  }


  try {

    const registroEmpleados = await registroEmpleado.findAll({
      where:whereEstado,
      include: [
        {
          model: RegistroDocumento
        }
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
          model: RegistroDocumento
        }
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
