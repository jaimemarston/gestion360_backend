import { Folders, MinioFiles } from '../../models/index.js';

async function getFolderWithParents(id) {
    let folder = await Folders.findByPk(id);
    if (!folder) {
        return null;
    }

    let parents = [];
    let currentParentId = folder.parent;

    while (currentParentId) {
        let parentFolder = await Folders.findByPk(currentParentId);
        if (!parentFolder) {
            break;
        }
        parents.push(parentFolder);
        currentParentId = parentFolder.parent;
    }

    folder.dataValues.parents = parents;
    return folder;
}

const checkParentFolder = async (req, res, next) => {

  if (req.body.parent !== null) {

    const parent = await Folders.findByPk(req.body.parent);
    if (parent === null) {
      return res.status(404).send({ message: 'Carpeta padre no encontrada' })
    }

    const filesInFolder = await MinioFiles.findOne({ where: { FolderId: req.body.parent } });
    if (filesInFolder !== null) {
      return res.status(400).send({ message: 'No puedes crear una carpeta en otra donde hay archivos' })
    }

    const getFolderWithParentsResult = await getFolderWithParents(req.body.parent);
    if (getFolderWithParentsResult.dataValues.parents.length >= 2) {
      return res.status(400).send({ message: 'No puedes crear una carpeta en una carpeta que tiene más de 3 niveles de profundidad' })
    }

    if (req.body.user_ids !== null) {
      return res.status(400).send({ message: 'No puedes asociarle usuarios a una carpeta hijo' })
    }

    req.parent = parent;
  }

  next()

};

export { checkParentFolder }
