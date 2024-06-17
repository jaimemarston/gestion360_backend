import { FoldersUsers } from '../../models/index.js'
import { getFolderWithParents } from '../../utils/index.js';

async function getRootFolder(folder) {

  if (folder.parent === null) {
    return folder;
  }
  const folderWithParents = await getFolderWithParents(folder.id);
  const rootFolder = folderWithParents.dataValues.parents.filter(parent => parent.dataValues.parent === null);
  return rootFolder[0]
}

const ownerOrAsociated = async (req, res, next) => {

  // Check if user is the owner of the folder
  const userIsOwner = req.folder.usuarioId === req.usuario.id

  // Check if user is asociated to the folder
  const rootFolder = await getRootFolder(req.folder);
  const userAsociatedToFolder = await FoldersUsers.findOne({ where: { usuarioId: req.usuario.id, FolderId: rootFolder.dataValues.id } })
  
  if (userIsOwner || userAsociatedToFolder) { 
    next();
  }else {
    return res.status(403).send({ message: 'No tienes permisos para realizar esta acción' })
  }

}


export { ownerOrAsociated }
