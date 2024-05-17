import { request, response } from 'express';
import {  RegistroTipoDocumento,RendicionGastosProducto } from '../models/index.js';
import  importTipoDocService from "../services/tipoDocumento.service.js";


const addTipoDoc = async (req = request, res = response) => {
  try {

  
   const result = await  importTipoDocService.importTipoDoc(req.file.path);

    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', result });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};


const addTipoDocOne = async (req = request, res = response) => {
  const {body} = req;

  try {

    const existCode = await RegistroTipoDocumento.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }
    
   const result = await  RegistroTipoDocumento.create({...body});



  
    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', result });
 
    
  } catch (error) {
    res.status(400).json({ message: 'hable', error });
  }

};

const getAllTipoDoc = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;
    const { rows:result, count } = await  RegistroTipoDocumento.findAndCountAll({  limit: pageSize,
      order: [['id', 'DESC']],
      offset,})

    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', result, count });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};

const getAll = async (req = request, res = response) => {
  try {

    const { rows:result, count } = await  RegistroTipoDocumento.findAndCountAll({
      order: [['id', 'DESC']],
     })

    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', result, count });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};


const updateAllTipoDoc = async (req = request, res = response) => {
  const {id} = req.params
  const {body} = req;
  try {
    

   const registroTipoDocumento = await  RegistroTipoDocumento.update({...body}, {where: {id}})

    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', registroTipoDocumento });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }
};


const getOneTipoDoc = async (req = request, res = response) => {

  const {id} = req.params
  try {

   const result = await  RegistroTipoDocumento.findOne({where:{id}})

    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', result });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};

const getOneTipoDocName = async (req = request, res = response) => {

  const {tipo} = req.params
  try {

   const result = await  RegistroTipoDocumento.findOne({where:{nombre: `${tipo}`}})

    res
    .status(201)
    .json({ message: 'Se ha creado con éxito', result });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};


const deleteTipoDoc = async (req = request, res = response) => {
  try {

    const id = req.params.id

    const count = await RendicionGastosProducto.count({where: {tipo: id}});
    const result = await  RegistroTipoDocumento.findAll()
    if (count > 0) {
      return res.status(400).json({ message: 'No se puede eliminar el tipo  porque tiene rendicion de gastos  asociadas.' });
     
    } 

   const deleteTipoDoc = await  RegistroTipoDocumento.destroy({where: {id}})

   

   

    res
    .status(201)
    .json({ message: 'Se ha eliminado con éxito', result });

    
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }

};





export { addTipoDoc, getAllTipoDoc, deleteTipoDoc, getOneTipoDoc,getOneTipoDocName, addTipoDocOne, updateAllTipoDoc, getAll };
