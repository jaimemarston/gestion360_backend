import { request, response } from 'express';
import { validateRendicionProductSchema } from '../helpers/schemaRendicionGastosProducto.js';
import { RendicionGastosProducto, RendicionGastos } from '../models/index.js';

const rendGastosProductsAll = async (req = request, res = response) => {
  console.log('data');
  try {
    const [rendicionGastosProduct, count] = await Promise.all([
      RendicionGastosProducto.findAll({
        order: ['id'],
        where: { estado: true },
      }),
      RendicionGastosProducto.count({
        where: { estado: true },
      }),
    ]);
    res.status(200).json({
      message: 'Lista de rendición de gastos',
      rendicionGastosProduct,
      count,
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const rendGastosProductsOne = async (req = request, res = response) =>{
 const {id} = req.params;
  try {
   
    const rendicionGastosProduct = await  RendicionGastosProducto.findByPk(id )

    rendicionGastosProduct.hola =' Hola'


    res.status(200).json({
      message: 'Lista de rendición de gastos',
      rendicionGastosProduct: rendicionGastosProduct,
     
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const rendGastosProductsByRendicion = async (req = request, res = response) => {

  const {rendicion} = req.params;

try {

  const rendicionGastosProduct = await RendicionGastosProducto.findAll({where: {	rendicionGastosId: rendicion}})

  res.status(200).json({
    message: 'Lista de rendición de gastos',
    rendicionGastosProduct,
  });

  
} catch (error) {
  return res.status(400).json({ message: 'Hable con el administrador', error });
}


};

const rendGastosProductsAdd = async (req = request, res = response) => {
  
  const { body } = req;

 

  const { error } = validateRendicionProductSchema(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    const id = body.rendicionGastosId;
    const rendicionGastos = await RendicionGastos.findOne({
      where: { id, estado: true },
    });

    if (!rendicionGastos) {
      return res.status(404).json({ message: 'Id no encontrado' });
    }

    const rendicionGastosProduct = await RendicionGastosProducto.create({
      ...body,
    });

    res
      .status(201)
      .json({ message: 'Se ha creado con éxito', rendicionGastosProduct });
  } catch (err) {
    console.log('error', err);
    res.status(400).json({ message: 'hable con el administrador', error: err });
  }
};

const rendGastosProductsUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const {body} = req;
 
  try {
    const { error } = validateRendicionProductSchema(req.body);
    if (error) {
      const err = error.details[0].message;
      return res.status(400).json({ message: err });
    }
    const rendicionGastosProducts = await RendicionGastosProducto.findByPk(id);
    if (!rendicionGastosProducts) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }

   const rendicionGastosProduct =  await rendicionGastosProducts.update({...body}, {where: {id}})

   console.log(rendicionGastosProduct)
     res
     .status(201)
     .json({ message: 'Se ha creado con éxito', rendicionGastosProduct });
    
  } catch (error) {
  
    res.status(400).json({ message: 'hable con el administrador', error });
  }
};

const rendGastosProductsDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const rendicionGastosProducts = await RendicionGastosProducto.findByPk(id);
    if (!rendicionGastosProducts) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    console.log(id);

    await RendicionGastosProducto.destroy({ where: { id } });
    res
      .status(200)
      .json({ message: 'Se elimino con éxito', rendicionGastosProducts });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const rendGastosProductsBlockDelete = (req = request, res = response) => {};

export {
  rendGastosProductsAll,
  rendGastosProductsOne,
  rendGastosProductsByRendicion,
  rendGastosProductsAdd,
  rendGastosProductsUpdate,
  rendGastosProductsDelete,
  rendGastosProductsBlockDelete,
};
