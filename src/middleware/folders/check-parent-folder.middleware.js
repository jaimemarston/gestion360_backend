import { Folders } from '../../models/index.js';

const checkParentFolder = async (req, res, next) => {

  if (req.body.parent !== null) {

    const parent = await Folders.findByPk(req.body.parent);
    if (parent === null) {
      return res.status(404).send({ message: 'Carpeta padre no encontrada' })
    }

    req.parent = parent;
  }

  next()

};

export { checkParentFolder }
