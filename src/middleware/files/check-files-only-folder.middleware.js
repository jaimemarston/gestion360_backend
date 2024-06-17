import { Folders } from '../../models/index.js';

const checkFilesOnlyFolder = async (req, res, next) => {

  const foldersInFolder = await Folders.findOne({ where: { parent: req.folder.id } });
  if (foldersInFolder !== null) {
    return res.status(400).send({ message: 'No puedes subir archivos una carpeta que tiene subcarpetas' })
  }

  next()
};

export { checkFilesOnlyFolder }
