import { Folders, Groups, MinioFiles, FoldersUsers, Usuario, UserGroup } from '../models/index.js'
import { USER_ROLE } from '../utils/enums/user-role.enum.js'
import { v4 as uuidv4 } from 'uuid';
import { sequelize as Sequelize } from '../database/db.js';

function formatObject(group) {
  return {
    id: group.id,
    uuid: group.uuid,
    name: group.name,
  }
}


function formatFolder(folder) {
  return  {
    "id": folder.id,
    "uuid": folder.uuid,
    "label": folder.label,
    "parent": folder.parent,
    "group": folder.Group?.toJSON() || null,
    "children": folder.dataValues.children.map(formatFolder) // format children recursively
  }
}

async function findByName(name) {
  const group = await Groups.findOne({ where: { name } })
  return group
}

const getOne = async (req, res) => {
  
  const groupsWithFoldersAndDocuments = await Groups.findAll({
    where: { id: req.group.id },
    include: [
      {
        model: Folders,
        as: 'folders',
        include: [
          {
            model: MinioFiles,
            as: 'documents',
            // Aquí puedes agregar condiciones adicionales para los documentos si lo necesitas
          },
        ],
      },
    ],
  });

  return res.status(200).json(groupsWithFoldersAndDocuments)
}

const getAll = async (req, res) => {

    const yearFilterParam = req.query.year || null;
    const yearCondition = yearFilterParam 
    ? Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal(`YEAR FROM "Group"."createdAt"`)), yearFilterParam)
    : {};

    let allFolders = await Folders.findAll({
        include: [{
            model: Groups,
            as: 'Group',
            where: yearCondition
        }]
    });

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

    const formattedFolders = allFolders.map(formatFolder);

    let filteredFolders = formattedFolders.filter(folder => folder.parent === null)

    // If not admin filter folders by user
    if (req.usuario.dataValues.rol !== USER_ROLE.ADMIN) {

    const usuario = await Usuario.findByPk(req.usuario.dataValues.id);
    let grupos = await usuario.getUsergroup();

      let carpetasDirectas = await req.usuario.getFolders();

      let carpetasDeGrupos = [];
      for(let grupo of grupos) {
        let carpetas = await grupo.getFolders();
        carpetasDeGrupos.push(...carpetas);
      }

      filteredFolders = [...carpetasDirectas, ...carpetasDeGrupos];
    } 

  console.log({filteredFolders: filteredFolders.map(folder => folder.toJSON())})
    const groups = Array.from(
      filteredFolders
        .map(rootFolder => formatObject(rootFolder.group) )
        .reduce((map, group) => map.set(group.id, group), new Map())
        .values()
    );
  
    const result = groups.map(group => {
      const rootFolders = filteredFolders.filter(folder => folder.group.id === group.id);

      const rawData = rootFolders.map(folderWithGroup => {
        const objectCopy = Object.assign({}, folderWithGroup) // For some reason when I try to delete the group property it deletes the property from the original object
        delete objectCopy.group;
        return objectCopy
      });

      return {
        ...group,
        folders: rawData
      }
    })


    // If admin show all groups, even when they don't have folders
    if (req.usuario.dataValues.rol === USER_ROLE.ADMIN) {

      const yearConditionGroups = yearFilterParam 
      ? Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal(`YEAR FROM "createdAt"`)), yearFilterParam)
      : {};

      const allGroups = await Groups.findAll({ where: yearConditionGroups });

      const newGroups = allGroups.filter(allGroup => 
        !result.some(group => group.id === allGroup.id)
      );

      result.push(...newGroups.map(group => formatObject(group)) );
    }

    return res.status(200).json(result);
}

const create = async (req, res) => {

  const groupalreadtexists = await findByName(req.body.name);
  if (groupalreadtexists) {
    return res.status(400).send({ message: 'el grupo ya existe' })
  }

  let uuid;
  let uuidExists;
  do {
    uuid = uuidv4();
    uuidExists = await Groups.findOne({ where: { uuid } });
  } while (uuidExists);

  const group = await Groups.create({ name: req.body.name, uuid, usuarioId: req.usuario.id })

  return res.status(201).send({ message: 'se ha creado con éxito', group: formatObject(group) })
}

const update = async (req, res) => {
  const nameAlreadyInUse = await findByName(req.body.name);
  if (nameAlreadyInUse && req.group.id !== nameAlreadyInUse.id) {
    return res.status(400).send({ message: 'El nombre ya está en uso' })
  }

  req.group.update(req.body)
  return res.status(200).send({ message: 'Se ha actualizado con éxito', group: formatObject(req.group) })
}

const remove = async (req, res) => {
  await req.group.destroy()
  return res.send({ message: 'Se ha eliminado con éxito' })
}

export {
  create,
  update,
  remove,
  getOne,
  getAll
}
