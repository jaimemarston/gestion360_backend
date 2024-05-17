import { Folders } from '../../models/index.js'

const checkFolderId = async (req, res, next) => {

  if (req.params.folderId === undefined || req.params.folderId === '') {
    return res.status(400).send({ message: 'El ID de la carpeta es requerido' })
  }

  const folder = await Folders.findByPk(req.params.folderId);
  if (!folder) {
    return res.status(404).send({ message: 'Carpeta no encontrada' })
  }

  req.folder = folder;

  next()
};

export { checkFolderId }
