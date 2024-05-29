import { MinioFiles } from '../../models/index.js'

const checkFileId = async (req, res, next) => {

  if (req.params.fileId === undefined || req.params.fileId === '') {
    return res.status(400).send({ message: 'El ID del archivo es requerido' })
  }

  const file = await MinioFiles.findByPk(req.params.fileId);
  if (!file) {
    return res.status(404).send({ message: 'Archivo no encontrado' })
  }

  req.file = file;

  next()
};

export { checkFileId }
