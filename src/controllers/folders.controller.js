import { Folders, FoldersUsers, Usuario, UserGroup } from '../models/index.js'
import { v4 as uuidv4 } from 'uuid';
import {  Sequelize } from "sequelize";
// import { FoldersUsers } from '../models/index.js'

function formatObject(folder) {
  return  {
    "id": folder.id,
    "uuid": folder.uuid,
    "label": folder.label,
    "parent": folder.parent,
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
    let allFolders = await Folders.findAll();

    let foldersMap = {};
    allFolders.forEach(folder => {
        foldersMap[folder.id] = folder;
        folder.dataValues.children = [];
    });

    allFolders.forEach(folder => {
      if (folder.parent) {
          foldersMap[folder.parent].dataValues.children.push(folder);
      }
    });

    const formatObject = (folder) => {
      return  {
        "id": folder.id,
        "uuid": folder.uuid,
        "label": folder.label,
        "parent": folder.parent,
        "children": folder.dataValues.children.map(formatObject) // format children recursively
      }
    }

    const formattedFolders = allFolders.map(formatObject);

    const filteredFolders = formattedFolders.filter(folder => folder.parent === null)

    return res.status(200).json(filteredFolders);
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
    label: req.body.label,
    parent: req.parent?.id || null
  })

  if (req.body.user_ids) {

    // Remove the user that is creating the folder
    const ids = req.body.user_ids.filter(id => id !== req.usuario.id)

    const usuarios = await Usuario.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: ids
        }
      }
    });

    const promises = usuarios.map( async user => {
      const data = {
        usuarioId: user.id,
        FolderId: folder.id
      };

      const alreadyAdded = await FoldersUsers.findOne({ where: data });
      if (!alreadyAdded) {
        await FoldersUsers.create(data);
      }
    });

    await Promise.all(promises);

  }
  
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

  if (req.folder.parent !== null) {
    return res.status(400).send({ message: 'Solo las carpetas raiz pueden recibir usuarios' });
  }

  const { usergroups_ids, user_ids } = req.body;
   
  if (user_ids && Array.isArray(user_ids) && user_ids.length > 0) {
    const users = await Usuario.findAll({ where: { id: { [Sequelize.Op.in]: user_ids } } });
    req.folder.addUsers(users);
  }
  
  if (usergroups_ids && Array.isArray(usergroups_ids) && usergroups_ids.length > 0) {
    const groups = await UserGroup.findAll({ where: { id: { [Sequelize.Op.in]: usergroups_ids } } });
    req.folder.addUsergroups(groups);
  }

  return res.status(200).send({ message: 'Usuarios agregado a la carpeta' });
}

const removeUserToFolder = async (req, res) => {

  if (req.folder.parent !== null) {
    return res.status(400).send({ message: 'Solo las carpetas raiz pueden recibir usuarios' });
  }

  const { usergroups_ids, user_ids } = req.body;
   
  if (user_ids && Array.isArray(user_ids) && user_ids.length > 0) {
    const users = await Usuario.findAll({ where: { id: { [Sequelize.Op.in]: user_ids } } });
    req.folder.removeUsers(users);
  }
  
  if (usergroups_ids && Array.isArray(usergroups_ids) && usergroups_ids.length > 0) {
    const groups = await UserGroup.findAll({ where: { id: { [Sequelize.Op.in]: usergroups_ids } } });
    req.folder.removeUsergroups(groups);
  }

  return res.status(200).send({ message: 'Usuarios eliminados de la carpeta correctamente' });
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
