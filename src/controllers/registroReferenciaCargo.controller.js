import { request, response } from 'express';
import {  RegistroCodigoReferencia } from '../models/index.js';
import { HttpStatus } from '../utils/status.utils.js';
import codeReferencesService from '../services/codeReferences.service.js';


const referenciaAll = async (req = request, res = response) => {
  try {
    const page = req?.query?.page || 1;
    const pageSize = req?.query?.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const { rows: codigoReferencias, count } = await RegistroCodigoReferencia.findAndCountAll({
      /* where: { estado: true }, */
      limit: pageSize,
      offset,
      order: [['id', 'DESC']],
    });

    res
      .status(200)
      .json({ message: 'Lista de codigos de referencia', codigoReferencias:codigoReferencias || [], count });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const referenciaOne = async (req = request, res = response) => {
  try {
    const {id} = req.params;

  
    const codigoReferencias = await RegistroCodigoReferencia.findOne({
      where: { id: id },
    });

    

    res
      .status(200)
      .json({ message: 'Lista de codigos de referencia', codigoReferencias:codigoReferencias });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const referenciaOneCode = async (req = request, res = response) => {
  try {
    const {codigo} = req.params;

    console.log(codigo)
    const codigoReferencias = await RegistroCodigoReferencia.findOne({
      where: { codigo: codigo },
    });

    

    res
      .status(200)
      .json({ message: 'Lista de codigos de referencia', codigoReferencias:codigoReferencias });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};


const referenciaOneRuc = async (req = request, res = response) => {
  try {
    const {ruc} = req.params;




    const codigoReferencias = await RegistroCodigoReferencia.findOne({
      where: { ruc: ruc },
    });

  console.log(codigoReferencias,'DATAAAAAAAAAA')
    res
      .status(200)
      .json({ message: 'Lista de codigos de referencia', codigoReferencias:codigoReferencias });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const referencia = async (req = request, res = response) => {
  try {

    const {rows} = await RegistroCodigoReferencia.findAndCountAll()

    console.log(rows)

    res
      .status(200)
      .json({ message: 'Lista de codigos de referencia', codigoReferencias:rows });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};


const referenciaUpdate = async (req = request, res = response) => {
  try {
  
    const {body} = req;
    const {id} = req.params;

    const codigoReferencias= await RegistroCodigoReferencia.update({...body
    },
    {where:{id}});

    res
      .status(200)
      .json({ message: 'Lista de codigos de referencia', codigoReferencias:codigoReferencias, succes: true });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};


const referenciaAddAll = async (req = request, res = response) => {
  try {
    const response = await codeReferencesService.importCodeReferences(req.file.path);
    return res.status(HttpStatus.CREATED).json({
      response
    });
  } catch (error) {
    console.error("ERROR IN referenciaAddAll", error);
    fs.unlinkSync(req.file.path);

    return res.status(HttpStatus.BAD_REQUEST).json({
      error
    });
  }
};


const referenciaAdd = async (req = request, res = response) => {
  const {body} = req;
  try {

    const codigoReferencias = await RegistroCodigoReferencia.create(body);
    res
      .status(200)
      .json({ message: 'Lista de codigos de referencia', codigoReferencias:codigoReferencias});
  } catch (error) {


    return res.status(400).json({ message: 'Hable con el administrador', error });
  }
};

const referenciaDelete = async (req = request, res = response) => {
  const {id} = req.params;
  try {
    console.log(id)
    const codigoReferencias = await RegistroCodigoReferencia.destroy({where:{id}});
    res
      .status(200)
      .json({ message: 'codigo de referencia eliminado', codigoReferencias:codigoReferencias});
  } catch (error) {


    return res.status(400).json({ message: 'Hable con el administrador', error });
  }
};

export {
  referenciaAll,
  referenciaAddAll,
  referenciaAdd,
  referenciaDelete,
  referenciaUpdate,
  referencia,
  referenciaOne,
  referenciaOneCode,
  referenciaOneRuc
};
