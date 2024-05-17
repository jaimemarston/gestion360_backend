import { request, response } from 'express';
import { Usuario, registroEmpleado } from '../models/index.js';
import bcryptjs from 'bcryptjs';
import { validateUserSchema } from '../helpers/schemaUser.js';

const userAll = async (req = request, res = response) => {
  const [usuario, count] = await Promise.all([
    Usuario.findAll({
      order: ['id'],
    }),
    Usuario.count(),
  ]);
  res.status(200).json({ message: 'Lista de usuarios', usuario, count });
};



const userCreate = async (req = request, res = response) => {

  const users = [{    codigo:"12345",
  nombre:"Admin Role",
  email:"admin@gmail.com",
  password:"123456789",
  rol:"ADMIN_ROLE",
  estado:"true"},
  {    codigo:"54321",
  nombre:"Responsable",
  email:"responsable@gmail.com",
  password:"123456789",
  rol:"RESPONSABLE_ROLE",
  estado:"true"},
  {    codigo:"98765",
  nombre:"User",
  email:"user@gmail.com",
  dni:'10585940',
  password:"123456789",
  rol:"USER_ROLE",
  estado:"true"},

]
const salt = bcryptjs.genSaltSync();

  
  try {

    const dataUser =   users.map((element) => {

      element.password = bcryptjs.hashSync(element.password, salt);

    return element
      
    })
    
   
    const usuarios = await Usuario.bulkCreate(dataUser, {
      ignoreDuplicates: true
    })

    const empleado = await registroEmpleado.create(  {    codigo:"98765",
    nombre:"User",
    email:"user@gmail.com",
    docIdentidad: '10585940',
    ndocumento: '10585940',
    phone:"04167871458",
    cargo: 'usuario',
    estado: true},)
    



    res.status(201).json({ message: 'Usuario creado con éxito', usuarios, empleado });
  } catch (error) {
    console.log('=>', error);
    throw new Error(error);
  }


};

const updatePassword = async ( req = request, res = response) => {
  const salt = bcryptjs.genSaltSync();
  const body = req.body;

  body.password = bcryptjs.hashSync(body.password, salt);

  /* const userUpdate = await Usuario.findOne({where:{email: body.email}}) */


  const newPassword = await Usuario.update({password: body.password}, {where:{id: body.id}})


  res.status(201).json({ message: 'Contraseña actualizada con exito'});


}



const userOne = async (req = request, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findOne({
    where: { id },
    attributes: { exclude: ['password'] },
  });

  if (!usuario) {
    return res.status(404).json({ message: 'No existe el usuario' });
  }

  

  res.status(200).json({ message: 'Usuario encontrado', usuario });
};

const userAdd = async (req = request, res = response) => {
  const { body } = req;

  const { error } = validateUserSchema(req.body);
  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }

  

  try {
    const existEmail = await Usuario.findOne({
      where: { email: body.email },
    });

    if (existEmail) {
      return res.status(404).json({ message: 'El correo ya existe' });
    }
    // TODO Encriptando password
    const salt = bcryptjs.genSaltSync();
    body.password = bcryptjs.hashSync(body.password, salt);

    const usuario = await Usuario.create({ ...body });



    res.status(201).json({ message: 'Usuario creado con éxito', usuario });
  } catch (error) {
    console.log('=>', error);
    throw new Error(error);
  }
};

const userUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;

  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    return res.status(404).json({ message: 'El usuario no existe' });
  }

  // TODO Encriptando password
  const salt = bcryptjs.genSaltSync(10);
  body.password = bcryptjs.hashSync(body.password, salt);
  await Usuario.update(
    { ...body },
    {
      where: {
        id,
      },
    }
  );

  res.json({ message: 'Usuario actualizado', usuario: { ...body } });
};

const userDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByPk(id);
  const usuarioAutenticado = req.usuario;
  if (!usuario) {
    return res.status(404).json({ message: 'No existe el usuario' });
  }
  await usuario.update({ estado: false });
  res.json({ message: 'Usuario eliminado', usuario, usuarioAutenticado });
};

export { userAll, userOne, userAdd, userUpdate, userDelete, userCreate, updatePassword };
