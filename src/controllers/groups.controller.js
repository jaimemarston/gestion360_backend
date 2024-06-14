import { Folders, Groups, MinioFiles, FoldersUsers } from '../models/index.js'
import { USER_ROLE } from '../utils/enums/user-role.enum.js'
import { v4 as uuidv4 } from 'uuid';

function formatObject(group) {
  return {
    id: group.id,
    uuid: group.uuid,
    name: group.name,
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

/* const getAll = async (req, res) => {
  const query = await Groups.findAll();
  const groups = query.map(group => formatObject(group))
  return res.status(200).json(groups)
} */

const getAll = async (req, res) => {

  let groupsWithFoldersAndDocuments;

  console.log(req.usuario.dataValues)
  console.log(USER_ROLE.ADMIN)
  console.log(req.usuario.dataValues.rol === USER_ROLE.ADMIN)

  if (req.usuario.dataValues.rol === USER_ROLE.ADMIN) {

    groupsWithFoldersAndDocuments = await Groups.findAll({
      include: [
        {
          model: Folders,
          as: 'folders',
          include: [
            {
              model: MinioFiles,
              as: 'documents',
            },
          ],
        },
      ],
    });

  } else {


    const folders = await Folders.findAll({ where: { usuarioId: req.usuario.id }});
    const asociated = await FoldersUsers.findAll({ where: { usuarioId: req.usuario.id } });


    const folderIds = [...new Set([...folders.map(folder => folder.dataValues.id), ...asociated.map(folder => folder.dataValues.FolderId)])];

    groupsWithFoldersAndDocuments = await Groups.findAll({
      include: [
        {
          model: Folders,
          as: 'folders',
          where: { id: folderIds },
          include: [
            {
              model: MinioFiles,
              as: 'documents',
            },
          ],
        },
      ],
    });

  }


  return res.status(200).json(groupsWithFoldersAndDocuments)
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

  const group = await Groups.create({ name: req.body.name, uuid })

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
