import { FoldersUsers } from '../../models/index.js'

const ownerOrAsociated = async (req, res, next) => {

  // Check if user is the owner of the folder
  const userIsOwner = req.folder.usuarioId === req.usuario.id

  // Check if user is asociated to the folder
  const userAsociatedToFolder = await FoldersUsers.findOne({ where: { usuarioId: req.usuario.id, FolderId: req.folder.id } })

  console.log(userIsOwner || userAsociatedToFolder);

  if (userIsOwner || userAsociatedToFolder) { 
    next();
  }else {
    return res.status(403).send({ message: 'No tienes permisos para realizar esta acción' })
  }

}


export { ownerOrAsociated }
