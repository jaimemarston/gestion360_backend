import { Folders, MinioFiles } from '../../models/index.js';

const checkParentFolder = async (req, res, next) => {

  if (req.body.parent !== null) {

    const filesInFolder = await MinioFiles.findOne({ where: { FolderId: req.body.parent } });
    if (filesInFolder !== null) {
      return res.status(400).send({ message: 'No puedes crear una carpeta en otra donde hay archivos' })
    }


    const parent = await Folders.findByPk(req.body.parent);
    if (parent === null) {
      return res.status(404).send({ message: 'Carpeta padre no encontrada' })
    }

    req.parent = parent;
  }

  next()

};

export { checkParentFolder }
