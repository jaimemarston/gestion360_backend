import { Folders, FoldersUsers, Usuario } from '../models/index.js'
import { v4 as uuidv4 } from 'uuid';
import {  Sequelize } from "sequelize";
// import { FoldersUsers } from '../models/index.js'

function formatObject(folder) {
  return  {
    "id": folder.id,
    "uuid": folder.uuid,
    "label1": folder.label1,
    "label2": folder.label2,
    "label3": folder.label3,
  }
}

async function findByName(name) {
  const group = await Folders.findOne({ where: { name } })
  return group
}

const getOne = async (req, res) => {
  return res.status(200).json( formatObject(req.folder) )
}

const getAll = async (req, res) => {
  const query = await Folders.findAll();
  const folders = query.map(folder => formatObject(folder))
  return res.status(200).json( folders )
}

const create = async (req, res) => {

  let uuid;
  let uuidExists;
  do {
    uuid = uuidv4();
    uuidExists = await Folders.findOne({ where: { uuid } });
  } while (uuidExists);

  const folder = await Folders.create({ 
    usuarioId: req.usuario.id,
    GroupId: req.body.groupId,
    uuid,
    label1: req.body.label1,
    label2: req.body.label2,
    label3: req.body.label3,
  })
  
  return res.status(201).send({ message: 'se ha creado con éxito', folder: formatObject(folder) })
}

const update = async (req, res) => {
  req.folder.update(req.body)
  return res.status(200).send({ message: 'Se ha actualizado con éxito', folder: formatObject(req.folder) })
}

const remove = async (req, res) => {
  await req.folder.destroy()
  return res.send({ message: 'Se ha eliminado con éxito' })
}

const addUserToFolder = async (req, res) => {

  const promises = req.usuarios.map( async user => {
    const data = {
      usuarioId: user.id,
      FolderId: req.folder.id
    };

    const alreadyAdded = await FoldersUsers.findOne({ where: data });
    if (!alreadyAdded) {
      await FoldersUsers.create(data);
    }
  });

  await Promise.all(promises);

  return res.status(200).send({ message: 'Usuarios agregado a la carpeta' });
}

const removeUserToFolder = async (req, res) => {

  const data = {
    usuarioId: req.user.id,
    FolderId: req.folder.id
  };

  const userInFolder = await FoldersUsers.findOne({ where: data });
  if (!userInFolder) {
    return res.status(400).send({ message: 'Usuario no se encuentra asociado a la carpeta' });
  }

  await userInFolder.destroy()

  return res.status(200).send({ message: 'Usuario eliminado de la carpeta correctamente' });
}

const getUserFolders = async (req, res) => {

  try {
   const usuarioConCarpetas = await Usuario.findOne({
     where: { id: req.usuario.id },
     include: [
       {
         model: Folders,
         as: 'Folders',
         through: { model: FoldersUsers },
       },
     ],
   });

   const foldersAsociatedUsers = usuarioConCarpetas.Folders.map(folder => formatObject(folder))
   let foldersOwnedByUser = await Folders.findAll({ where: { usuarioId: req.usuario.id } })
   foldersOwnedByUser.map(folder => formatObject(folder))

   const uniqueFoldersAsociated = foldersAsociatedUsers.filter( (item) => foldersOwnedByUser.includes(item) ? false : true)

   foldersOwnedByUser = foldersOwnedByUser.map(folder => formatObject(folder))
   return res.json({ data: uniqueFoldersAsociated.concat(foldersOwnedByUser) })

    // return res.json({ data: folders })
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

}

export {
  create,
  update,
  remove,
  getOne,
  getAll,
  addUserToFolder,
  removeUserToFolder,
  getUserFolders,
}
